import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { questionService } from '../../services/index.jsx';
import { FiThumbsUp, FiThumbsDown, FiCheckCircle, FiClock, FiEye, FiZap, FiInfo } from 'react-icons/fi';
import UserBadge from '../../components/UserBadge/UserBadge.jsx';
import './QuestionDetail.css';

const QuestionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answerContent, setAnswerContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [aiHelp, setAiHelp] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        fetchQuestion();
    }, [id]);

    const getAiHint = () => {
        setAiLoading(true);
        // Simulate AI thinking
        setTimeout(() => {
            const hints = {
                'Computer Science': "Break the problem into smaller functions. Check your syntax and ensure you're using the right data structures like Arrays or Objects for this task.",
                'Mathematics': "Review the fundamental formulas related to this topic. Try sketching the problem or simplifying the equation before solving for the variables.",
                'Physics': "Identify the known and unknown variables first. Apply the relevant laws (like Newton's or Thermodynamics) and double-check your units of measurement.",
                'Other': "Try looking at the problem from a different perspective. Collaborative learning works best when you share what you've tried so far!"
            };
            setAiHelp(hints[question.category] || hints['Other']);
            setAiLoading(false);
        }, 1500);
    };

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            const response = await questionService.getById(id);
            setQuestion(response.data.data);
        } catch (error) {
            console.error('Failed to fetch question:', error);
            setError('Failed to load question');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (voteType) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await questionService.vote(id, voteType);
            fetchQuestion();
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!answerContent.trim()) {
            setError('Please write an answer');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await questionService.postAnswer(id, answerContent);
            setAnswerContent('');
            fetchQuestion();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post answer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAnswerVote = async (answerId, voteType) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await questionService.voteAnswer(id, answerId, voteType);
            fetchQuestion();
        } catch (error) {
            console.error('Failed to vote on answer:', error);
        }
    };

    const handleAcceptAnswer = async (answerId) => {
        if (!isAuthenticated || user?._id !== question?.askedBy?._id) {
            return;
        }

        try {
            await questionService.acceptAnswer(id, answerId);
            fetchQuestion();
        } catch (error) {
            console.error('Failed to accept answer:', error);
        }
    };

    const formatDate = (date) => {
        const questionDate = new Date(date);
        return questionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error && !question) {
        return (
            <div className="question-detail-page">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Question Not Found</h2>
                        <button className="btn btn-primary" onClick={() => navigate('/questions')}>
                            Back to Questions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!question) return null;

    return (
        <div className="question-detail-page">
            <div className="container">
                {/* Question Section */}
                <div className="question-section card">
                    <div className="question-header-detail">
                        <h1>{question.title}</h1>
                        <div className="question-meta-detail">
                            <span className="badge badge-primary">{question.category}</span>
                            <span className="meta-item">
                                <FiClock />
                                Asked {formatDate(question.createdAt)}
                            </span>
                            <span className="meta-item">
                                <FiEye />
                                {question.views} views
                            </span>
                        </div>
                    </div>

                    <div className="question-body">
                        <div className="vote-section">
                            <button
                                className="vote-btn"
                                onClick={() => handleVote('upvote')}
                                disabled={!isAuthenticated}
                            >
                                <FiThumbsUp />
                            </button>
                            <span className="vote-count">{question.votes}</span>
                            <button
                                className="vote-btn"
                                onClick={() => handleVote('downvote')}
                                disabled={!isAuthenticated}
                            >
                                <FiThumbsDown />
                            </button>
                        </div>

                        <div className="question-content-detail">
                            <p>{question.content}</p>

                            {question.tags && question.tags.length > 0 && (
                                <div className="question-tags">
                                    {question.tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div className="question-author">
                                <span>Asked by <strong>{question.askedBy?.username}</strong></span>
                                <UserBadge reputation={question.askedBy?.reputation} size="sm" />
                            </div>

                            {/* NEW: AI Assistant Feature */}
                            <div className="ai-helper-section mt-1">
                                {!aiHelp ? (
                                    <button 
                                        className={`btn btn-secondary ai-btn ${aiLoading ? 'pulse' : ''}`}
                                        onClick={getAiHint}
                                        disabled={aiLoading}
                                    >
                                        <FiZap className="zap-icon" />
                                        {aiLoading ? 'Thinking...' : '✨ Ask AI for a Hint'}
                                    </button>
                                ) : (
                                    <div className="ai-hint-box fade-in">
                                        <div className="ai-hint-header">
                                            <FiInfo />
                                            <span>AI Study Assistant Hint:</span>
                                        </div>
                                        <p>{aiHelp}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="answers-section">
                    <h2>{question.answers?.length || 0} Answers</h2>

                    {question.answers && question.answers.length > 0 ? (
                        <div className="answers-list">
                            {question.answers.map((answer) => (
                                <div
                                    key={answer._id}
                                    className={`answer-card card ${answer.isAccepted ? 'accepted-answer' : ''}`}
                                >
                                    <div className="answer-body">
                                        <div className="vote-section">
                                            <button
                                                className="vote-btn"
                                                onClick={() => handleAnswerVote(answer._id, 'upvote')}
                                                disabled={!isAuthenticated}
                                            >
                                                <FiThumbsUp />
                                            </button>
                                            <span className="vote-count">{answer.votes}</span>
                                            <button
                                                className="vote-btn"
                                                onClick={() => handleAnswerVote(answer._id, 'downvote')}
                                                disabled={!isAuthenticated}
                                            >
                                                <FiThumbsDown />
                                            </button>
                                            {isAuthenticated && user?._id === question.askedBy?._id && !question.hasAcceptedAnswer && (
                                                <button
                                                    className="accept-btn"
                                                    onClick={() => handleAcceptAnswer(answer._id)}
                                                    title="Accept this answer"
                                                >
                                                    <FiCheckCircle />
                                                </button>
                                            )}
                                            {answer.isAccepted && (
                                                <div className="accepted-badge">
                                                    <FiCheckCircle />
                                                    <span>Accepted</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="answer-content">
                                            <p>{answer.content}</p>

                                            <div className="answer-footer">
                                                <span>Answered by <strong>{answer.answeredBy?.username}</strong></span>
                                                <UserBadge reputation={answer.answeredBy?.reputation} size="sm" />
                                                <span className="answer-date">{formatDate(answer.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-answers">
                            <p>No answers yet. Be the first to answer!</p>
                        </div>
                    )}
                </div>

                {/* Answer Form */}
                <div className="answer-form-section card">
                    <h3>Your Answer</h3>

                    {!isAuthenticated ? (
                        <div className="login-prompt">
                            <p>Please <a href="/login">login</a> to post an answer</p>
                        </div>
                    ) : (
                        <form onSubmit={handleAnswerSubmit}>
                            {error && <div className="alert alert-error">{error}</div>}

                            <div className="form-group">
                                <textarea
                                    className="form-control"
                                    placeholder="Write your answer here... Be clear and helpful!"
                                    value={answerContent}
                                    onChange={(e) => setAnswerContent(e.target.value)}
                                    rows="8"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? 'Posting...' : 'Post Your Answer'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionDetail;

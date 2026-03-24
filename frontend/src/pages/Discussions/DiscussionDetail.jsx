import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { discussionService } from '../../services/index.jsx';
import { FiThumbsUp, FiMessageSquare, FiEye, FiClock, FiSend } from 'react-icons/fi';
import './DiscussionDetail.css';

const DiscussionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [discussion, setDiscussion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDiscussion();
    }, [id]);

    const fetchDiscussion = async () => {
        try {
            setLoading(true);
            const response = await discussionService.getById(id);
            setDiscussion(response.data.data);
        } catch (error) {
            console.error('Failed to fetch discussion:', error);
            setError('Failed to load discussion');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await discussionService.like(id);
            fetchDiscussion();
        } catch (error) {
            console.error('Failed to like discussion:', error);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!replyContent.trim()) {
            setError('Please write a reply');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await discussionService.reply(id, replyContent);
            setReplyContent('');
            fetchDiscussion();
        } catch (err) {
            console.error('Error posting reply:', err);
            setError(err.response?.data?.message || 'Failed to post reply');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReplyLike = async (replyId) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await discussionService.likeReply(id, replyId);
            fetchDiscussion();
        } catch (error) {
            console.error('Failed to like reply:', error);
        }
    };

    const formatDate = (date) => {
        const discussionDate = new Date(date);
        return discussionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isLiked = () => {
        if (!isAuthenticated || !discussion) return false;
        return discussion.likes?.some(like => like._id === user?._id || like === user?._id);
    };

    const isReplyLiked = (reply) => {
        if (!isAuthenticated || !reply) return false;
        return reply.likes?.some(like => like._id === user?._id || like === user?._id);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error && !discussion) {
        return (
            <div className="discussion-detail-page">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Discussion Not Found</h2>
                        <button className="btn btn-primary" onClick={() => navigate('/discussions')}>
                            Back to Discussions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!discussion) return null;

    return (
        <div className="discussion-detail-page">
            <div className="container">
                {/* Discussion Section */}
                <div className={`discussion-section card ${discussion.isPinned ? 'pinned' : ''}`}>
                    <div className="discussion-header-detail">
                        {discussion.isPinned && <span className="pin-badge">📌 Pinned</span>}
                        <h1>{discussion.title}</h1>
                        <div className="discussion-meta-detail">
                            <span className="badge badge-primary">{discussion.category}</span>
                            <span className="meta-item">
                                <FiClock />
                                Posted {formatDate(discussion.createdAt)}
                            </span>
                            <span className="meta-item">
                                <FiEye />
                                {discussion.views || 0} views
                            </span>
                        </div>
                    </div>

                    <div className="discussion-body">
                        <div className="discussion-content-detail">
                            <p>{discussion.content}</p>

                            {discussion.tags && discussion.tags.length > 0 && (
                                <div className="discussion-tags">
                                    {discussion.tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div className="discussion-footer-detail">
                                <div className="discussion-author">
                                    <span>Started by <strong>{discussion.createdBy?.username}</strong></span>
                                    <span className="reputation-badge">{discussion.createdBy?.reputation || 0}</span>
                                </div>

                                <div className="discussion-actions">
                                    <button
                                        className={`like-btn ${isLiked() ? 'liked' : ''}`}
                                        onClick={handleLike}
                                        disabled={!isAuthenticated}
                                    >
                                        <FiThumbsUp />
                                        <span>{discussion.likes?.length || 0} Likes</span>
                                    </button>
                                    <div className="replies-count">
                                        <FiMessageSquare />
                                        <span>{discussion.replies?.length || 0} Replies</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Replies Section */}
                <div className="replies-section">
                    <h2>{discussion.replies?.length || 0} Replies</h2>

                    {discussion.replies && discussion.replies.length > 0 ? (
                        <div className="replies-list">
                            {discussion.replies.map((reply) => (
                                <div key={reply._id} className="reply-card card">
                                    <div className="reply-content">
                                        <p>{reply.content}</p>

                                        <div className="reply-footer">
                                            <div className="reply-footer">
                                                <div className="reply-author">
                                                    <span>By <strong>{reply.author?.username}</strong></span>
                                                    <span className="reputation-badge">{reply.author?.reputation || 0}</span>
                                                    <span className="reply-date">{formatDate(reply.createdAt)}</span>
                                                </div>                      </div>

                                            <button
                                                className={`like-btn-small ${isReplyLiked(reply) ? 'liked' : ''}`}
                                                onClick={() => handleReplyLike(reply._id)}
                                                disabled={!isAuthenticated}
                                            >
                                                <FiThumbsUp />
                                                <span>{reply.likes?.length || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-replies">
                            <p>No replies yet. Be the first to reply!</p>
                        </div>
                    )}
                </div>

                {/* Reply Form */}
                <div className="reply-form-section card">
                    <h3>Add Your Reply</h3>

                    {!isAuthenticated ? (
                        <div className="login-prompt">
                            <p>Please <a href="/login">login</a> to post a reply</p>
                        </div>
                    ) : (
                        <form onSubmit={handleReplySubmit}>
                            {error && <div className="alert alert-error">{error}</div>}

                            <div className="form-group">
                                <textarea
                                    className="form-control"
                                    placeholder="Share your thoughts on this discussion..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    rows="6"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                <FiSend />
                                {submitting ? 'Posting...' : 'Post Reply'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscussionDetail;

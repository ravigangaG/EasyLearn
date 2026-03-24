import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../../services/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiThumbsUp, FiThumbsDown, FiMessageSquare, FiCheckCircle, FiFilter } from 'react-icons/fi';
import UserBadge from '../../components/UserBadge/UserBadge.jsx';
import './Questions.css';

const Questions = () => {
    const { isAuthenticated } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        sort: 'newest',
        status: ''
    });
    const searchTimeoutRef = useRef(null);
    const searchInputRef = useRef(null);
    const isInitialMount = useRef(true);

    const categories = [
        'Computer Science',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Engineering',
        'Business',
        'Arts',
        'Languages',
        'Other'
    ];

    useEffect(() => {
        fetchQuestions();
    }, [filters.category, filters.sort, filters.status, filters.search]);

    const fetchQuestions = async () => {
        try {
            if (isInitialMount.current) {
                setLoading(true);
            }
            const response = await questionService.getAll(filters);
            setQuestions(response.data.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            if (isInitialMount.current) {
                setLoading(false);
                isInitialMount.current = false;
            }
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setFilters(prev => ({
                ...prev,
                search: value
            }));
        }, 800);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDate = (date) => {
        const now = new Date();
        const questionDate = new Date(date);
        const diffTime = Math.abs(now - questionDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return questionDate.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="questions-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Questions & Answers</h1>
                        <p>Ask questions and help your peers</p>
                    </div>
                    {isAuthenticated && (
                        <Link to="/questions/ask" className="btn btn-primary">
                            Ask Question
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="filters-section card">
                    <div className="filters-grid">
                        <div className="form-group">
                            <label className="form-label">
                                <FiFilter />
                                Search
                            </label>
                            <input
                                ref={searchInputRef}
                                type="text"
                                name="search"
                                className="form-control"
                                placeholder="Search questions..."
                                value={searchInput}
                                onChange={handleSearchChange}
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                className="form-control"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-control"
                                value={filters.status}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Questions</option>
                                <option value="answered">Answered</option>
                                <option value="unanswered">Unanswered</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Sort By</label>
                            <select
                                name="sort"
                                className="form-control"
                                value={filters.sort}
                                onChange={handleFilterChange}
                            >
                                <option value="newest">Newest First</option>
                                <option value="votes">Most Voted</option>
                                <option value="views">Most Viewed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="questions-list">
                    {questions.length === 0 ? (
                        <div className="empty-state card">
                            <p>No questions found</p>
                            {isAuthenticated && (
                                <Link to="/questions/ask" className="btn btn-primary">
                                    Be the first to ask!
                                </Link>
                            )}
                        </div>
                    ) : (
                        questions.map(question => (
                            <div key={question._id} className="question-card card">
                                <div className="question-stats">
                                    <div className="stat-item">
                                        <div className="stat-value">{question.votes}</div>
                                        <div className="stat-label">votes</div>
                                    </div>
                                    <div className={`stat-item ${question.hasAcceptedAnswer ? 'accepted' : ''}`}>
                                        <div className="stat-value">
                                            {question.answers?.length || 0}
                                            {question.hasAcceptedAnswer && <FiCheckCircle className="check-icon" />}
                                        </div>
                                        <div className="stat-label">answers</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{question.views}</div>
                                        <div className="stat-label">views</div>
                                    </div>
                                </div>

                                <div className="question-content">
                                    <div className="question-header">
                                        <Link to={`/questions/${question._id}`} className="question-title">
                                            {question.title}
                                        </Link>
                                        <span className="badge badge-primary">{question.category}</span>
                                    </div>

                                    <p className="question-excerpt">
                                        {question.content.substring(0, 200)}
                                        {question.content.length > 200 && '...'}
                                    </p>

                                    <div className="question-tags">
                                        {question.tags.map((tag, index) => (
                                            <span key={index} className="tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="question-footer">
                                        <div className="author-info">
                                            <span className="author-name">
                                                {question.askedBy?.username}
                                            </span>
                                            <UserBadge 
                                                reputation={question.askedBy?.reputation} 
                                                size="sm" 
                                            />
                                        </div>
                                        <div className="question-meta">
                                            <span className="date">{formatDate(question.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Questions;

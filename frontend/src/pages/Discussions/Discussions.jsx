import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { discussionService } from '../../services/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiMessageSquare, FiThumbsUp, FiEye, FiFilter } from 'react-icons/fi';
import './Discussions.css';

const Discussions = () => {
    const { isAuthenticated } = useAuth();
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        sort: 'newest'
    });
    const searchTimeoutRef = useRef(null);
    const searchInputRef = useRef(null);
    const isInitialMount = useRef(true);

    const categories = [
        'General',
        'Study Tips',
        'Career Advice',
        'Project Ideas',
        'Exam Preparation',
        'Technology',
        'Research',
        'Other'
    ];

    useEffect(() => {
        fetchDiscussions();
    }, [filters.category, filters.sort, filters.search]);

    const fetchDiscussions = async () => {
        try {
            if (isInitialMount.current) {
                setLoading(true);
            }
            const response = await discussionService.getAll(filters);
            setDiscussions(response.data.data);
        } catch (error) {
            console.error('Failed to fetch discussions:', error);
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
        const discussionDate = new Date(date);
        const diffTime = Math.abs(now - discussionDate);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.ceil(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return discussionDate.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="discussions-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Discussions</h1>
                        <p>Join the conversation and share ideas</p>
                    </div>
                    {isAuthenticated && (
                        <Link to="/discussions/new" className="btn btn-primary">
                            Start Discussion
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
                                placeholder="Search discussions..."
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
                            <label className="form-label">Sort By</label>
                            <select
                                name="sort"
                                className="form-control"
                                value={filters.sort}
                                onChange={handleFilterChange}
                            >
                                <option value="newest">Newest First</option>
                                <option value="popular">Most Popular</option>
                                <option value="views">Most Viewed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Discussions List */}
                <div className="discussions-list">
                    {discussions.length === 0 ? (
                        <div className="empty-state card">
                            <p>No discussions found</p>
                            {isAuthenticated && (
                                <Link to="/discussions/new" className="btn btn-primary">
                                    Start the conversation!
                                </Link>
                            )}
                        </div>
                    ) : (
                        discussions.map(discussion => (
                            <div key={discussion._id} className={`discussion-card card ${discussion.isPinned ? 'pinned' : ''}`}>
                                <div className="discussion-content">
                                    <div className="discussion-header">
                                        <Link to={`/discussions/${discussion._id}`} className="discussion-title">
                                            {discussion.isPinned && <span className="pin-icon">📌</span>}
                                            {discussion.title}
                                        </Link>
                                        <span className="badge badge-primary">{discussion.category}</span>
                                    </div>

                                    <p className="discussion-excerpt">
                                        {discussion.content.substring(0, 200)}
                                        {discussion.content.length > 200 && '...'}
                                    </p>

                                    <div className="discussion-tags">
                                        {discussion.tags?.map((tag, index) => (
                                            <span key={index} className="tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="discussion-footer">
                                        <div className="author-info">
                                            <span className="author-name">
                                                {discussion.createdBy?.username}
                                            </span>
                                            <span className="date">{formatDate(discussion.createdAt)}</span>
                                        </div>

                                        <div className="discussion-stats">
                                            <div className="stat">
                                                <FiMessageSquare />
                                                <span>{discussion.replies?.length || 0}</span>
                                            </div>
                                            <div className="stat">
                                                <FiThumbsUp />
                                                <span>{discussion.likes?.length || 0}</span>
                                            </div>
                                            <div className="stat">
                                                <FiEye />
                                                <span>{discussion.views || 0}</span>
                                            </div>
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

export default Discussions;

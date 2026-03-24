import React, { useState, useEffect, useRef } from 'react';
import { resourceService, userService } from '../../services/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiDownload, FiStar, FiBookmark, FiFilter, FiEye } from 'react-icons/fi';
import UserBadge from '../../components/UserBadge/UserBadge.jsx';
import './Resources.css';

const Resources = () => {
    const { user, isAuthenticated } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        sort: 'newest'
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
        fetchResources();
        fetchBookmarks(); // Fetch bookmarks when component mounts or filters change
    }, [filters.category, filters.sort, filters.search]);

    useEffect(() => {
        fetchBookmarks(); // Also fetch when authentication state changes
    }, [isAuthenticated]);

    const fetchResources = async () => {
        try {
            // Don't show loading spinner after initial load
            if (isInitialMount.current) {
                setLoading(true);
            }
            const response = await resourceService.getAll(filters);
            setResources(response.data.data);
        } catch (error) {
            console.error('Failed to fetch resources:', error);
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

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for debounced search
        searchTimeoutRef.current = setTimeout(() => {
            setFilters(prev => ({
                ...prev,
                search: value
            }));
        }, 800); // Increased to 800ms for better stability
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchBookmarks = async () => {
        if (isAuthenticated) {
            try {
                const response = await userService.getBookmarkedResources();
                const ids = response.data.data.map(resource => resource._id);
                console.log('Fetched bookmarked IDs:', ids);
                setBookmarkedIds(ids);
            } catch (error) {
                console.error('Failed to fetch bookmarks:', error);
                setBookmarkedIds([]); // Reset to empty array on error
            }
        } else {
            setBookmarkedIds([]); // Clear bookmarks when not authenticated
        }
    };

    const handleBookmark = async (resourceId, e) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('Please login to bookmark resources');
            return;
        }

        try {
            const isBookmarked = bookmarkedIds.includes(resourceId);

            if (isBookmarked) {
                await userService.unbookmarkResource(resourceId);
                setBookmarkedIds(prev => prev.filter(id => id !== resourceId));
            } else {
                await userService.bookmarkResource(resourceId);
                setBookmarkedIds(prev => [...prev, resourceId]);
            }
        } catch (error) {
            console.error('Failed to bookmark resource:', error);
            alert(error.response?.data?.message || 'Failed to bookmark resource');
        }
    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <FiStar
                key={i}
                className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
            />
        ));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="resources-page">
            <div className="container">
                <div className="page-header">
                    <h1>Learning Resources</h1>
                    <p>Discover and share educational materials</p>
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
                                placeholder="Search resources..."
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
                                <option value="popular">Most Downloaded</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="resources-grid">
                    {resources.length === 0 ? (
                        <div className="empty-state">
                            <p>No resources found</p>
                        </div>
                    ) : (
                        resources.map(resource => {
                            console.log(`Checking ${resource.title}: ID=${resource._id}, Bookmarked=${bookmarkedIds.includes(resource._id)}, BookmarkedIds=`, bookmarkedIds);

                            // Get category icon emoji
                            const getCategoryIcon = (category) => {
                                const icons = {
                                    'Computer Science': '💻',
                                    'Mathematics': '📐',
                                    'Physics': '⚛️',
                                    'Chemistry': '🧪',
                                    'Biology': '🧬',
                                    'Engineering': '⚙️',
                                    'Business': '💼',
                                    'Arts': '🎨',
                                    'Languages': '🌍',
                                    'Other': '📚'
                                };
                                return icons[category] || '📚';
                            };

                            return (
                                <div
                                    key={resource._id}
                                    className="resource-card card"
                                >
                                    {/* Thumbnail Image */}
                                    {resource.thumbnail ? (
                                        <img
                                            src={resource.thumbnail}
                                            alt={resource.title}
                                            className="resource-thumbnail"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="resource-thumbnail-placeholder"
                                        style={{ display: resource.thumbnail ? 'none' : 'flex' }}
                                    >
                                        {getCategoryIcon(resource.category)}
                                    </div>

                                    <div className="resource-content">
                                        <div className="resource-header">
                                            <h3
                                                onClick={() => window.location.href = `/resources/${resource._id}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {resource.title}
                                            </h3>
                                            <span className={`badge badge-${resource.difficultyLevel}`}>
                                                {resource.difficultyLevel}
                                            </span>
                                        </div>

                                        <p className="resource-description">
                                            {resource.description}
                                        </p>

                                        <div className="resource-tags">
                                            {resource.tags?.map((tag, index) => (
                                                <span key={index} className="tag">{tag}</span>
                                            ))}
                                        </div>

                                        <div className="resource-meta">
                                            <div className="rating">
                                                {renderStars(resource.averageRating)}
                                                <span className="rating-count">
                                                    ({resource.totalRatings})
                                                </span>
                                            </div>
                                            <div className="downloads">
                                                <FiEye />
                                                {resource.views}
                                            </div>
                                        </div>

                                        <div className="resource-footer">
                                            <div className="author-info">
                                                <span className="author-name">
                                                    {resource.uploadedBy?.username}
                                                </span>
                                                <UserBadge reputation={resource.uploadedBy?.reputation} size="sm" />
                                            </div>
                                            <div className="resource-actions">
                                                <button
                                                    className={`btn btn-sm ${bookmarkedIds.includes(resource._id) ? 'btn-primary' : 'btn-secondary'}`}
                                                    onClick={(e) => handleBookmark(resource._id, e)}
                                                    title={bookmarkedIds.includes(resource._id) ? 'Remove bookmark' : 'Bookmark resource'}
                                                >
                                                    <FiBookmark style={{
                                                        fill: bookmarkedIds.includes(resource._id) ? 'currentColor' : 'none'
                                                    }} />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `/resources/${resource._id}`;
                                                    }}
                                                >
                                                    <FiEye />
                                                    Watch Tutorial
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Resources;

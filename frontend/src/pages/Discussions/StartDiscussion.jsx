import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { discussionService } from '../../services/index.jsx';
import { FiMessageSquare, FiTag } from 'react-icons/fi';
import './StartDiscussion.css';

const StartDiscussion = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        tags: ''
    });

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isAuthenticated) {
            setError('Please login to start a discussion');
            navigate('/login');
            return;
        }

        if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            const tagsArray = formData.tags && typeof formData.tags === 'string'
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                : [];

            const discussionData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                category: formData.category,
                tags: tagsArray
            };

            await discussionService.create(discussionData);
            navigate('/discussions');
        } catch (err) {
            console.error('Error creating discussion:', err);
            setError(err.response?.data?.message || 'Failed to create discussion');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="start-discussion-page">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Please Login</h2>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            You need to be logged in to start a discussion
                        </p>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: '1.5rem' }}
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="start-discussion-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Start a Discussion</h1>
                        <p>Share ideas and engage with the community</p>
                    </div>
                </div>

                <div className="start-discussion-form card">
                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiMessageSquare />
                                Discussion Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="e.g., Best Study Techniques for Exam Preparation"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                maxLength="200"
                            />
                            <small className="form-hint">
                                Make it clear and engaging to attract participants
                            </small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select
                                name="category"
                                className="form-control"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Discussion Content *</label>
                            <textarea
                                name="content"
                                className="form-control"
                                placeholder="Share your thoughts, ask for opinions, or start a conversation about a topic..."
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows="10"
                            />
                            <small className="form-hint">
                                Provide context and encourage others to share their perspectives
                            </small>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiTag />
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                className="form-control"
                                placeholder="e.g., study tips, productivity, motivation"
                                value={formData.tags}
                                onChange={handleChange}
                            />
                            <small className="form-hint">
                                Add up to 5 tags to help others find your discussion
                            </small>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Start Discussion'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/discussions')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div className="tips-card card">
                    <h3>Tips for starting a great discussion:</h3>
                    <ul>
                        <li>✓ Choose a topic that interests the community</li>
                        <li>✓ Be respectful and open to different viewpoints</li>
                        <li>✓ Provide context to help others understand</li>
                        <li>✓ Ask thought-provoking questions</li>
                        <li>✓ Engage with replies to keep the conversation going</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StartDiscussion;

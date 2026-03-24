import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { questionService } from '../../services/index.jsx';
import { FiHelpCircle, FiTag } from 'react-icons/fi';
import './AskQuestion.css';

const AskQuestion = () => {
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
            setError('Please login to ask a question');
            navigate('/login');
            return;
        }

        if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            // Process tags - ensure it's a string and handle empty case
            const tagsArray = formData.tags && typeof formData.tags === 'string'
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                : [];

            const questionData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                category: formData.category,
                tags: tagsArray
            };

            await questionService.create(questionData);
            navigate('/questions');
        } catch (err) {
            console.error('Error posting question:', err);
            setError(err.response?.data?.message || 'Failed to post question');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="ask-question-page">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Please Login</h2>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            You need to be logged in to ask a question
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
        <div className="ask-question-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Ask a Question</h1>
                        <p>Get help from the community</p>
                    </div>
                </div>

                <div className="ask-question-form card">
                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiHelpCircle />
                                Question Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="e.g., How do I learn JavaScript effectively?"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                maxLength="200"
                            />
                            <small className="form-hint">
                                Be specific and imagine you're asking a question to another person
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
                            <label className="form-label">Question Details *</label>
                            <textarea
                                name="content"
                                className="form-control"
                                placeholder="Provide all the details about your question. What have you tried? What are you expecting?"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows="10"
                            />
                            <small className="form-hint">
                                Include all the information someone would need to answer your question
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
                                placeholder="e.g., javascript, react, beginner"
                                value={formData.tags}
                                onChange={handleChange}
                            />
                            <small className="form-hint">
                                Add up to 5 tags to describe what your question is about
                            </small>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : 'Post Your Question'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/questions')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div className="tips-card card">
                    <h3>Tips for asking a good question:</h3>
                    <ul>
                        <li>✓ Make your title specific and clear</li>
                        <li>✓ Explain what you've already tried</li>
                        <li>✓ Include relevant code or examples</li>
                        <li>✓ Use proper formatting and grammar</li>
                        <li>✓ Add relevant tags to help others find your question</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AskQuestion;

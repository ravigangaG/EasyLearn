import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourceService } from '../../services/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiArrowLeft, FiBookmark, FiStar, FiEye, FiEdit, FiSave, FiX } from 'react-icons/fi';
import './ResourceDetail.css';

const ResourceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const [editingNotes, setEditingNotes] = useState(false);

    useEffect(() => {
        fetchResource();
    }, [id]);

    const fetchResource = async () => {
        try {
            setLoading(true);
            const response = await resourceService.getById(id);
            setResource(response.data.data);
            // Load user's notes if they exist
            if (response.data.data.userNotes) {
                setNotes(response.data.data.userNotes);
            }
        } catch (error) {
            console.error('Failed to fetch resource:', error);
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        // Convert YouTube URL to embed URL
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const handleSaveNotes = () => {
        // Save notes to localStorage for now (can be saved to backend later)
        localStorage.setItem(`notes_${id}`, notes);
        setEditingNotes(false);
        alert('Notes saved!');
    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <FiStar
                key={i}
                style={{
                    fill: i < Math.floor(rating) ? 'var(--primary)' : 'none',
                    color: 'var(--primary)',
                    marginRight: '0.25rem'
                }}
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

    if (!resource) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Resource not found</h2>
                <button className="btn btn-primary" onClick={() => navigate('/resources')}>
                    Back to Resources
                </button>
            </div>
        );
    }

    const embedUrl = getYouTubeEmbedUrl(resource.fileUrl);

    return (
        <div className="resource-detail-page">
            <div className="container">
                {/* Back Button */}
                <button className="btn btn-secondary" onClick={() => navigate('/resources')} style={{ marginBottom: '2rem' }}>
                    <FiArrowLeft />
                    Back to Resources
                </button>

                <div className="resource-detail-container">
                    {/* Video Section */}
                    <div className="video-section card">
                        <h1>{resource.title}</h1>

                        {embedUrl ? (
                            <div className="video-container">
                                <iframe
                                    src={embedUrl}
                                    title={resource.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="no-video">
                                <p>Video not available</p>
                                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Open Link
                                </a>
                            </div>
                        )}

                        {/* Resource Info */}
                        <div className="resource-info">
                            <div className="info-row">
                                <span className={`badge badge-${resource.difficultyLevel}`}>
                                    {resource.difficultyLevel}
                                </span>
                                <span className="badge badge-primary">{resource.category}</span>
                            </div>

                            <div className="info-row">
                                <div className="rating">
                                    {renderStars(resource.averageRating)}
                                    <span>({resource.totalRatings} ratings)</span>
                                </div>
                                <div className="views">
                                    <FiEye />
                                    {resource.views} views
                                </div>
                            </div>

                            <p className="description">{resource.description}</p>

                            <div className="tags">
                                {resource.tags?.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>

                            <div className="author-info">
                                <span>Uploaded by: <strong>{resource.uploadedBy?.username}</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="notes-section card">
                        <div className="notes-header">
                            <h2>My Notes</h2>
                            {!editingNotes ? (
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setEditingNotes(true)}
                                >
                                    <FiEdit />
                                    Edit Notes
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={handleSaveNotes}
                                    >
                                        <FiSave />
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setEditingNotes(false)}
                                    >
                                        <FiX />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {editingNotes ? (
                            <textarea
                                className="notes-editor"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Write your notes here..."
                                rows={15}
                            />
                        ) : (
                            <div className="notes-display">
                                {notes ? (
                                    <pre>{notes}</pre>
                                ) : (
                                    <p className="text-secondary">No notes yet. Click "Edit Notes" to add some!</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetail;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { userService, resourceService, questionService } from '../../services/index.jsx';
import { FiUser, FiMail, FiAward, FiBook, FiHelpCircle, FiEdit2 } from 'react-icons/fi';
import UserBadge from '../../components/UserBadge/UserBadge.jsx';
import './Profile.css';
const Profile = () => {
    const { user, updateUser } = useAuth();
    const [stats, setStats] = useState({
        resources: 0,
        questions: 0,
        answers: 0
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [savedResources, setSavedResources] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        interests: '',
        expertise: '',
        institution: '',
        yearOfStudy: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                bio: user.profile?.bio || '',
                interests: user.profile?.interests?.join(', ') || '',
                expertise: user.profile?.expertise?.join(', ') || '',
                institution: user.profile?.institution || '',
                yearOfStudy: user.profile?.yearOfStudy || ''
            });
            fetchUserStats();
        }
    }, [user]);

    const fetchUserStats = async () => {
        try {
            setLoading(true);
            const response = await userService.getProfile(user._id);
            setStats(response.data.data.stats);

            // Fetch saved resources
            const savedResponse = await userService.getBookmarkedResources();
            setSavedResources(savedResponse.data.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            setProfilePicture(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const profileData = {
                username: formData.username,
                email: formData.email,
                profile: {
                    bio: formData.bio,
                    interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
                    expertise: formData.expertise.split(',').map(e => e.trim()).filter(e => e),
                    institution: formData.institution,
                    yearOfStudy: formData.yearOfStudy
                }
            };

            // If profile picture is selected, convert to base64 and include
            if (profilePicture) {
                profileData.profile.avatar = profilePicturePreview;
            }

            const response = await userService.updateProfile(profileData);
            updateUser(response.data.data);
            setEditing(false);
            setProfilePicture(null);
            setProfilePicturePreview(null);
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        }
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Please login to view your profile</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.profile?.avatar || profilePicturePreview ? (
                            <img
                                src={profilePicturePreview || user.profile.avatar}
                                alt={user.username}
                                className="avatar-image"
                            />
                        ) : (
                            <FiUser />
                        )}
                    </div>
                    <div className="profile-info">
                        <h1>{user.username}</h1>
                        <p className="profile-email">{user.email}</p>
                        <UserBadge reputation={user.reputation || 0} size="lg" />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setEditing(!editing)}
                    >
                        <FiEdit2 />
                        {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon">
                            <FiBook />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.resources}</div>
                            <div className="stat-label">Resources Shared</div>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">
                            <FiHelpCircle />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.questions}</div>
                            <div className="stat-label">Questions Asked</div>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">
                            <FiAward />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.answers}</div>
                            <div className="stat-label">Answers Given</div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                {editing ? (
                    <div className="profile-edit card">
                        <h2>Edit Profile</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Profile Picture Upload */}
                            <div className="form-group">
                                <label className="form-label">Profile Picture</label>
                                <div className="profile-picture-upload">
                                    <div className="picture-preview">
                                        {profilePicturePreview || user.profile?.avatar ? (
                                            <img
                                                src={profilePicturePreview || user.profile?.avatar}
                                                alt="Profile preview"
                                                className="preview-image"
                                            />
                                        ) : (
                                            <div className="preview-placeholder">
                                                <FiUser />
                                                <span>No image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="picture-upload-controls">
                                        <input
                                            type="file"
                                            id="profilePicture"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="profilePicture" className="btn btn-secondary">
                                            Choose Image
                                        </label>
                                        <small className="form-hint">
                                            Max size: 5MB. Supported formats: JPG, PNG, GIF
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Bio</label>
                                <textarea
                                    name="bio"
                                    className="form-control"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself..."
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Interests (comma separated)</label>
                                <input
                                    type="text"
                                    name="interests"
                                    className="form-control"
                                    value={formData.interests}
                                    onChange={handleChange}
                                    placeholder="e.g., Programming, Mathematics, Physics"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Expertise (comma separated)</label>
                                <input
                                    type="text"
                                    name="expertise"
                                    className="form-control"
                                    value={formData.expertise}
                                    onChange={handleChange}
                                    placeholder="e.g., JavaScript, Python, Data Science"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Institution</label>
                                <input
                                    type="text"
                                    name="institution"
                                    className="form-control"
                                    value={formData.institution}
                                    onChange={handleChange}
                                    placeholder="Your school or university"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Year of Study</label>
                                <input
                                    type="text"
                                    name="yearOfStudy"
                                    className="form-control"
                                    value={formData.yearOfStudy}
                                    onChange={handleChange}
                                    placeholder="e.g., 2nd Year, Final Year"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="profile-details card">
                        <h2>Profile Details</h2>

                        {user.profile?.bio && (
                            <div className="detail-section">
                                <h3>Bio</h3>
                                <p>{user.profile.bio}</p>
                            </div>
                        )}

                        {user.profile?.interests?.length > 0 && (
                            <div className="detail-section">
                                <h3>Interests</h3>
                                <div className="tags-list">
                                    {user.profile.interests.map((interest, index) => (
                                        <span key={index} className="tag">{interest}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {user.profile?.expertise?.length > 0 && (
                            <div className="detail-section">
                                <h3>Expertise</h3>
                                <div className="tags-list">
                                    {user.profile.expertise.map((exp, index) => (
                                        <span key={index} className="tag">{exp}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {user.profile?.institution && (
                            <div className="detail-section">
                                <h3>Institution</h3>
                                <p>{user.profile.institution}</p>
                            </div>
                        )}

                        {user.profile?.yearOfStudy && (
                            <div className="detail-section">
                                <h3>Year of Study</h3>
                                <p>{user.profile.yearOfStudy}</p>
                            </div>
                        )}

                        {!user.profile?.bio && !user.profile?.interests?.length &&
                            !user.profile?.expertise?.length && !user.profile?.institution && (
                                <p className="text-secondary">
                                    No profile details yet. Click "Edit Profile" to add information about yourself.
                                </p>
                            )}
                    </div>
                )}

                {/* Saved Resources Section */}
                {!editing && savedResources.length > 0 && (
                    <div className="profile-details card" style={{ marginTop: '2rem' }}>
                        <h2>Saved Resources ({savedResources.length})</h2>
                        <div className="saved-resources-grid">
                            {savedResources.map(resource => (
                                <div
                                    key={resource._id}
                                    className="saved-resource-card"
                                    onClick={() => window.open(resource.fileUrl, '_blank')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h4>{resource.title}</h4>
                                    <p className="text-secondary">{resource.description?.substring(0, 100)}...</p>
                                    <div className="resource-meta-small">
                                        <span className="badge badge-primary">{resource.category}</span>
                                        <span className="text-tertiary">{resource.views} views</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

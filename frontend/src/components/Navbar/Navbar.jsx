import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { FiBook, FiMessageSquare, FiHelpCircle, FiUser, FiLogOut, FiLogIn, FiSun, FiMoon } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <FiBook className="brand-icon" />
                        <span className="brand-text gradient-text">EasyLearn</span>
                    </Link>

                    <div className="navbar-links">
                        <Link to="/resources" className="nav-link">
                            <FiBook />
                            <span>Resources</span>
                        </Link>
                        <Link to="/questions" className="nav-link">
                            <FiHelpCircle />
                            <span>Q&A</span>
                        </Link>
                        <Link to="/discussions" className="nav-link">
                            <FiMessageSquare />
                            <span>Discussions</span>
                        </Link>
                    </div>

                    <div className="navbar-actions">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <FiSun /> : <FiMoon />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="nav-link profile-link">
                                    <FiUser />
                                    <span>{user?.username}</span>
                                    <span className="reputation-badge">{user?.reputation || 0}</span>
                                </Link>
                                <button onClick={logout} className="btn btn-outline btn-sm">
                                    <FiLogOut />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary btn-sm">
                                    <FiLogIn />
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

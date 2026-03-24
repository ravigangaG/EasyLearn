import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiTrendingUp, FiAward, FiArrowRight, FiClock } from 'react-icons/fi';
import StudyTimer from '../../components/StudyTimer/StudyTimer.jsx';
import UserBadge from '../../components/UserBadge/UserBadge.jsx';
import './Home.css';

const Home = () => {
    const features = [
        {
            icon: <FiBook />,
            title: 'Resource Sharing',
            description: 'Upload and access educational materials, PDFs, notes, and study guides shared by peers.'
        },
        {
            icon: <FiUsers />,
            title: 'Q&A Community',
            description: 'Ask questions, provide answers, and help fellow students learn together.'
        },
        {
            icon: <FiTrendingUp />,
            title: 'Discussion Forums',
            description: 'Engage in topic-based discussions, share ideas, and collaborate on projects.'
        },
        {
            icon: <FiAward />,
            title: 'Reputation System',
            description: 'Earn reputation points by contributing quality content and helping others.'
        }
    ];

    const stats = [
        { label: 'Active Users', value: '10K+' },
        { label: 'Resources Shared', value: '50K+' },
        { label: 'Questions Answered', value: '100K+' },
        { label: 'Discussions', value: '25K+' }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            Learn Together,
                            <br />
                            <span className="gradient-text">Grow Together</span>
                        </h1>
                        <p className="hero-description">
                            Join thousands of students collaborating, sharing knowledge, and helping each other succeed.
                            Access educational resources, ask questions, and engage in meaningful discussions.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started
                                <FiArrowRight />
                            </Link>
                            <Link to="/resources" className="btn btn-outline btn-lg">
                                Explore Resources
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW Focus Section */}
            <section className="focus-section">
                <div className="container">
                    <div className="focus-grid">
                        <div className="focus-content fade-in">
                            <h2>Master Your <span className="gradient-text">Focus</span></h2>
                            <p>Collaborative learning requires deep concentration. Use our built-in Pomodoro timer to manage your study sessions effectively alongside your peers.</p>
                            <UserBadge reputation={1000} size="lg" />
                        </div>
                        <div className="focus-timer-container slide-in">
                            <StudyTimer />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card glass">
                                <div className="stat-value gradient-text">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Why Choose PeerLearn?</h2>
                        <p className="text-secondary">
                            Everything you need for collaborative learning in one platform
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card card fade-in">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content glass">
                        <h2>Ready to Start Learning?</h2>
                        <p>Join our community of learners and start sharing knowledge today.</p>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Create Free Account
                            <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

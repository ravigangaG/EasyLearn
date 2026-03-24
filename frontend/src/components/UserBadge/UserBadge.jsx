import React from 'react';
import { FiAward, FiShield, FiStar, FiZap } from 'react-icons/fi';
import './UserBadge.css';

const UserBadge = ({ reputation = 0, size = 'md' }) => {
    let badge = null;
    
    if (reputation >= 1000) {
        badge = { icon: <FiAward />, label: size === 'sm' ? 'Guru' : 'Master Mentor', color: 'gold', emoji: '👑' };
    } else if (reputation >= 500) {
        badge = { icon: <FiShield />, label: size === 'sm' ? 'Expert' : 'Knowledge Expert', color: 'silver', emoji: '🧠' };
    } else if (reputation >= 100) {
        badge = { icon: <FiStar />, label: size === 'sm' ? 'Learner' : 'Consistent Learner', color: 'bronze', emoji: '📚' };
    } else {
        badge = { icon: <FiZap />, label: size === 'sm' ? 'New' : 'Beginner', color: 'teal', emoji: '🌱' };
    }

    return (
        <div className={`user-badge badge-${badge.color} badge-${size}`} title={badge.label}>
            {badge.icon}
            <span className="badge-text">{badge.label}</span>
            <span className="badge-emoji">{badge.emoji}</span>
        </div>
    );
};

export default UserBadge;

import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiRotateCcw, FiClock } from 'react-icons/fi';
import './StudyTimer.css';

const StudyTimer = () => {
    const [seconds, setSeconds] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('study'); // study, break

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prev => prev - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
            alert(mode === 'study' ? 'Time for a break!' : 'Back to work!');
            toggleMode();
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = () => {
        setIsActive(false);
        setSeconds(mode === 'study' ? 25 * 60 : 5 * 60);
    };

    const toggleMode = () => {
        const newMode = mode === 'study' ? 'break' : 'study';
        setMode(newMode);
        setSeconds(newMode === 'study' ? 25 * 60 : 5 * 60);
        setIsActive(false);
    };

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`study-timer-widget glass ${mode}`}>
            <div className="timer-header">
                <FiClock />
                <span>{mode === 'study' ? 'Focus Session' : 'Quick Break'}</span>
            </div>
            
            <div className="timer-display">
                {formatTime(seconds)}
            </div>
            
            <div className="timer-controls">
                <button onClick={toggleTimer} className="btn-icon">
                    {isActive ? <FiPause /> : <FiPlay />}
                </button>
                <button onClick={resetTimer} className="btn-icon">
                    <FiRotateCcw />
                </button>
            </div>
            
            <div className="timer-modes">
                <button 
                    disabled={mode === 'study'} 
                    onClick={() => setMode('study') || setSeconds(25*60)}
                >
                    Study
                </button>
                <button 
                    disabled={mode === 'break'} 
                    onClick={() => setMode('break') || setSeconds(5*60)}
                >
                    Break
                </button>
            </div>
        </div>
    );
};

export default StudyTimer;

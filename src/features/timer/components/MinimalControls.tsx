import { motion } from 'framer-motion';
import './MinimalControls.css';

interface MinimalControlsProps {
    isRunning: boolean;
    timeRemaining: number;
    onToggleTimer: () => void;
    onReset: () => void;
    isMuted: boolean;
    onToggleMute: () => void;
    showUI: boolean;
}

export const MinimalControls = ({
    isRunning,
    timeRemaining,
    onToggleTimer,
    onReset,
    isMuted,
    onToggleMute,
    showUI
}: MinimalControlsProps) => {

    const formatTime = (ms: number) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showUI ? 1 : 0, y: showUI ? 0 : 20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="controls-container"
            style={{ pointerEvents: showUI ? 'auto' : 'none' }}
        >
            <div className="time-display">
                {formatTime(timeRemaining)}
            </div>

            <div className="buttons-row">
                <button
                    onClick={onToggleTimer}
                    className="control-button primary-btn"
                >
                    {isRunning ? (
                        // Pause Icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                        </svg>
                    ) : (
                        // Play Icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <button
                    onClick={onReset}
                    className="control-button secondary-btn"
                >
                    {/* Reset Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                </button>

                <button
                    onClick={onToggleMute}
                    className="control-button secondary-btn"
                >
                    {isMuted ? (
                        // Mute Icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                            <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    ) : (
                        // Volume Icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

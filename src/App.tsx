import { useState, useEffect } from 'react';
import { TimerGradient } from './features/timer/components/TimerGradient';
import { MinimalControls } from './features/timer/components/MinimalControls';
import { usePomodoroTimer } from './features/timer/hooks/usePomodoroTimer';
import { useSessionPersistence } from './features/history/hooks/useSessionPersistence';
import { audioController } from './core/AudioController';
import './App.css';

function App() {
  const { isRunning, timeRemaining, start, pause, reset, totalDuration } = usePomodoroTimer();
  const { logSession } = useSessionPersistence();
  const [isMuted, setIsMuted] = useState(true);
  const [showUI, setShowUI] = useState(true);

  // Dummy user ID since we aren't doing actual auth right now
  const dummyUserId = "user_123";

  useEffect(() => {
    // Hide UI after a few seconds of no interaction
    let timeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = () => {
      setShowUI(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isRunning) setShowUI(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isRunning]);

  useEffect(() => {
    // Handle timer completion
    if (timeRemaining <= 0) {
      logSession(dummyUserId, totalDuration / (1000 * 60)); // log in minutes
      if (!isMuted) {
        audioController.stopFadeOut(2); // slow fade out
      }
    }
  }, [timeRemaining, totalDuration, logSession, isMuted]);

  const handleToggleTimer = () => {
    if (isRunning) {
      pause();
      if (!isMuted) audioController.stopFadeOut();
    } else {
      start();
      if (!isMuted) audioController.playFadeIn();
    }
  };

  const handleReset = () => {
    reset();
    audioController.stopFadeOut(0.5);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isRunning && !nextMuted) {
      audioController.playFadeIn();
    } else if (nextMuted) {
      audioController.stopFadeOut();
    }
  };

  return (
    <div className="app-container">
      <TimerGradient
        isRunning={isRunning}
        timeRemaining={timeRemaining}
        totalDuration={totalDuration}
      />

      <MinimalControls
        isRunning={isRunning}
        timeRemaining={timeRemaining}
        onToggleTimer={handleToggleTimer}
        onReset={handleReset}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        showUI={showUI}
      />
    </div>
  );
}

export default App;

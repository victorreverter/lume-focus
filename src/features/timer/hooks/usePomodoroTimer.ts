import { useState, useEffect, useRef } from 'react';

const SESSION_DURATION = 25 * 60 * 1000; // 25 minutes

export const usePomodoroTimer = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION);
    const timerRef = useRef<number | null>(null);

    const start = () => {
        if (!isRunning) {
            setIsRunning(true);
        }
    };

    const pause = () => {
        if (isRunning) {
            setIsRunning(false);
        }
    };

    const reset = () => {
        setIsRunning(false);
        setTimeRemaining(SESSION_DURATION);
    };

    useEffect(() => {
        let lastTime = performance.now();

        const tick = (currentTime: number) => {
            if (!isRunning) return;

            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            setTimeRemaining(prevTime => {
                const newTime = prevTime - deltaTime;
                if (newTime <= 0) {
                    setIsRunning(false);
                    // Potential place to trigger session complete handler
                    return 0;
                }
                return newTime;
            });

            timerRef.current = requestAnimationFrame(tick);
        };

        if (isRunning) {
            timerRef.current = requestAnimationFrame(tick);
        } else if (timerRef.current !== null) {
            cancelAnimationFrame(timerRef.current);
        }

        return () => {
            if (timerRef.current !== null) {
                cancelAnimationFrame(timerRef.current);
            }
        };
    }, [isRunning]);

    return { isRunning, timeRemaining, start, pause, reset, totalDuration: SESSION_DURATION };
};

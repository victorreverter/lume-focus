import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const WARM_HUE = '#FFD580'; // Focus
const COOL_HUE = '#4A90E2'; // Rest
const SESSION_DURATION = 25 * 60 * 1000; // 25 minutes in ms

interface TimerGradientProps {
    isRunning: boolean;
    timeRemaining: number;
    totalDuration?: number;
}

export const TimerGradient = ({
    isRunning,
    timeRemaining,
    totalDuration = SESSION_DURATION
}: TimerGradientProps) => {
    // Motion value representing time elapsed (0 to 1)
    const progress = useMotionValue(0);

    // Transform progress into color
    const backgroundColor = useTransform(
        progress,
        [0, 1],
        [WARM_HUE, COOL_HUE]
    );

    useEffect(() => {
        // If we just loaded or are resetting, set the base progress.
        // Progress goes from 0 (start) to 1 (end of timer)
        const currentProgress = (totalDuration - timeRemaining) / totalDuration;
        progress.set(currentProgress);

        let controls: any;
        if (isRunning && currentProgress < 1) {
            // Animate remaining progress linearly
            controls = animate(progress, 1, {
                duration: timeRemaining / 1000,
                ease: 'linear',
            });
        } else {
            // Pause animation
            progress.stop();
        }

        return () => {
            if (controls && controls.stop) {
                controls.stop();
            }
        };
    }, [isRunning, timeRemaining, totalDuration, progress]);

    return (
        <motion.div
            style={{
                backgroundColor,
                position: 'absolute',
                inset: 0, // cover the entire screen
                zIndex: -1,
            }}
        />
    );
};

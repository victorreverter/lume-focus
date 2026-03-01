import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export const useSessionPersistence = () => {
    const logSession = async (userId: string, durationMinutes: number = 25) => {
        try {
            const userSessionsRef = collection(db, 'users', userId, 'sessions');
            await addDoc(userSessionsRef, {
                duration: durationMinutes,
                completedAt: serverTimestamp(),
                type: 'focus'
            });
            console.log('Session saved successfully');
        } catch (error) {
            console.error('Error saving session: ', error);
        }
    };

    return { logSession };
};

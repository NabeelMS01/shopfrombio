import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { userModel } from './models';

// Using React's cache to deduplicate requests within a single render pass.
export const getUserFromSession = async () => {
    const sessionCookie =   (await cookies()).get('session')?.value;
    if (!sessionCookie) {
        return null;
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            return null;
        }
        
        const decoded = jwt.verify(sessionCookie, process.env.JWT_SECRET) as { userId: string };
        if (!decoded.userId) {
            return null;
        }

        // Get user from model
        const user = await userModel.getById(decoded.userId);
        if (!user) {
            return null;
        }

        // Ensure we return a plain object with only the necessary fields
        return {
            id: user.id,
            _id: user.id, // Keep _id for backward compatibility
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
        };

    } catch (error) {
        // This will catch invalid tokens (e.g., expired, malformed)
        console.error("Session verification failed:", error);
        return null;
    }
};
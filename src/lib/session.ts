import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from './mongoose';
import User, { IUser } from '@/models/User';

// Using React's cache to deduplicate requests within a single render pass.
export const getUserFromSession = async () => {
    const sessionCookie =   cookies().get('session')?.value;
    if (!sessionCookie) {
        return null;
    }

    try {
        const decoded = jwt.verify(sessionCookie, process.env.JWT_SECRET!) as { userId: string };
        if (!decoded.userId) {
            return null;
        }

        await dbConnect();
        // lean() returns a plain JS object, which is faster and avoids Mongoose-specific properties.
        const user = await User.findById<IUser>(decoded.userId).lean(); 
        
        if (!user) {
            return null;
        }

        // Ensure we return a plain object with only the necessary fields
        return {
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

    } catch (error) {
        // This will catch invalid tokens (e.g., expired, malformed)
        console.error("Session verification failed:", error);
        return null;
    }
};
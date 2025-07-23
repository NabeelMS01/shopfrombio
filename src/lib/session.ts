import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from './mongoose';
import User from '@/models/User';
import { cache } from 'react';

export const getUserFromSession = cache(async () => {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return null;

    try {
        const decoded = jwt.verify(sessionCookie, process.env.JWT_SECRET!) as { userId: string };
        if (!decoded.userId) return null;

        await dbConnect();
        const user = await User.findById(decoded.userId).lean();
        
        if (!user) return null;

        // return a plain object
        return {
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

    } catch (error) {
        console.error("Session verification failed:", error);
        return null;
    }
});

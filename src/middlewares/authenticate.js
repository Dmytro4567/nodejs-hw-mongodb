import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createHttpError(401, 'No token provided');
        }

        const token = authHeader.split(' ')[1];

        const session = await SessionsCollection.findOne({ accessToken: token });
        if (!session) {
            throw createHttpError(401, 'Invalid access token');
        }

        if (session.accessTokenValidUntil < new Date()) {
            throw createHttpError(401, 'Access token expired');
        }

        const user = await UsersCollection.findById(session.userId);
        if (!user) {
            throw createHttpError(401, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

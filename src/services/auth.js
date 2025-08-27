import {randomBytes} from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import {UsersCollection} from '../db/models/user.js';
import {SessionsCollection} from '../db/models/session.js';
import {FIFTEEN_MINUTES, ONE_DAY} from '../constants/index.js';

import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import {getEnvVar} from '../utils/getEnvVar.js';
import {sendEmail} from '../utils/sendMail.js';
import {SMTP, TEMPLATES_DIR} from '../constants/index.js';

export const registerUser = async (payload) => {
    const userExists = await UsersCollection.findOne({email: payload.email});

    if (userExists) {
        throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = await UsersCollection.create({
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
    });

    const {password, ...userWithoutPassword} = newUser.toObject();

    return userWithoutPassword;
};

export const loginUser = async ({email, password}) => {
    const user = await UsersCollection.findOne({email});

    if (!user) {
        throw createHttpError(401, 'User not found');
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await SessionsCollection.deleteOne({userId: user._id});

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
    const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

    await SessionsCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    return {accessToken, refreshToken};
};

export const refreshSession = async (refreshTokenFromClient) => {
    if (!refreshTokenFromClient) {
        throw createHttpError(401, 'Refresh token is required');
    }

    const oldSession = await SessionsCollection.findOne({refreshToken: refreshTokenFromClient});

    if (!oldSession) {
        throw createHttpError(401, 'Invalid refresh token');
    }

    if (new Date() > oldSession.refreshTokenValidUntil) {
        throw createHttpError(401, 'Refresh token expired');
    }

    const user = await UsersCollection.findById(oldSession.userId);

    if (!user) {
        throw createHttpError(401, 'User not found');
    }

    await SessionsCollection.deleteOne({_id: oldSession._id});

    const newAccessToken = randomBytes(30).toString('base64');
    const newRefreshToken = randomBytes(30).toString('base64');

    await SessionsCollection.create({
        userId: user._id,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });

    return {accessToken: newAccessToken, refreshToken: newRefreshToken};
};

export const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        throw createHttpError(401, 'Not authorized');
    }

    const session = await SessionsCollection.findOne({refreshToken});

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    await SessionsCollection.findByIdAndDelete(session._id);
};

export const requestResetToken = async (email) => {
    const user = await UsersCollection.findOne({email});
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign(
        {
            sub: user._id,
            email: user.email,
        },
        getEnvVar('JWT_SECRET'),
        {expiresIn: '5m'}
    );

    const templatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
    console.log('TEMPLATES_DIR:', TEMPLATES_DIR);
    console.log('templatePath:', templatePath);
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    const html = template({
        name: user.name || 'User',
        link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${token}`,
    });

    try {
        await sendEmail({
            from: getEnvVar(SMTP.SMTP_FROM),
            to: email,
            subject: 'Reset your password',
            html,
        });
    } catch (err) {
        console.error('❌ Email sending error:', err);
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};





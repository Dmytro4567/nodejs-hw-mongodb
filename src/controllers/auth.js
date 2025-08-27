import {registerUser} from '../services/auth.js';
import {loginUser} from '../services/auth.js';
import {refreshSession} from '../services/auth.js';
import {logoutUser} from '../services/auth.js';
import {ONE_DAY} from '../constants/index.js';
import {requestResetToken} from '../services/auth.js';

export const registerUserController = async (req, res) => {
    const newUser = await registerUser(req.body);

    res.status(201).json({
        status: 'success',
        message: 'Successfully registered a user!',
        data: newUser,
    });
};

export const loginUserController = async (req, res) => {
    const {accessToken, refreshToken} = await loginUser(req.body);

    res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: ONE_DAY,
        })
        .status(200)
        .json({
            status: 'success',
            message: 'Successfully logged in an user!',
            data: {
                accessToken,
            },
        });
};


export const refreshSessionController = async (req, res) => {
    const refreshTokenFromCookie = req.cookies?.refreshToken;

    const {accessToken, refreshToken} = await refreshSession(refreshTokenFromCookie);

    res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: ONE_DAY,
        })
        .status(200)
        .json({
            status: 'success',
            message: 'Successfully refreshed a session!',
            data: {
                accessToken,
            },
        });
};

export const logoutUserController = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie('refreshToken').sendStatus(204);
};

export const requestResetEmailController = async (req, res) => {
    await requestResetToken(req.body.email);
    res.status(200).json({
        status: 200,
        message: 'Reset password email has been successfully sent.',
        data: {},
    });
};





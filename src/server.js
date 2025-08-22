import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import {getEnvVar} from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import {notFoundHandler} from './middlewares/notFoundHandler.js';
import {errorHandler} from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';


export const setupServer = () => {
    const app = express();
    const PORT = Number(getEnvVar('PORT', '3000'));

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use(
        pino({
            transport: {target: 'pino-pretty'},
        })
    );

    app.get('/', (req, res) => {
        res.json({message: 'Hello World!'});
    });

    app.use('/auth', authRouter);

    app.use('/contacts', contactsRouter);

    app.use(notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};


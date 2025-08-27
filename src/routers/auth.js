import express from 'express';
import {validateBody} from '../middlewares/validateBody.js';
import {
    registerUserController,
    loginUserController,
    refreshSessionController,
    logoutUserController,
    requestResetEmailController,
} from '../controllers/auth.js';
import {
    registerUserSchema,
    loginUserSchema,
    requestResetEmailSchema,
} from '../validation/auth.js';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), registerUserController);
router.post('/login', validateBody(loginUserSchema), loginUserController);
router.post('/refresh', refreshSessionController);
router.post('/logout', logoutUserController);

router.post(
    '/send-reset-email',
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController)
);

export default router;



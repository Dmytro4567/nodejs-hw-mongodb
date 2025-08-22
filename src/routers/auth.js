import express from 'express';
import {validateBody} from '../middlewares/validateBody.js';
import {
    registerUserController,
    loginUserController,
    refreshSessionController,
    logoutUserController
} from '../controllers/auth.js';
import {registerUserSchema, loginUserSchema} from '../validation/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), registerUserController);
router.post('/login', validateBody(loginUserSchema), loginUserController);
router.post('/refresh', refreshSessionController);
router.post('/logout', logoutUserController);

export default router;


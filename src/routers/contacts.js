import { Router } from 'express';
import {
    getContactsController,
    getContactByIdController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/', getContactsController);
router.get('/:contactId', getContactByIdController);

export default router;

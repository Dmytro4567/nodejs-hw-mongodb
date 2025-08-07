import createHttpError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';
import mongoose from 'mongoose';

export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw createHttpError(404, 'Contact not found');
    }

    const contact = await getContactById(contactId);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};


import createHttpError from 'http-errors';
import {
    getAllContacts,
    getContactById,
    createContact,
    updateContactById,
    deleteContactById,
} from '../services/contacts.js';
import mongoose from 'mongoose';

export const getContactsController = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const paginationResult = await getAllContacts(page, perPage);

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: paginationResult,
    });
};

export const getContactByIdController = async (req, res) => {
    const {contactId} = req.params;

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

export const createContactController = async (req, res) => {
    const newContact = await createContact(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};

export const updateContactByIdController = async (req, res) => {
    const {contactId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw createHttpError(404, 'Contact not found');
    }

    const updatedContact = await updateContactById(contactId, req.body);

    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updatedContact,
    });
};

export const deleteContactByIdController = async (req, res) => {
    const {contactId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw createHttpError(404, 'Contact not found');
    }

    const deletedContact = await deleteContactById(contactId);

    if (!deletedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
};

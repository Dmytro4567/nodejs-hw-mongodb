import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
    return await ContactsCollection.find();
};

export const getContactById = async (contactId) => {
    return await ContactsCollection.findById(contactId);
};

export const createContact = async (payload) => {
    return await ContactsCollection.create(payload);
};

export const updateContactById = async (contactId, updateData) => {
    return await ContactsCollection.findByIdAndUpdate(contactId, updateData, {
        new: true,
        runValidators: true,
    });
};

export const deleteContactById = async (contactId) => {
    return await ContactsCollection.findByIdAndDelete(contactId);
};

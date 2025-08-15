import {ContactsCollection} from '../db/models/contact.js';

export const getAllContacts = async (
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    filter = {}
) => {
    const totalItems = await ContactsCollection.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    const data = await ContactsCollection.find(filter)
        .sort({[sortBy]: sortOrder})
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
    };
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

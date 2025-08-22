import {ContactsCollection} from '../db/models/contact.js';

export const getAllContacts = async (
    userId,
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    filter = {}
) => {
    const fullFilter = {userId, ...filter};

    const totalItems = await ContactsCollection.countDocuments(fullFilter);
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    const data = await ContactsCollection.find(fullFilter)
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

export const getContactById = async (contactId, userId) => {
    return await ContactsCollection.findOne({_id: contactId, userId});
};

export const createContact = async (payload, userId) => {
    return await ContactsCollection.create({...payload, userId});
};

export const updateContactById = async (contactId, updateData, userId) => {
    return await ContactsCollection.findOneAndUpdate(
        {_id: contactId, userId},
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );
};

export const deleteContactById = async (contactId, userId) => {
    return await ContactsCollection.findOneAndDelete({_id: contactId, userId});
};

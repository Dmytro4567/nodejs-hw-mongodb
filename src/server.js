import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import {getEnvVar} from "./utils/getEnvVar.js";
import {getAllContacts, getContactById} from './services/contacts.js';
import mongoose from "mongoose";

export const setupServer = () => {
    const app = express();
    const PORT = Number(getEnvVar('PORT', '3000'));

    app.use(cors());
    app.use(express.json());
    app.use(
        pino({
            transport: {target: 'pino-pretty'},
        })
    );
    app.get('/', (req, res) => {
        res.json({message: 'Hello World!'});
    });


    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const {contactId} = req.params;

        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(404).json({message: 'Contact not found'});
        }

        const contact = await getContactById(contactId);

        if (!contact) {
            return res.status(404).json({message: 'Contact not found'});
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    });


    app.use((req, res) => {
        res.status(404).json({message: 'Not found'});
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

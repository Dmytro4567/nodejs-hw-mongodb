import {Schema, model} from 'mongoose';

const usersSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/.+@.+\..+/, 'Email must be valid'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const UsersCollection = model('users', usersSchema);

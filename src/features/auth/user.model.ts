import mongoose, { Document, Schema } from 'mongoose';
import argon2 from 'argon2';

export enum UserRole {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    LIBRARIAN = 'LIBRARIAN',
    ADMIN = 'ADMIN',
}

export interface IUser extends Document {
    universityId: string;
    passwordHash: string;
    role: UserRole;
    profile: {
        name: string;
        department?: string;
        email?: string;
    };
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        universityId: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
        profile: {
            name: { type: String, required: true },
            department: { type: String },
            email: { type: String },
        },
    },
    { timestamps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await argon2.verify(this.passwordHash, enteredPassword);
};

UserSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) {
        return next();
    }
    try {
        this.passwordHash = await argon2.hash(this.passwordHash);
        next();
    } catch (err) {
        next(err as mongoose.CallbackError);
    }
});

export default mongoose.model<IUser>('User', UserSchema);

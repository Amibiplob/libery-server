import User, { IUser, UserRole } from './user.model';
import jwt from 'jsonwebtoken';

const generateToken = (id: string, role: UserRole) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const registerUser = async (
    universityId: string,
    password: string,
    name: string,
    role: UserRole
) => {
    const userExists = await User.findOne({ universityId });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        universityId,
        passwordHash: password,
        role,
        profile: { name },
    });

    if (user) {
        return {
            _id: user._id,
            universityId: user.universityId,
            role: user.role,
            token: generateToken((user._id as unknown) as string, user.role),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

export const loginUser = async (universityId: string, password: string) => {
    const user = await User.findOne({ universityId });

    if (user && (await user.matchPassword(password))) {
        return {
            _id: user._id,
            universityId: user.universityId,
            role: user.role,
            name: user.profile.name,
            token: generateToken((user._id as unknown) as string, user.role),
        };
    } else {
        throw new Error('Invalid university ID or password');
    }
};

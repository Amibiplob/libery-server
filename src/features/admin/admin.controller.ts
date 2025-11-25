import { Request, Response } from 'express';
import User, { UserRole } from '../auth/user.model';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { universityId, password, name, role, department, email } = req.body;

        const userExists = await User.findOne({ universityId });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            universityId,
            passwordHash: password,
            role: role || UserRole.STUDENT,
            profile: { name, department, email },
        });

        res.status(201).json({
            _id: user._id,
            universityId: user.universityId,
            role: user.role,
            profile: user.profile,
        });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const listUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const role = req.query.role as string;

        const skip = (page - 1) * limit;
        const filter = role ? { role } : {};

        const users = await User.find(filter)
            .select('-passwordHash')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

import { Request, Response } from 'express';
import * as AuthService from './auth.service.js';
import { UserRole } from './user.model.js';

export const register = async (req: Request, res: Response) => {
    const { universityId, password, name, role } = req.body;

    try {
        const user = await AuthService.registerUser(
            universityId,
            password,
            name,
            role || UserRole.STUDENT
        );
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { universityId, password } = req.body;

    try {
        const user = await AuthService.loginUser(universityId, password);
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: (error as Error).message });
    }
};

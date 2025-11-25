import { Request, Response } from 'express';
import * as CirculationService from './circulation.service';

// Extend Request to include User (from Auth Middleware - to be implemented properly later)
interface AuthRequest extends Request {
    user?: any;
}

export const borrow = async (req: AuthRequest, res: Response) => {
    try {
        // Mock user for now if middleware missing, or use req.body.userId for testing
        const userId = req.body.userId;
        const role = req.body.role;
        const { bookId } = req.body;

        const loan = await CirculationService.borrowBook(userId, bookId, role);
        res.status(201).json(loan);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const myLoans = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string; // Temporary: Pass userId in query
        const loans = await CirculationService.getUserLoans(userId);
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const returnItem = async (req: Request, res: Response) => {
    try {
        const { loanId } = req.body;
        const loan = await CirculationService.returnBook(loanId);
        res.json(loan);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

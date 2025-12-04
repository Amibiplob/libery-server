import { Request, Response } from 'express';
import * as BookService from './book.service.js';

export const create = async (req: Request, res: Response) => {
    try {
        const book = await BookService.createBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const list = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const category = req.query.category as string;

        const result = await BookService.getBooks({ search, category }, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getOne = async (req: Request, res: Response) => {
    try {
        const book = await BookService.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

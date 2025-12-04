import { Request, Response } from 'express';
import News from './news.model.js';

export const createNews = async (req: Request, res: Response) => {
    try {
        const { title, content, category, author } = req.body;
        const news = await News.create({ title, content, category, author });
        res.status(201).json(news);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const listNews = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const news = await News.find()
            .populate('author', 'profile.name')
            .skip(skip)
            .limit(limit)
            .sort({ publishedAt: -1 });

        const total = await News.countDocuments();
        res.json({ news, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

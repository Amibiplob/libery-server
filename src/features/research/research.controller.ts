import { Request, Response } from 'express';
import ResearchPaper from './research.model.js';

export const submitResearch = async (req: Request, res: Response) => {
    try {
        const { title, abstract, authors, program, fileUrl } = req.body;
        const paper = await ResearchPaper.create({
            title,
            abstract,
            authors,
            program,
            fileUrl,
            status: 'PENDING',
        });
        res.status(201).json(paper);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const listResearch = async (req: Request, res: Response) => {
    try {
        const program = req.query.program as string;
        const filter = program ? { program, status: 'APPROVED' } : { status: 'APPROVED' };

        const papers = await ResearchPaper.find(filter)
            .populate('authors', 'profile.name')
            .sort({ submittedAt: -1 });

        res.json(papers);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const approveResearch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { approvedBy } = req.body;

        const paper = await ResearchPaper.findByIdAndUpdate(
            id,
            { status: 'APPROVED', approvedBy },
            { new: true }
        );

        res.json(paper);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// Citation Generator
export const generateCitation = async (req: Request, res: Response) => {
    try {
        const { id, format } = req.params; // format: apa, mla, chicago
        const paper = await ResearchPaper.findById(id).populate('authors', 'profile.name');

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        const authorNames = paper.authors.map((a: any) => a.profile.name).join(', ');
        const year = new Date(paper.submittedAt).getFullYear();

        let citation = '';
        switch (format.toLowerCase()) {
            case 'apa':
                citation = `${authorNames} (${year}). ${paper.title}. City University.`;
                break;
            case 'mla':
                citation = `${authorNames}. "${paper.title}." City University, ${year}.`;
                break;
            case 'chicago':
                citation = `${authorNames}. "${paper.title}." City University (${year}).`;
                break;
            default:
                citation = `${authorNames}. ${paper.title}. ${year}.`;
        }

        res.json({ citation, format });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

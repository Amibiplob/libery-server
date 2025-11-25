import express from 'express';
import { submitResearch, listResearch, approveResearch, generateCitation } from './research.controller';

const router = express.Router();

router.post('/submit', submitResearch);
router.get('/', listResearch);
router.patch('/:id/approve', approveResearch);
router.get('/:id/citation/:format', generateCitation);

export default router;

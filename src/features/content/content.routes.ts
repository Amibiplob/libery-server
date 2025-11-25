import express from 'express';
import { createNews, listNews } from './content.controller';

const router = express.Router();

router.post('/news', createNews);
router.get('/news', listNews);

export default router;

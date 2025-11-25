import express from 'express';
import { create, list, getOne } from './book.controller';

const router = express.Router();

router.get('/', list);
router.get('/:id', getOne);
router.post('/', create); // TODO: Add Admin/Librarian middleware

export default router;

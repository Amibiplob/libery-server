import express from 'express';
import { createUser, listUsers, deleteUser } from './admin.controller';

const router = express.Router();

// TODO: Add Admin-only middleware
router.post('/users', createUser);
router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);

export default router;

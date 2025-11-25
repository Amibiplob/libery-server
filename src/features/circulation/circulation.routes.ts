import express from 'express';
import { borrow, myLoans, returnItem } from './circulation.controller';

const router = express.Router();

router.post('/borrow', borrow);
router.get('/my-loans', myLoans);
router.post('/return', returnItem);

export default router;

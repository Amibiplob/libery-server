import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './features/auth/auth.routes.js';
import bookRoutes from './features/catalog/book.routes.js';
import circulationRoutes from './features/circulation/circulation.routes.js';
import adminRoutes from './features/admin/admin.routes.js';
import contentRoutes from './features/content/content.routes.js';
import researchRoutes from './features/research/research.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/circulation', circulationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/research', researchRoutes);

app.get('/', (req, res) => {
    res.send('City University Library API System');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

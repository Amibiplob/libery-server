import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
    isbn: string;
    title: string;
    authors: string[];
    category: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
    location: {
        floor: number;
        shelf: string;
        section: string;
    };
    coverImage: string;
    embeddings?: number[]; // Vector for AI search
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema: Schema = new Schema(
    {
        isbn: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        authors: [{ type: String, required: true }],
        category: { type: String, required: true },
        description: { type: String },
        totalCopies: { type: Number, required: true, min: 0 },
        availableCopies: { type: Number, required: true, min: 0 },
        location: {
            floor: { type: Number },
            shelf: { type: String },
            section: { type: String },
        },
        coverImage: { type: String },
        embeddings: [{ type: Number }],
    },
    { timestamps: true }
);

// Index for text search
BookSchema.index({ title: 'text', description: 'text', authors: 'text' });

export default mongoose.model<IBook>('Book', BookSchema);

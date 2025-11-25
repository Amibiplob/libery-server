import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    publishedAt: Date;
    category: string;
}

const NewsSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        publishedAt: { type: Date, default: Date.now },
        category: { type: String, default: 'General' },
    },
    { timestamps: true }
);

export default mongoose.model<INews>('News', NewsSchema);

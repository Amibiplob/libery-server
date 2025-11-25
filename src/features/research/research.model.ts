import mongoose, { Document, Schema } from 'mongoose';

export interface IResearchPaper extends Document {
    title: string;
    abstract: string;
    authors: mongoose.Types.ObjectId[];
    program: string; // CSE, EEE, BBA, etc.
    fileUrl: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: mongoose.Types.ObjectId;
    submittedAt: Date;
}

const ResearchPaperSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        abstract: { type: String, required: true },
        authors: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        program: { type: String, required: true },
        fileUrl: { type: String, required: true },
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
        approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<IResearchPaper>('ResearchPaper', ResearchPaperSchema);

import mongoose, { Document, Schema } from 'mongoose';

export enum LoanStatus {
    ACTIVE = 'ACTIVE',
    RETURNED = 'RETURNED',
    OVERDUE = 'OVERDUE',
}

export interface ILoan extends Document {
    user: mongoose.Types.ObjectId;
    book: mongoose.Types.ObjectId;
    issuedBy?: mongoose.Types.ObjectId;
    issueDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: LoanStatus;
    fineAmount: number;
}

const LoanSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        issuedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        issueDate: { type: Date, default: Date.now },
        dueDate: { type: Date, required: true },
        returnDate: { type: Date },
        status: { type: String, enum: Object.values(LoanStatus), default: LoanStatus.ACTIVE },
        fineAmount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<ILoan>('Loan', LoanSchema);

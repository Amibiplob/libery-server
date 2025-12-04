import Loan, { LoanStatus } from './loan.model.js';
import Book from '../catalog/book.model.js';
import { UserRole } from '../auth/user.model.js';

const BORROW_LIMITS = {
    [UserRole.STUDENT]: 3,
    [UserRole.TEACHER]: 10,
    [UserRole.LIBRARIAN]: 0,
    [UserRole.ADMIN]: 0,
};

const LOAN_DURATION_DAYS = 14;

export const borrowBook = async (userId: string, bookId: string, userRole: UserRole) => {
    // 1. Check Availability
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
        throw new Error('Book is not available');
    }

    // 2. Check User Limits
    const activeLoans = await Loan.countDocuments({ user: userId, status: LoanStatus.ACTIVE });
    const limit = BORROW_LIMITS[userRole] || 0;

    if (activeLoans >= limit) {
        throw new Error(`Borrow limit reached (${limit} books)`);
    }

    // 3. Create Loan
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + LOAN_DURATION_DAYS);

    const loan = await Loan.create({
        user: userId,
        book: bookId,
        dueDate,
    });

    // 4. Update Inventory
    book.availableCopies -= 1;
    await book.save();

    return loan;
};

export const getUserLoans = async (userId: string) => {
    return await Loan.find({ user: userId })
        .populate('book', 'title authors coverImage')
        .sort({ createdAt: -1 });
};

export const returnBook = async (loanId: string) => {
    const loan = await Loan.findById(loanId);
    if (!loan || loan.status === LoanStatus.RETURNED) {
        throw new Error('Invalid loan');
    }

    loan.status = LoanStatus.RETURNED;
    loan.returnDate = new Date();
    await loan.save();

    // Update Inventory
    await Book.findByIdAndUpdate(loan.book, { $inc: { availableCopies: 1 } });

    return loan;
};

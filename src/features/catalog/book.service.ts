import Book, { IBook } from './book.model';

export const createBook = async (bookData: Partial<IBook>) => {
    const book = await Book.create(bookData);
    return book;
};

export const getBooks = async (query: any, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    let filter = {};
    if (query.search) {
        filter = { $text: { $search: query.search } };
    }
    if (query.category) {
        filter = { ...filter, category: query.category };
    }

    const books = await Book.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    return { books, total, page, pages: Math.ceil(total / limit) };
};

export const getBookById = async (id: string) => {
    return await Book.findById(id);
};

export const updateBookAvailability = async (id: string, increment: number) => {
    return await Book.findByIdAndUpdate(
        id,
        { $inc: { availableCopies: increment } },
        { new: true }
    );
};

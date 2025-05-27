export type BookedBook = {
  id: string;
  title: string;
  author: string;
  bookingDate: Date;
  returnDate: Date;
  status: 'active' | 'returned' | 'overdue';
  userId: string;
};

class BookingService {
  private readonly STORAGE_KEY = 'booked_books';

  // Получить все забронированные книги для пользователя
  getUserBooks(userId: string): BookedBook[] {
    const allBooks = this.getAllBooks();
    return allBooks.filter(book => book.userId === userId);
  }

  // Получить количество активных бронирований пользователя
  getUserActiveBookingsCount(userId: string): number {
    const userBooks = this.getUserBooks(userId);
    return userBooks.filter(book => book.status === 'active').length;
  }

  // Проверить, забронирована ли уже книга пользователем
  isBookAlreadyBooked(userId: string, bookId: string): boolean {
    const userBooks = this.getUserBooks(userId);
    return userBooks.some(book => 
      book.id === bookId && 
      (book.status === 'active' || book.status === 'overdue')
    );
  }

  // Забронировать книгу
  bookBook(userId: string, bookData: { id: string; title: string; author: string; }): BookedBook | null {
    // Проверяем, не забронирована ли уже эта книга пользователем
    if (this.isBookAlreadyBooked(userId, bookData.id)) {
      return null;
    }

    const userActiveBookings = this.getUserActiveBookingsCount(userId);
    
    if (userActiveBookings >= 5) {
      return null;
    }

    const bookingDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14); // 2 недели на чтение

    const newBooking: BookedBook = {
      ...bookData,
      bookingDate,
      returnDate,
      status: 'active',
      userId
    };

    const allBooks = this.getAllBooks();
    allBooks.push(newBooking);
    this.saveBooks(allBooks);

    return newBooking;
  }

  // Вернуть книгу
  returnBook(userId: string, bookId: string): boolean {
    const allBooks = this.getAllBooks();
    const bookIndex = allBooks.findIndex(
      book => book.id === bookId && book.userId === userId
    );

    if (bookIndex === -1) return false;

    allBooks[bookIndex].status = 'returned';
    this.saveBooks(allBooks);
    return true;
  }

  // Обновить статусы книг (проверка просроченных)
  updateBookStatuses(): void {
    const allBooks = this.getAllBooks();
    const now = new Date();

    const updatedBooks = allBooks.map(book => {
      if (book.status === 'active' && new Date(book.returnDate) < now) {
        return { ...book, status: 'overdue' };
      }
      return book;
    });

    this.saveBooks(updatedBooks);
  }

  // Получить статистику пользователя
  getUserStats(userId: string) {
    const userBooks = this.getUserBooks(userId);
    
    return {
      totalBooked: userBooks.length,
      currentlyBooked: userBooks.filter(book => book.status === 'active').length,
      returned: userBooks.filter(book => book.status === 'returned').length,
      overdue: userBooks.filter(book => book.status === 'overdue').length,
    };
  }

  private getAllBooks(): BookedBook[] {
    const booksJson = localStorage.getItem(this.STORAGE_KEY);
    if (!booksJson) return [];

    const books = JSON.parse(booksJson);
    return books.map((book: any) => ({
      ...book,
      bookingDate: new Date(book.bookingDate),
      returnDate: new Date(book.returnDate)
    }));
  }

  private saveBooks(books: BookedBook[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
  }
}

export const bookingService = new BookingService(); 
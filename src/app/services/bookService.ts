export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
  available: boolean;
  coverUrl?: string;
  rating: number | null;
  totalRatings: number;
  averageRating: number;
  reviews: Array<{
    id: string;
    userId: string;
    userName: string;
    text: string;
    date: Date;
  }>;
};

class BookService {
  private readonly STORAGE_KEY = 'library_books';

  // Получить все книги
  getAllBooks(): Book[] {
    const booksJson = localStorage.getItem(this.STORAGE_KEY);
    if (!booksJson) {
      // Если книг нет, возвращаем начальные демо-данные
      const initialBooks = this.getInitialBooks();
      this.saveBooks(initialBooks);
      return initialBooks;
    }

    const books = JSON.parse(booksJson);
    return books.map((book: any) => ({
      ...book,
      reviews: book.reviews.map((review: any) => ({
        ...review,
        date: new Date(review.date)
      }))
    }));
  }

  // Добавить новую книгу
  addBook(bookData: {
    title: string;
    author: string;
    year: number;
    genre: string;
    description: string;
  }): Book {
    const books = this.getAllBooks();
    
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      available: true,
      rating: null,
      totalRatings: 0,
      averageRating: 0,
      reviews: [],
      coverUrl: '/book-covers/default.jpg'
    };

    books.push(newBook);
    this.saveBooks(books);
    return newBook;
  }

  // Обновить книгу
  updateBook(bookId: string, updates: Partial<Book>): Book | null {
    const books = this.getAllBooks();
    const index = books.findIndex(book => book.id === bookId);
    
    if (index === -1) return null;

    const updatedBook = { ...books[index], ...updates };
    books[index] = updatedBook;
    this.saveBooks(books);
    return updatedBook;
  }

  // Удалить книгу
  deleteBook(bookId: string): boolean {
    const books = this.getAllBooks();
    const filteredBooks = books.filter(book => book.id !== bookId);
    
    if (filteredBooks.length === books.length) return false;
    
    this.saveBooks(filteredBooks);
    return true;
  }

  private saveBooks(books: Book[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
  }

  private getInitialBooks(): Book[] {
    return [
      {
        id: '1',
        title: 'Война и мир',
        author: 'Лев Толстой',
        year: 1869,
        genre: 'Роман',
        available: true,
        coverUrl: '/book-covers/war-and-peace.jpg',
        description: 'Роман-эпопея, описывающий события войны 1812 года.',
        rating: null,
        totalRatings: 15,
        averageRating: 8.5,
        reviews: []
      },
      {
        id: '2',
        title: 'Преступление и наказание',
        author: 'Фёдор Достоевский',
        year: 1866,
        genre: 'Роман',
        available: true,
        coverUrl: '/book-covers/crime-and-punishment.jpg',
        description: 'Психологический роман о молодом студенте.',
        rating: null,
        totalRatings: 12,
        averageRating: 9.0,
        reviews: []
      },
      {
        id: '3',
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        year: 1967,
        genre: 'Фантастика',
        available: true,
        coverUrl: '/book-covers/master-and-margarita.jpg',
        description: 'Мистический роман о визите дьявола в Москву.',
        rating: null,
        totalRatings: 20,
        averageRating: 9.5,
        reviews: []
      }
    ];
  }
}

export const bookService = new BookService(); 
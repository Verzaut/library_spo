'use client';

import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import styles from './catalog.module.css';

// Типы данных
type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  available: boolean;
  coverUrl: string;
  description: string;
};

// Временные данные для демонстрации
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Война и мир',
    author: 'Лев Толстой',
    year: 1869,
    genre: 'Роман',
    available: true,
    coverUrl: '/book-covers/war-and-peace.jpg',
    description: 'Роман-эпопея, описывающий события войны 1812 года.'
  },
  {
    id: '2',
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    year: 1866,
    genre: 'Роман',
    available: true,
    coverUrl: '/book-covers/crime-and-punishment.jpg',
    description: 'Психологический роман о молодом студенте.'
  },
  // Добавьте больше книг по необходимости
];

export default function Catalog() {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Получаем уникальные жанры из списка книг
  const genres = ['all', ...new Set(books.map(book => book.genre))];

  // Фильтрация книг
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Обработчик бронирования
  const handleBooking = (bookId: string) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, available: false } : book
    ));
    // Здесь будет логика отправки запроса на сервер
    alert('Книга забронирована!');
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Каталог книг</h1>
            <div className={styles.userInfo}>
              <span>
                {user?.firstName} {user?.lastName}
              </span>
              <button onClick={logout} className={styles.logoutButton}>
                Выйти
              </button>
            </div>
          </div>
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Поиск по названию или автору..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className={styles.genreSelect}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'Все жанры' : genre}
                </option>
              ))}
            </select>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.booksGrid}>
            {filteredBooks.map(book => (
              <div key={book.id} className={styles.bookCard}>
                <div className={styles.bookCover}>
                  {/* Заглушка для обложки книги */}
                  <div className={styles.coverPlaceholder}>📚</div>
                </div>
                <div className={styles.bookInfo}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>{book.author}</p>
                  <p className={styles.bookDetails}>
                    {book.genre} • {book.year} г.
                  </p>
                  <p className={styles.bookDescription}>{book.description}</p>
                  <button
                    className={`${styles.bookingButton} ${!book.available ? styles.booked : ''}`}
                    onClick={() => handleBooking(book.id)}
                    disabled={!book.available}
                  >
                    {book.available ? 'Забронировать' : 'Забронировано'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {filteredBooks.length === 0 && (
          <div className={styles.noResults}>
            <p>Книги не найдены</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 
'use client';

import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import styles from './profile.module.css';

type BookHistory = {
  id: string;
  title: string;
  author: string;
  dateBooked: Date;
  dateReturned: Date | null;
  status: 'reading' | 'returned';
  rating: number | null;
};

// Временные данные для демонстрации
const mockHistory: BookHistory[] = [
  {
    id: '1',
    title: 'Война и мир',
    author: 'Лев Толстой',
    dateBooked: new Date('2024-02-01'),
    dateReturned: new Date('2024-03-01'),
    status: 'returned',
    rating: 9
  },
  {
    id: '2',
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    dateBooked: new Date('2024-03-05'),
    dateReturned: null,
    status: 'reading',
    rating: null
  }
];

export default function Profile() {
  const { user } = useAuth();
  const [bookHistory] = useState<BookHistory[]>(mockHistory);

  // Статистика
  const totalBooks = bookHistory.length;
  const currentlyReading = bookHistory.filter(book => book.status === 'reading').length;
  const booksReturned = bookHistory.filter(book => book.status === 'returned').length;
  const averageRating = bookHistory
    .filter(book => book.rating !== null)
    .reduce((acc, book) => acc + (book.rating || 0), 0) / 
    bookHistory.filter(book => book.rating !== null).length;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Компонент для отображения рейтинга
  const RatingStars = ({ rating }: { rating: number | null }) => {
    if (rating === null) return null;
    
    return (
      <div className={styles.rating}>
        {[...Array(10)].map((_, index) => (
          <span
            key={index}
            className={`${styles.star} ${index < rating ? styles.active : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Профиль читателя</h1>
        </header>

        <main className={styles.main}>
          <section className={styles.userInfo}>
            <div className={styles.userAvatar}>👤</div>
            <div className={styles.userDetails}>
              <h2>{user?.firstName} {user?.lastName}</h2>
              <p className={styles.email}>{user?.email}</p>
            </div>
          </section>

          <section className={styles.statistics}>
            <div className={styles.statCard}>
              <h3>Всего книг</h3>
              <p className={styles.statNumber}>{totalBooks}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Читаю сейчас</h3>
              <p className={styles.statNumber}>{currentlyReading}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Прочитано</h3>
              <p className={styles.statNumber}>{booksReturned}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Средняя оценка</h3>
              <p className={styles.statNumber}>
                {averageRating ? averageRating.toFixed(1) : '-'}
              </p>
            </div>
          </section>

          <section className={styles.history}>
            <h2>История книг</h2>
            <div className={styles.bookList}>
              {bookHistory.map(book => (
                <div key={book.id} className={styles.bookItem}>
                  <div className={styles.bookInfo}>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    {book.rating && <RatingStars rating={book.rating} />}
                  </div>
                  <div className={styles.bookDates}>
                    <p>Взята: {formatDate(book.dateBooked)}</p>
                    {book.dateReturned && (
                      <p>Возвращена: {formatDate(book.dateReturned)}</p>
                    )}
                  </div>
                  <div className={`${styles.status} ${styles[book.status]}`}>
                    {book.status === 'reading' ? 'Читается' : 'Возвращена'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
} 
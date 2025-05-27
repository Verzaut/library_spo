'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { BookedBook, bookingService } from '../services/bookingService';
import styles from './profile.module.css';

export default function Profile() {
  const { user } = useAuth();
  const [bookedBooks, setBookedBooks] = useState<BookedBook[]>([]);
  const [stats, setStats] = useState({
    totalBooked: 0,
    currentlyBooked: 0,
    returned: 0,
    overdue: 0,
  });

  useEffect(() => {
    if (!user?.id) return;

    // Обновляем статусы книг (проверяем просроченные)
    bookingService.updateBookStatuses();

    // Загружаем книги пользователя
    const userBooks = bookingService.getUserBooks(user.id);
    setBookedBooks(userBooks);

    // Загружаем статистику
    const userStats = bookingService.getUserStats(user.id);
    setStats(userStats);
  }, [user?.id]);

  // Обработчик возврата книги
  const handleReturnBook = (bookId: string) => {
    if (!user?.id) return;

    if (bookingService.returnBook(user.id, bookId)) {
      // Обновляем данные после возврата
      const userBooks = bookingService.getUserBooks(user.id);
      setBookedBooks(userBooks);
      const userStats = bookingService.getUserStats(user.id);
      setStats(userStats);
    }
  };

  const getStatusText = (status: BookedBook['status']) => {
    switch (status) {
      case 'active':
        return 'Активно';
      case 'returned':
        return 'Бронь снята';
      case 'overdue':
        return 'Просрочено';
      default:
        return '';
    }
  };

  const getStatusClass = (status: BookedBook['status']) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'returned':
        return styles.statusReturned;
      case 'overdue':
        return styles.statusOverdue;
      default:
        return '';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Профиль</h1>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.firstName} {user?.lastName}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
        </header>

        <section className={styles.statsSection}>
          <h2>Статистика бронирования</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Всего забронировано</h3>
              <p>{stats.totalBooked}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Текущие бронирования</h3>
              <p>{stats.currentlyBooked}/5</p>
            </div>
            <div className={styles.statCard}>
              <h3>Возвращено</h3>
              <p>{stats.returned}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Просрочено</h3>
              <p>{stats.overdue}</p>
            </div>
          </div>
        </section>

        <section className={styles.booksSection}>
          <h2>Забронированные книги</h2>
          {bookedBooks.length > 0 ? (
            <div className={styles.booksList}>
              {bookedBooks.map(book => (
                <div key={book.id} className={styles.bookCard}>
                  <div className={styles.bookInfo}>
                    <h3>{book.title}</h3>
                    <p className={styles.author}>{book.author}</p>
                  </div>
                  <div className={styles.bookingInfo}>
                    <p>Забронировано: {formatDate(book.bookingDate)}</p>
                    <p>Дата возврата: {formatDate(book.returnDate)}</p>
                    <div className={styles.bookActions}>
                      <span className={`${styles.status} ${getStatusClass(book.status)}`}>
                        {getStatusText(book.status)}
                      </span>
                      {book.status === 'active' && (
                        <button
                          onClick={() => handleReturnBook(book.id)}
                          className={styles.returnButton}
                        >
                          Отменить бронь
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noBooks}>У вас пока нет забронированных книг</p>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
} 
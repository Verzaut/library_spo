'use client';

import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';
import { bookingService } from '@/app/services/bookingService';
import { useEffect, useState } from 'react';
import styles from './profile.module.css';

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [bookedBooks, setBookedBooks] = useState<Array<{
    id: string;
    title: string;
    author: string;
    bookingDate: Date;
    returnDate: Date;
    status: string;
  }>>([]);
  const [stats, setStats] = useState({
    totalBooked: 0,
    currentlyBooked: 0,
    returned: 0,
    overdue: 0,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user?.id) {
          // Обновляем статусы книг
          bookingService.updateBookStatuses();
          // Загружаем книги пользователя
          const books = bookingService.getUserBooks(user.id);
          setBookedBooks(books.map(book => ({
            ...book,
            bookingDate: new Date(book.bookingDate),
            returnDate: new Date(book.returnDate)
          })));

          // Загружаем статистику
          const userStats = bookingService.getUserStats(user.id);
          setStats(userStats);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user?.id]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активно';
      case 'returned':
        return 'Бронь снята';
      case 'overdue':
        return 'Просрочено';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
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
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Дата не указана';
    }
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCancelBooking = (bookId: string) => {
    if (!user?.id) return;

    try {
      bookingService.returnBook(user.id, bookId);
      setBookedBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId 
            ? { ...book, status: 'returned' }
            : book
        )
      );
      // Обновляем статистику после отмены бронирования
      const userStats = bookingService.getUserStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Профиль</h1>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.firstName} {user.lastName}</p>
            <p className={styles.userEmail}>{user.email}</p>
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
                <div key={`${book.id}-${book.bookingDate.getTime()}`} className={styles.bookCard}>
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
                          onClick={() => handleCancelBooking(book.id)}
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
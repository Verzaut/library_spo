'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import styles from './catalog.module.css';

// Типы данных
type Review = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: Date;
};

type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  available: boolean;
  coverUrl: string;
  description: string;
  rating: number | null;
  totalRatings: number;
  averageRating: number;
  reviews: Review[];
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
    description: 'Роман-эпопея, описывающий события войны 1812 года.',
    rating: null,
    totalRatings: 15,
    averageRating: 8.5,
    reviews: [
      {
        id: '1',
        userId: '123',
        userName: 'Иван Петров',
        text: 'Великолепное произведение, которое заставляет задуматься о важных вещах в жизни. Особенно понравились философские размышления автора.',
        date: new Date('2024-03-01')
      }
    ]
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
  // Добавьте больше книг по необходимости
];

// Компонент для отображения отзывов
const ReviewSection = ({ book, onAddReview }: { book: Book; onAddReview: (text: string) => void }) => {
  const [reviewText, setReviewText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).length;
    if (text === '') {
      setWordCount(0);
    } else if (words <= 100) {
      setReviewText(text);
      setWordCount(words);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText.trim() && wordCount <= 100) {
      onAddReview(reviewText);
      setReviewText('');
      setShowForm(false);
      setWordCount(0);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.reviewSection}>
      <h4>Отзывы</h4>
      {book.reviews.map(review => (
        <div key={review.id} className={styles.review}>
          <div className={styles.reviewHeader}>
            <span className={styles.reviewAuthor}>{review.userName}</span>
            <span className={styles.reviewDate}>{formatDate(review.date)}</span>
          </div>
          <p className={styles.reviewText}>{review.text}</p>
        </div>
      ))}
      
      {!showForm ? (
        <button
          className={styles.addReviewButton}
          onClick={() => setShowForm(true)}
        >
          Написать отзыв
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <textarea
            value={reviewText}
            onChange={handleTextChange}
            placeholder="Напишите ваш отзыв (не более 100 слов)"
            className={styles.reviewTextarea}
          />
          <div className={styles.reviewFormFooter}>
            <span className={styles.wordCount}>
              {wordCount}/100 слов
            </span>
            <div className={styles.reviewFormButtons}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!reviewText.trim() || wordCount > 100}
                className={styles.submitButton}
              >
                Отправить
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default function Catalog() {
  const { user } = useAuth();
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

  // Обработчик оценки книги
  const handleRating = (bookId: string, rating: number) => {
    setBooks(books.map(book => {
      if (book.id === bookId) {
        const newTotalRatings = book.rating === null ? book.totalRatings + 1 : book.totalRatings;
        const oldRatingSum = book.averageRating * book.totalRatings;
        const newRatingSum = book.rating === null 
          ? oldRatingSum + rating
          : oldRatingSum - book.rating + rating;
        
        return {
          ...book,
          rating: rating,
          totalRatings: newTotalRatings,
          averageRating: Number((newRatingSum / newTotalRatings).toFixed(1))
        };
      }
      return book;
    }));
    // Здесь будет логика отправки оценки на сервер
  };

  // Обработчик добавления отзыва
  const handleAddReview = (bookId: string, text: string) => {
    setBooks(books.map(book => {
      if (book.id === bookId) {
        const newReview: Review = {
          id: Date.now().toString(),
          userId: user?.id || 'unknown',
          userName: `${user?.firstName} ${user?.lastName}`,
          text,
          date: new Date()
        };
        return {
          ...book,
          reviews: [...book.reviews, newReview]
        };
      }
      return book;
    }));
    // Здесь будет логика отправки отзыва на сервер
  };

  // Компонент для отображения звёздочек рейтинга
  const RatingStars = ({ book, onRate }: { book: Book, onRate: (rating: number) => void }) => {
    return (
      <div className={styles.ratingContainer}>
        <div className={styles.stars}>
          {[...Array(10)].map((_, index) => (
            <button
              key={index}
              className={`${styles.starButton} ${book.rating && book.rating > index ? styles.active : ''}`}
              onClick={() => onRate(index + 1)}
            >
              ★
            </button>
          ))}
        </div>
        <div className={styles.ratingInfo}>
          <span>Средняя оценка: {book.averageRating}</span>
          <span>Всего оценок: {book.totalRatings}</span>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <Navigation />
      <div className={styles.container}>
        <header className={styles.header}>
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
                  <RatingStars 
                    book={book} 
                    onRate={(rating) => handleRating(book.id, rating)} 
                  />
                  <ReviewSection
                    book={book}
                    onAddReview={(text) => handleAddReview(book.id, text)}
                  />
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
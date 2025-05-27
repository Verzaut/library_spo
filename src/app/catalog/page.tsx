'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
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
  {
    id: '3',
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    year: 1967,
    genre: 'Фантастика',
    available: true,
    coverUrl: '/book-covers/master-and-margarita.jpg',
    description: 'Мистический роман о визите дьявола в Москву и параллельной истории Понтия Пилата.',
    rating: null,
    totalRatings: 20,
    averageRating: 9.5,
    reviews: []
  },
  {
    id: '4',
    title: '1984',
    author: 'Джордж Оруэлл',
    year: 1949,
    genre: 'Антиутопия',
    available: true,
    coverUrl: '/book-covers/1984.jpg',
    description: 'Культовый роман-антиутопия о тоталитарном обществе будущего.',
    rating: null,
    totalRatings: 18,
    averageRating: 9.2,
    reviews: []
  },
  {
    id: '5',
    title: 'Гарри Поттер и философский камень',
    author: 'Джоан Роулинг',
    year: 1997,
    genre: 'Фэнтези',
    available: true,
    coverUrl: '/book-covers/harry-potter.jpg',
    description: 'Первая книга о приключениях юного волшебника Гарри Поттера.',
    rating: null,
    totalRatings: 25,
    averageRating: 8.8,
    reviews: []
  },
  {
    id: '6',
    title: 'Три товарища',
    author: 'Эрих Мария Ремарк',
    year: 1936,
    genre: 'Роман',
    available: true,
    coverUrl: '/book-covers/three-comrades.jpg',
    description: 'История о дружбе, любви и жизни в послевоенной Германии.',
    rating: null,
    totalRatings: 14,
    averageRating: 9.1,
    reviews: []
  },
  {
    id: '7',
    title: 'Сто лет одиночества',
    author: 'Габриэль Гарсиа Маркес',
    year: 1967,
    genre: 'Магический реализм',
    available: true,
    coverUrl: '/book-covers/hundred-years.jpg',
    description: 'Эпическая сага о семье Буэндиа и городе Макондо.',
    rating: null,
    totalRatings: 16,
    averageRating: 8.9,
    reviews: []
  },
  {
    id: '8',
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    year: 1943,
    genre: 'Философская сказка',
    available: true,
    coverUrl: '/book-covers/little-prince.jpg',
    description: 'Философская сказка о любви, дружбе и смысле жизни.',
    rating: null,
    totalRatings: 22,
    averageRating: 9.3,
    reviews: []
  },
  {
    id: '9',
    title: 'Анна Каренина',
    author: 'Лев Толстой',
    year: 1877,
    genre: 'Роман',
    available: true,
    coverUrl: '/book-covers/anna-karenina.jpg',
    description: 'История о трагической любви замужней дамы в контексте норм высшего общества.',
    rating: null,
    totalRatings: 17,
    averageRating: 8.7,
    reviews: []
  },
  {
    id: '10',
    title: 'Властелин колец: Братство кольца',
    author: 'Джон Р. Р. Толкин',
    year: 1954,
    genre: 'Фэнтези',
    available: true,
    coverUrl: '/book-covers/lotr.jpg',
    description: 'Первая часть эпической трилогии о приключениях хоббита Фродо.',
    rating: null,
    totalRatings: 24,
    averageRating: 9.4,
    reviews: []
  },
  {
    id: '11',
    title: 'Портрет Дориана Грея',
    author: 'Оскар Уайльд',
    year: 1890,
    genre: 'Готический роман',
    available: true,
    coverUrl: '/book-covers/dorian-gray.jpg',
    description: 'История о молодом человеке, чей портрет старел вместо него.',
    rating: null,
    totalRatings: 19,
    averageRating: 8.6,
    reviews: []
  },
  {
    id: '12',
    title: 'Гордость и предубеждение',
    author: 'Джейн Остин',
    year: 1813,
    genre: 'Роман',
    available: true,
    coverUrl: '/book-covers/pride-prejudice.jpg',
    description: 'Романтическая история о преодолении классовых предрассудков.',
    rating: null,
    totalRatings: 21,
    averageRating: 8.9,
    reviews: []
  }
];

// Компонент для отображения отзывов
const ReviewSection = ({ book, onAddReview }: { book: Book; onAddReview: (text: string) => void }) => {
  const [reviewText, setReviewText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text === '') {
      setReviewText('');
      setWordCount(0);
      return;
    }
    
    const words = text.trim().split(/\s+/);
    if (words.length <= 100) {
      setReviewText(text);
      setWordCount(words.length);
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
  const [userBookings, setUserBookings] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    // Обновляем статусы книг
    bookingService.updateBookStatuses();

    // Получаем количество активных бронирований пользователя
    const activeBookings = bookingService.getUserActiveBookingsCount(user.id);
    setUserBookings(activeBookings);
  }, [user?.id]);

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
  const handleBooking = (book: Book) => {
    if (!user?.id) return;

    const booking = bookingService.bookBook(user.id, {
      id: book.id,
      title: book.title,
      author: book.author,
    });

    if (booking) {
      setBooks(books.map(b => 
        b.id === book.id ? { ...b, available: false } : b
      ));
      setUserBookings(prev => prev + 1);
      alert('Книга успешно забронирована!');
    } else {
      alert('Вы не можете забронировать больше 5 книг одновременно');
    }
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
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Каталог книг</h1>
            <div className={`${styles.bookingLimit} ${
              userBookings >= 5 ? styles.full :
              userBookings >= 4 ? styles.warning : ''
            }`}>
              Забронировано книг: {userBookings}/5
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
                    onClick={() => book.available && handleBooking(book)}
                    disabled={!book.available || userBookings >= 5}
                  >
                    {!book.available ? 'Забронировано' : 'Забронировать'}
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
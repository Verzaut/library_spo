'use client';

import { FormEvent, useState } from 'react';
import styles from './AddBookForm.module.css';

interface AddBookFormProps {
  onSubmit: (bookData: {
    title: string;
    author: string;
    year: number;
    genre: string;
    description: string;
  }) => void;
  onCancel: () => void;
}

export default function AddBookForm({ onSubmit, onCancel }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    genre: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
    description: ''
  });

  const validateForm = () => {
    const newErrors = {
      title: '',
      author: '',
      year: '',
      genre: '',
      description: ''
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Название книги обязательно';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Имя автора обязательно';
    }

    const currentYear = new Date().getFullYear();
    if (formData.year < 1800 || formData.year > currentYear) {
      newErrors.year = `Год должен быть между 1800 и ${currentYear}`;
    }

    if (!formData.genre.trim()) {
      newErrors.genre = 'Жанр обязателен';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Описание должно содержать минимум 20 символов';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Добавить новую книгу</h2>
          <button 
            onClick={onCancel} 
            className={styles.closeButton}
            aria-label="Закрыть"
          >×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Название книги</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите название книги"
              className={errors.title ? styles.errorInput : ''}
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="author">Автор</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Введите имя автора"
              className={errors.author ? styles.errorInput : ''}
            />
            {errors.author && <span className={styles.errorText}>{errors.author}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="year">Год издания</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
              className={errors.year ? styles.errorInput : ''}
            />
            {errors.year && <span className={styles.errorText}>{errors.year}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="genre">Жанр</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Введите жанр книги"
              className={errors.genre ? styles.errorInput : ''}
            />
            {errors.genre && <span className={styles.errorText}>{errors.genre}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введите описание книги"
              rows={4}
              className={errors.description ? styles.errorInput : ''}
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
            <span className={styles.charCount}>
              {formData.description.length}/500 символов
            </span>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              Добавить книгу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
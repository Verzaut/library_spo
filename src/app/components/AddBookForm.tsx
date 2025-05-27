'use client';

import { FormEvent, useState } from 'react';
import styles from './AddBookForm.module.css';

type AddBookFormProps = {
  onClose: () => void;
  onSubmit: (bookData: {
    title: string;
    author: string;
    year: number;
    genre: string;
    description: string;
  }) => void;
};

export default function AddBookForm({ onClose, onSubmit }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
    description: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      year: parseInt(formData.year)
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Добавить новую книгу</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
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
              required
              placeholder="Введите название книги"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="author">Автор</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Введите имя автора"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="year">Год издания</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1800"
              max={new Date().getFullYear()}
              placeholder="Введите год издания"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="genre">Жанр</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              placeholder="Введите жанр книги"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Введите описание книги"
              rows={4}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Отмена
            </button>
            <button type="submit" className={styles.submitButton}>
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
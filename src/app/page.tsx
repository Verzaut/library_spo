'use client'; // Важно для использования хуков

import Link from 'next/link';
import { libraries } from './data/libraries';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Выберите библиотеку</h1>
        
        <div className={styles.librariesGrid}>
          {libraries.map(library => (
            <Link 
              key={library.id}
              href={`/register?library=${library.id}`}
              className={styles.libraryCard}
            >
              <h2 className={styles.libraryName}>{library.name}</h2>
              <div className={styles.libraryInfo}>
                <div className={styles.libraryDetail}>
                  <span className={styles.icon}>📍</span>
                  <span>{library.address}</span>
                </div>
                <div className={styles.libraryDetail}>
                  <span className={styles.icon}>🏢</span>
                  <span>{library.district}</span>
                </div>
                <div className={styles.libraryDetail}>
                  <span className={styles.icon}>🕒</span>
                  <span>{library.workingHours}</span>
                </div>
                <div className={styles.libraryDetail}>
                  <span className={styles.icon}>📞</span>
                  <span>{library.phone}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Моя библиотека</p>
      </footer>
    </div>
  );
}
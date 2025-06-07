import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Проверяем учетные данные библиотекаря
    if (username === 'Библиотекарь' && password === 'Библиотека') {
      // Создаем объект пользователя-библиотекаря
      const librarianData = {
        id: 'librarian-1',
        firstName: 'Иван',
        lastName: 'Петров',
        email: 'librarian@library.com',
        role: 'librarian' as const,
        libraryId: 'main-library'
      };

      return NextResponse.json(librarianData);
    } else {
      return NextResponse.json(
        { error: 'Неверное имя пользователя или пароль' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Ошибка при входе в систему' },
      { status: 500 }
    );
  }
} 
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Ищем читателя по email
    const reader = await prisma.reader.findUnique({
      where: {
        email,
      },
    });

    if (!reader) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, reader.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Возвращаем данные читателя без пароля
    const { password: _, ...readerData } = reader;
    return NextResponse.json(readerData);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Ошибка при входе в систему' },
      { status: 500 }
    );
  }
} 
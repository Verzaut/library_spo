import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, phone, address } = await request.json();

    // Проверяем, существует ли уже читатель с таким email
    const existingReader = await prisma.reader.findUnique({
      where: {
        email,
      },
    });

    if (existingReader) {
      return NextResponse.json(
        { error: 'Читатель с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового читателя
    const reader = await prisma.reader.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        address,
        role: 'reader',
      },
    });

    // Возвращаем данные читателя без пароля
    const { password: _, ...readerData } = reader;
    return NextResponse.json(readerData);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
} 
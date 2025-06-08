import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Пути, которые не требуют аутентификации
const publicPaths = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/'
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Пропускаем публичные пути
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Проверка JWT токена
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Проверка доступа к защищенным маршрутам
    if (path.startsWith('/librarian') && (decoded as any).role !== 'librarian') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (path.startsWith('/admin') && (decoded as any).role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Если токен недействителен, удаляем его и перенаправляем на страницу входа
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

// Конфигурация путей для middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 
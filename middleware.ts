import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import authConfig from './auth.config';

const publicPages = [
  '/',
  '/search',
  '/sign-in',
  '/sign-up',
  '/cart',
  '/cart/(.*)',
  '/product/(.*)',
  '/page/(.*)',
  '/terms',
  '/privacy'
];

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest) => {
  const path = req.nextUrl.pathname;
  
  if (path.match(/\.(env|config|git|docker)/i)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );

  const isPublicPage = publicPathnameRegex.test(path);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    if (!req.auth) {
      const signInUrl = new URL('/sign-in', req.nextUrl.origin);
      signInUrl.searchParams.set('callbackUrl', path || '/');
      return NextResponse.redirect(signInUrl);
    } else {
      if (path.startsWith('/dashboard') && !req.auth.user.isAdmin) {
        return new NextResponse('Forbidden', { status: 403 });
      }
      return intlMiddleware(req);
    }
  }
});

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    {
      source: '/((?!api|_next|_vercel|.*\\..*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
};

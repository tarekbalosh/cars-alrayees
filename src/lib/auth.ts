import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }
}

// Simple in-memory rate limiting for login
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.password) {
          throw new Error('Password is required');
        }

        const ip = req?.headers?.['x-forwarded-for'] || 'unknown';
        const attempt = loginAttempts.get(ip);
        const now = Date.now();

        if (attempt && attempt.lockedUntil > now) {
          throw new Error('Too many failed attempts. Please try again later.');
        }

        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash) {
          throw new Error('Server configuration error');
        }

        const isValid = await bcrypt.compare(credentials.password, hash);

        if (!isValid) {
          if (attempt) {
            const newCount = attempt.count + 1;
            if (newCount >= 5) {
              // Lock for 15 minutes
              loginAttempts.set(ip, { count: newCount, lockedUntil: now + 15 * 60 * 1000 });
            } else {
              loginAttempts.set(ip, { count: newCount, lockedUntil: 0 });
            }
          } else {
            loginAttempts.set(ip, { count: 1, lockedUntil: 0 });
          }
          throw new Error('Invalid password');
        }

        // Reset attempts on success
        loginAttempts.delete(ip);

        return { id: 'admin', name: 'Admin', role: 'ADMIN' };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/en/admin/login',
  },
};

export default NextAuth(authOptions);

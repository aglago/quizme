// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import NextAuthSessionProvider from './providers/SessionProvider';
import { AuthProvider } from './contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuizMe - Study Smarter',
  description: 'Transform your documents into interactive quizzes, flashcards, and study plans with the power of AI.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
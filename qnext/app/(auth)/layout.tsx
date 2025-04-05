// app/(auth)/layout.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';
import Image from 'next/image';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center py-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg" // Make sure to add a logo to your public folder
            alt="QuizMe Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold text-blue-600">QuizMe</span>
        </Link>
      </div>
      {children}
    </div>
  );
}
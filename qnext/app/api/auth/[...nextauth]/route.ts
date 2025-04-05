// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/app/lib/db/connection';
import User from '@/app/lib/db/models/User';
import mongoose from 'mongoose';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const { email, password } = credentials;
        
        await connectDB();
        
        // Use our custom User model method to find user by credentials
        const user = await User.findByCredentials(email, password);
        
        if (!user) {
          return null;
        }
        
        // Return user data for the JWT
        return {
          id: (user._id as mongoose.Types.ObjectId).toString(),
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        
        // If user signed in with Google, create or update user in our database
        if (account?.provider === 'google') {
          await connectDB();
          
          // Check if user exists
          let dbUser = await User.findByEmail(user.email as string);
          
          if (!dbUser) {
            // Create new user
            dbUser = await User.createUser({
              email: user.email as string,
              password: Math.random().toString(36).slice(-8), // Random password
              firstName: user.name?.split(' ')[0],
              lastName: user.name?.split(' ').slice(1).join(' '),
            });
          }
          
          // Record login
          await User.recordLogin((dbUser._id as mongoose.Types.ObjectId).toString());
          
          // Update token with database user ID
          token.id = (dbUser._id as mongoose.Types.ObjectId).toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    newUser: '/register',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
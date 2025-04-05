// app/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: 'loading',
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    if (session?.user) {
      setUser({
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name || undefined,
      });
    } else {
      setUser(null);
    }
  }, [session, status]);

  const value: AuthContextType = {
    user,
    status: status as 'loading' | 'authenticated' | 'unauthenticated',
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
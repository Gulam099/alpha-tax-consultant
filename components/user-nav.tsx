'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';

export function UserNav() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="w-20 h-8 animate-pulse bg-muted rounded-md"></div>;
  }

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          {session.user.image ? (
            <img src={session.user.image} alt={session.user.name || 'User'} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          )}
          <span className="text-sm font-medium">{session.user.name}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => signOut()} className="flex gap-2">
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Log out</span>
        </Button>
      </div>
    );
  }

  return null;
}

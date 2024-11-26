'use client';

import { useEffect, useState } from 'react';
import AdminPanel from './admin/AdminPanel';
import SignInPanel from './SigninPanel';
import { useSocketStore } from '@/stores/socketStore';

export const AuthPanel = () => {
  const { socket, initializeSocketState } = useSocketStore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    socket?.disconnect();
    initializeSocketState();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '.') {
        setIsAdmin((isAdmin) => !isAdmin);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [initializeSocketState, socket]);

  if (isAdmin) {
    return <AdminPanel />;
  }

  return <SignInPanel />;
};

export default AuthPanel;

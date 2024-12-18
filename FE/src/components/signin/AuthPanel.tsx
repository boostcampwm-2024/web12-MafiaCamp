'use client';

import { useEffect, useState } from 'react';
import AdminPanel from './admin/AdminPanel';
import SignInPanel from './SigninPanel';

export const AuthPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '.') {
        setIsAdmin((isAdmin) => !isAdmin);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  return <SignInPanel />;
};

export default AuthPanel;

import AuthLoading from '@/components/signin/loading/AuthLoading';
import { Suspense } from 'react';

export default function page() {
  return (
    <Suspense>
      <AuthLoading />
    </Suspense>
  );
}

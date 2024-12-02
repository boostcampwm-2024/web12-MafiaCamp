'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const usePermissionManager = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);
      } catch (error) {
        alert('카메라, 마이크 권한을 허용해 주세요.');
        console.error(`Permission denied: ${error}`);
        router.replace('/');
      }
    })();
  }, [router]);

  return { permissionGranted };
};

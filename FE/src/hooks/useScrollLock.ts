import { useEffect } from 'react';

/**
 * 모달 창을 열었을 때 부모 요소의 세로 스크롤을 방지하는 커스텀 훅
 */
const useScrollLock = () => {
  useEffect(() => {
    const currentY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${currentY}px`;
    document.body.style.width = '100%';
    document.body.style.overflowY = 'scroll';
    window.scrollTo({ top: currentY });

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflowY = '';
      window.scrollTo({ top: currentY });
    };
  }, []);
};

export default useScrollLock;

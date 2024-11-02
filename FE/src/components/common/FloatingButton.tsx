'use client';

import ChevronUpIcon from './icons/ChevronUpIcon';

const FloatingButton = () => {
  return (
    <button
      className='fixed bottom-12 right-12 flex h-12 w-12 items-center justify-center rounded-full border border-slate-400 bg-slate-600 hover:scale-105'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ChevronUpIcon />
    </button>
  );
};

export default FloatingButton;

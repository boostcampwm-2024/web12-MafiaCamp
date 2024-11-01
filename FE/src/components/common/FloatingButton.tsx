import ChevronUp from './icons/ChevronUp';

const FloatingButton = () => {
  return (
    <button className='fixed bottom-12 right-12 flex h-12 w-12 items-center justify-center rounded-full border border-slate-400 bg-slate-600 hover:scale-105'>
      <ChevronUp />
    </button>
  );
};

export default FloatingButton;

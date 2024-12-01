'use client';

import { useChattingList } from '@/hooks/game/chatting/useChattingList';
import ChattingItem from './ChattingItem';
import { useAuthStore } from '@/stores/authStore';

interface ChattingListProps {
  isMafia: boolean;
}

const ChattingList = ({ isMafia }: ChattingListProps) => {
  const { chattingListRef, chatList } = useChattingList(isMafia);
  const { nickname } = useAuthStore();

  return (
    <div
      className='flex h-full w-full flex-col gap-4 overflow-y-scroll px-4 py-4'
      ref={chattingListRef}
    >
      {chatList.length === 0 ? (
        <p className='self-center text-sm text-slate-200'>
          댓글을 작성해 보세요.
        </p>
      ) : (
        chatList.map((chat, index) => (
          <ChattingItem
            key={index}
            isSelf={chat.from === nickname}
            isMafiaOnly={chat.isMafiaOnly}
            nickname={chat.from}
            content={chat.message}
          />
        ))
      )}
    </div>
  );
};

export default ChattingList;

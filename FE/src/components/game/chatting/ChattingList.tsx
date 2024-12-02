'use client';

import ChattingItem from './ChattingItem';
import { useAuthStore } from '@/stores/authStore';
import { Chat } from '@/types/chat';
import { forwardRef } from 'react';

interface ChattingListProps {
  chatList: Chat[];
}

const ChattingList = forwardRef<HTMLDivElement, ChattingListProps>(
  ({ chatList }, ref) => {
    const { nickname } = useAuthStore();

    return (
      <div
        className='flex h-full w-full flex-col gap-4 overflow-y-scroll px-4 py-4'
        ref={ref}
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
  },
);

ChattingList.displayName = 'ChattingList';

export default ChattingList;

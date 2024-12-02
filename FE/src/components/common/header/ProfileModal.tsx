'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MdLogout, MdSettings } from 'react-icons/md';
import NicknameModal from './NicknameModal';
import { useModalBackHandler } from '@/hooks/utils/useModalBackHandler';
import { useSignout } from '@/hooks/common/useSignout';

interface ProfileModalProps {
  closeModal: () => void;
}

const ProfileModal = ({ closeModal }: ProfileModalProps) => {
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const { handleSignout } = useSignout();

  useModalBackHandler(nicknameModalVisible, () =>
    setNicknameModalVisible(false),
  );

  return (
    <motion.div
      className='absolute right-0 top-8 z-50 flex flex-col items-start text-nowrap rounded-2xl border border-slate-500 bg-slate-600 p-4 text-slate-200'
      initial={{ y: '-1rem', opacity: 0.5 }}
      animate={{ y: '0rem', opacity: 1 }}
    >
      {nicknameModalVisible && (
        <NicknameModal
          closeModal={() => {
            window.history.back();
            setNicknameModalVisible(false);
            closeModal();
          }}
        />
      )}
      <button
        className='flex w-full flex-row items-center gap-2 rounded-xl p-3 hover:bg-slate-400'
        onClick={() => setNicknameModalVisible(true)}
      >
        <MdSettings />
        <span>닉네임 변경</span>
      </button>
      <button
        className='flex w-full flex-row items-center gap-2 rounded-xl p-3 hover:bg-slate-400'
        onClick={() => {
          closeModal();
          handleSignout();
        }}
      >
        <MdLogout />
        <span>로그아웃</span>
      </button>
    </motion.div>
  );
};

export default ProfileModal;

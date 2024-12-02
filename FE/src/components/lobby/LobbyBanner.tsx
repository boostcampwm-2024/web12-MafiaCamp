'use client';

import * as motion from 'framer-motion/client';
import { useState } from 'react';
import CreateRoomModal from './CreateRoomModal';
import { useModalBackHandler } from '@/hooks/utils/useModalBackHandler';
import Image from 'next/image';

const LobbyBanner = () => {
  const [modalVisible, setModalVisible] = useState(false);

  useModalBackHandler(modalVisible, () => setModalVisible(false));

  return (
    <div className='h-[26.25rem] max-[1080px]:h-[41.75rem]'>
      {modalVisible && (
        <CreateRoomModal
          closeModal={() => {
            window.history.back();
            setModalVisible(false);
          }}
        />
      )}
      <div className='absolute left-0 top-0 flex h-[31.25rem] w-full items-center justify-center overflow-hidden text-nowrap bg-gradient-to-r from-slate-800/50 to-slate-600 p-6 pt-20 max-[1080px]:h-fit'>
        <div className='flex w-[67.5rem] flex-row items-center justify-between pt-10 max-[1080px]:flex-col max-[1080px]:gap-4'>
          <motion.div
            className='flex flex-col items-start gap-8 max-[1080px]:items-center'
            initial={{ y: '0.5rem', opacity: 0 }}
            animate={{ y: '0rem', opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-3xl font-bold text-white max-[768px]:text-2xl'>
              <p>생성되어 있는 방에 들어가거나</p>
              <p>직접 방을 생성해 보세요!</p>
            </h2>
            <button
              className='h-[3.75rem] w-[11.25rem] rounded-2xl bg-white font-bold text-slate-800 hover:scale-105 max-[768px]:h-12 max-[768px]:w-36 max-[768px]:text-sm'
              onClick={() => setModalVisible(true)}
            >
              방 만들기
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              className='relative h-80 w-80'
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
            >
              <Image
                className='object-cover'
                src='/common/globe.png'
                alt='globe'
                fill={true}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LobbyBanner;

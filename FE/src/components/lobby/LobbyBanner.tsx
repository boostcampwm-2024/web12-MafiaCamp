'use client';

import LottieFile from '@/../public/lottie/global.json';
import Lottie from 'lottie-react';
import * as motion from 'framer-motion/client';

const LobbyBanner = () => {
  return (
    <div className='h-[26.25rem]'>
      <div className='absolute left-0 top-0 flex h-[31.25rem] w-full items-center justify-center bg-gradient-to-r from-slate-800/50 to-slate-600'>
        <div className='flex w-[67.5rem] flex-row items-center justify-between pt-10'>
          <motion.div
            className='flex flex-col items-start gap-8'
            initial={{ translateY: '0.5rem', opacity: 0 }}
            whileInView={{ translateY: '0rem', opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl font-bold text-white'>
              <p>생성되어 있는 방에 들어가거나</p>
              <p>직접 방을 생성해 보세요!</p>
            </h2>
            <button className='h-[3.75rem] w-[11.25rem] rounded-2xl bg-white font-bold text-slate-800 hover:scale-105'>
              방 만들기
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Lottie animationData={LottieFile} className='h-[22.5rem]' />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LobbyBanner;

'use client';

import LottieFile from '@/../public/lottie/video.json';
import Lottie from 'lottie-react';
import * as motion from 'framer-motion/client';

const Introduction = () => {
  return (
    <div className='flex w-full flex-col items-center gap-8 pt-[25rem]'>
      <motion.h2
        className='bg-gradient-to-r from-slate-400 to-white bg-clip-text text-5xl text-transparent'
        initial={{ translateX: '-3rem', opacity: 0 }}
        whileInView={{ translateX: '0rem', opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 1 }}
      >
        온라인으로 즐기는 마피아 게임
      </motion.h2>
      <motion.p
        className='text-2xl text-slate-200'
        initial={{ translateX: '-3rem', opacity: 0 }}
        whileInView={{ translateX: '0rem', opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        viewport={{ once: true, amount: 1 }}
      >
        화상 채팅으로 마피아 게임을 즐겨보세요!
      </motion.p>
      <div className='flex w-full flex-row items-center justify-between pt-8'>
        <motion.div
          className='aspect-square w-[31.25rem] rounded-full bg-blue-800/50'
          initial={{ rotate: '-90deg', opacity: 0 }}
          whileInView={{ rotate: '0deg', opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.8 }}
        >
          <Lottie animationData={LottieFile} className='bg-transparent' />
        </motion.div>
        <motion.div
          className='text-xl text-white'
          initial={{ translateX: '-1rem', opacity: 0 }}
          whileInView={{ translateX: '0rem', opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 1 }}
        >
          <p>MafiaCamp는 여러 사람들과 실시간 화상 채팅을 통해</p>
          <p>마피아 게임을 즐길 수 있도록 지원합니다. 여러 사람들과의</p>
          <p>심리전을 통해 게임에서 승리할 수 있도록 노력해 보세요!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Introduction;

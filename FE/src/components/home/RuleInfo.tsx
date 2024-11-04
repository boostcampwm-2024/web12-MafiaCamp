import CheckCircleIcon from '../common/icons/CheckCircleIcon';
import * as motion from 'framer-motion/client';

const RuleInfo = () => {
  return (
    <div className='h-[37.5rem]'>
      <motion.div
        className='absolute left-0 top-[167rem] h-[37.5rem] w-[calc(100%-1rem)] rounded-r-[11.25rem] bg-gradient-to-r from-slate-800/50 to-slate-600 p-[3.75rem]'
        initial={{ translateX: '-10%', opacity: 0 }}
        whileInView={{ translateX: '0%', opacity: 1 }}
        transition={{ bounce: false }}
        viewport={{ once: true, amount: 0 }}
      />
      <div className='absolute left-0 top-[167rem] flex h-[37.5rem] w-full flex-col items-center gap-[6.75rem] p-[3.75rem]'>
        <motion.h2
          className='bg-gradient-to-r from-slate-400 to-white bg-clip-text pb-1 text-5xl font-bold text-transparent'
          initial={{ translateX: '-3rem', opacity: 0 }}
          whileInView={{ translateX: '0rem', opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.9 }}
        >
          게임 참여 방법
        </motion.h2>
        <div className='flex flex-row items-center gap-10'>
          <motion.div
            className='flex h-60 w-[22.5rem] flex-col gap-5 rounded-3xl bg-white/10 p-4 text-white'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.9 }}
          >
            <div className='flex flex-row items-center gap-2'>
              <CheckCircleIcon />
              <h3 className='text-xl'>방을 생성하세요</h3>
            </div>
            <motion.p
              className='px-2'
              initial={{ translateY: '1rem', opacity: 0 }}
              whileInView={{ translateY: '0rem', opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true, amount: 0.9 }}
            >
              사람들과 마피아 게임을 즐길 방을 생성하세요.
            </motion.p>
          </motion.div>
          <motion.div
            className='flex h-60 w-[22.5rem] flex-col gap-5 rounded-3xl bg-white/20 p-4 text-white'
            initial={{ translateX: '-5rem', opacity: 0 }}
            whileInView={{ translateX: '0rem', opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true, amount: 0.9 }}
          >
            <div className='flex flex-row items-center gap-2'>
              <CheckCircleIcon />
              <h3 className='text-xl'>방을 찾아보세요</h3>
            </div>
            <motion.p
              className='px-2'
              initial={{ translateY: '1rem', opacity: 0 }}
              whileInView={{ translateY: '0rem', opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true, amount: 0.9 }}
            >
              다른 사람들이 개설한 방 목록을 조회한 후 사람들과 마피아 게임을
              즐길 방에 입장하세요.
            </motion.p>
          </motion.div>
          <motion.div
            className='flex h-60 w-[22.5rem] flex-col gap-5 rounded-3xl bg-white/30 p-4 text-white'
            initial={{ translateX: '-5rem', opacity: 0 }}
            whileInView={{ translateX: '0rem', opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true, amount: 0.9 }}
          >
            <div className='flex flex-row items-center gap-2'>
              <CheckCircleIcon />
              <h3 className='text-xl'>사람들과 심리전을 즐겨보세요</h3>
            </div>
            <motion.p
              className='px-2'
              initial={{ translateY: '1rem', opacity: 0 }}
              whileInView={{ translateY: '0rem', opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              viewport={{ once: true, amount: 0.9 }}
            >
              화상 채팅을 통해 다른 사람들의 표정을 읽어내고 숨막히는 심리전을
              통해 숨어있는 마피아를 잡아내 보세요!
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RuleInfo;

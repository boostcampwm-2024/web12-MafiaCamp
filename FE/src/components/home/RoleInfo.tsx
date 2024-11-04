import * as motion from 'framer-motion/client';
import Image from 'next/image';

const RoleInfo = () => {
  return (
    <div className='flex w-full flex-col items-center gap-[3.75rem]'>
      <motion.h2
        className='h-13 bg-gradient-to-r from-slate-400 to-white bg-clip-text pb-1 text-5xl font-bold text-transparent'
        initial={{ translateX: '3rem', opacity: 0 }}
        whileInView={{ translateX: '0rem', opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.9 }}
      >
        직업 정보
      </motion.h2>
      <div className='flex flex-row items-center gap-4'>
        <motion.div
          className='flex h-[25rem] w-80 flex-col items-center rounded-3xl bg-slate-600/50 p-8'
          initial={{ translateX: '10rem', opacity: 0 }}
          whileInView={{ translateX: '0rem', opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          viewport={{ once: true, amount: 0.9 }}
        >
          <Image
            src='/home/citizen.png'
            alt='citizen'
            width={120}
            height={120}
          />
          <motion.div
            className='flex flex-col items-center gap-12 pt-4'
            initial={{ translateY: '1rem', opacity: 0 }}
            whileInView={{ translateY: '0rem', opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            viewport={{ once: true, amount: 0.9 }}
          >
            <h3 className='text-3xl font-semibold text-white'>시민</h3>
            <p className='text-white'>
              다수의 시민들은 어떠한 능력도 갖고 있지 않습니다. 오직 심리전과
              추리를 통해 마피아를 찾아내야 합니다.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          className='flex h-[25rem] w-80 flex-col items-center rounded-3xl bg-slate-600/50 p-8'
          initial={{ translate: '10rem', opacity: 0 }}
          whileInView={{ translate: '0rem', opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true, amount: 0.9 }}
        >
          <Image src='/home/police.png' alt='police' width={120} height={120} />
          <motion.div
            className='flex flex-col items-center gap-12 pt-4'
            initial={{ translateY: '1rem', opacity: 0 }}
            whileInView={{ translateY: '0rem', opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            viewport={{ once: true, amount: 0.9 }}
          >
            <h3 className='text-3xl font-semibold text-white'>경찰</h3>
            <p className='text-white'>
              경찰은 밤에 의심이 가는 사람 한 명을 지목해서 그 사람의 정체를
              확인할 수 있습니다.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          className='flex h-[25rem] w-80 flex-col items-center rounded-3xl bg-slate-600/50 p-8'
          initial={{ translateX: '10rem', opacity: 0 }}
          whileInView={{ translateX: '0rem', opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true, amount: 0.9 }}
        >
          <Image src='/home/doctor.png' alt='doctor' width={120} height={120} />
          <motion.div
            className='flex flex-col items-center gap-12 pt-4 text-white'
            initial={{ translateY: '1rem', opacity: 0 }}
            whileInView={{ translateY: '0rem', opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            viewport={{ once: true, amount: 0.9 }}
          >
            <h3 className='text-3xl font-semibold'>의사</h3>
            <p>
              의사는 밤마다 한 명의 사람을 지목해서 그 사람을 보호할 수
              있습니다. 보호받는 사람은 마피아의 습격을 받더라도 죽지 않습니다.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          className='flex h-[25rem] w-80 flex-col items-center rounded-3xl bg-slate-600/50 p-8 text-white'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.9 }}
        >
          <Image src='/home/mafia.png' alt='mafia' width={120} height={120} />
          <motion.div
            className='flex flex-col items-center gap-12 pt-4'
            initial={{ translateY: '1rem', opacity: 0 }}
            whileInView={{ translateY: '0rem', opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true, amount: 0.9 }}
          >
            <h3 className='text-3xl font-semibold'>마피아</h3>
            <p>
              마피아는 마피아끼리 인지할 수 있으며 밤마다 다수결의 투표를 통해
              사람을 죽일 수 있습니다.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleInfo;

import * as motion from 'framer-motion/client';
import { ROLE, Role } from '@/constants/role';
import CloseIcon from '../common/icons/CloseIcon';
import Image from 'next/image';

interface GameResultBoardProps {
  gamePublisherRole: Role | null;
  gameResult: 'WIN' | 'LOSE';
  playerInfo: {
    nickname: string;
    role: Role;
    status: 'ALIVE' | 'DEAD';
  }[];
  closeBoard: () => void;
}

const GameResultBoard = ({
  gamePublisherRole,
  gameResult,
  playerInfo,
  closeBoard,
}: GameResultBoardProps) => {
  return (
    <div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-slate-800/75'>
      <motion.div
        className='relative flex h-[30rem] w-[30rem] flex-col items-center gap-6 rounded-2xl border border-slate-400 bg-slate-800 p-6'
        initial={{ y: '-1rem', opacity: 0 }}
        animate={{ y: '0rem', opacity: 1 }}
      >
        <h1 className='absolute -top-10 rounded-full border border-slate-400 bg-slate-800 px-20 py-4 text-4xl text-white'>{`YOU ${gameResult === 'WIN' ? 'WIN!' : 'LOSE...'}`}</h1>
        <CloseIcon
          className='min-h-9 min-w-9 cursor-pointer self-end rounded-lg fill-slate-200 hover:bg-slate-400'
          onClick={() => closeBoard()}
        />
        <h2 className='-mt-8 bg-gradient-to-r from-slate-400 to-white bg-clip-text text-2xl text-transparent'>
          {`${gamePublisherRole === 'MAFIA' ? '마피아 팀이' : '시민 팀이'} ${gameResult === 'WIN' ? '승리' : '패배'}하였습니다.`}
        </h2>
        <div className='boder flex w-full items-center justify-between gap-4 border-y border-y-white px-2.5 py-2 text-white'>
          <p>직업</p>
          <p>닉네임</p>
          <p>생존 여부</p>
        </div>
        <div className='flex w-full flex-col overflow-y-auto text-sm'>
          {playerInfo.map((player, index) => (
            <motion.div
              key={index}
              className='flex w-full items-center justify-between gap-8 rounded-2xl py-2 pr-4 text-white hover:bg-slate-600'
              initial={{ y: '1rem', opacity: 0 }}
              animate={{ y: '0rem', opacity: 1 }}
              transition={{ delay: 0.3 + 0.1 * index }}
            >
              <div className='flex min-w-12 flex-col items-center gap-1'>
                <Image
                  src={`/home/${player.role.toLocaleLowerCase()}.png`}
                  alt={player.role}
                  width={40}
                  height={40}
                />
                <p>{ROLE[player.role]}</p>
              </div>
              <p>{player.nickname}</p>
              <p className='text-nowrap'>
                {player.status === 'ALIVE' ? '생존' : '사망'}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GameResultBoard;

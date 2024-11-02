import Introduction from '@/components/home/Introduction';
import RoleInfo from '@/components/home/RoleInfo';

export default function Home() {
  return (
    <div className='flex flex-col gap-60'>
      <Introduction />
      <RoleInfo />
    </div>
  );
}

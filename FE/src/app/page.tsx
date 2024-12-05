import Introduction from '@/components/home/Introduction';
import RoleInfo from '@/components/home/RoleInfo';
import RuleInfo from '@/components/home/RuleInfo';

export default function Home() {
  return (
    <div className='flex flex-col gap-60 pb-40'>
      <Introduction />
      <RoleInfo />
      <RuleInfo />
    </div>
  );
}

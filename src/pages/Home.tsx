import RateFeeling from '../components/home/RateFeeling';
import DateCycle from '../components/home/DateCycle';
import DayBrief from '../components/home/DayBrief';
import CycleGuides from '../components/home/CycleGuides';
import Blogs from '../components/Blogs';
import Notifications from '../components/Notifications';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export default function Home() {
  const navigate = useNavigate();
  const hasLoggedToday = useAppSelector((s) => s.appData.todayPeriodLog != null);

  return (
    <div className="flex-1 p-6 flex flex-col gap-4">
      <div className="flex flex-row gap-4 justify-between items-center">
        <span className="text-2xl font-bold">Hello, Samara</span>
        <Notifications />
      </div>
      <RateFeeling />
      <DateCycle />
      <DayBrief />
      <div className="flex flex-row gap-4 justify-between">
        <button
          // onClick={() => navigate('/log')}
          type="button"
          className="flex w-1/2 items-center justify-center rounded-full border border-2 border-[#FF6961] bg-white px-1 py-2 text-base font-bold text-[#FF6961]"
        >
          Log Period
        </button>
        <button
          onClick={() => navigate('/log')}
          className={
            hasLoggedToday
              ? 'flex w-1/2 items-center justify-center rounded-full border-2 border-[#33B1FF] bg-[#33B1FF] px-1 py-2 text-base font-bold text-white'
              : 'flex w-1/2 items-center justify-center rounded-full border border-2 border-[#33B1FF] bg-white px-1 py-2 text-base font-bold text-[#33B1FF]'
          }
          type="button"
        >
          {hasLoggedToday ? 'Update your day' : 'Log Your Day'}
        </button>
      </div>
      <CycleGuides />
      <Blogs blogType="pre-period" />
      <Blogs blogType="pms-care" />
      <Blogs blogType="hormone-balance" />
    </div>
  );
}

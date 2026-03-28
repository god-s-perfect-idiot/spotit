import RateFeeling from '../components/home/RateFeeling';
import DateCycle from '../components/home/DateCycle';
import DayBrief from '../components/home/DayBrief';
import CycleGuides from '../components/home/CycleGuides';
import Blogs from '../components/Blogs';
import Notifications from '../components/Notifications';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

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
          className="flex justify-center items-center border border-2 border-[#FF6961] text-[#FF6961] bg-white rounded-full w-1/2 text-base  py-2 px-1 font-bold"
        >
          Log Period
        </button>
        <button
          onClick={() => navigate('/log')}
          className="flex justify-center items-center border border-2 border-[#33B1FF] text-[#33B1FF] bg-white rounded-full w-1/2 text-base  py-2 px-1 font-bold">
          Log Your Day
        </button>
      </div>
      <CycleGuides />
      <Blogs blogType="pre-period" />
      <Blogs blogType="pms-care" />
      <Blogs blogType="hormone-balance" />
    </div>
  );
}

import RateFeeling from '../components/home/RateFeeling';
import DateCycle from '../components/home/DateCycle';
import DayBrief from '../components/home/DayBrief';
import CycleGuides from '../components/home/CycleGuides';
import Blogs from '../components/Blogs';
import Notifications from '../components/Notifications';

export default function Home() {
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
        <button className="flex justify-center items-center border border-2 border-[#FF6961] text-black bg-white rounded-full w-1/2 text-base  py-2 px-1 font-medium">
          Log Period
        </button>
        <button className="flex justify-center items-center border border-2 border-[#FFD34A] text-black bg-white rounded-full w-1/2 text-base  py-2 px-1 font-medium">
          Log Health & Habits
        </button>
      </div>
      <CycleGuides />
      <Blogs blogType="pre-period" />
      <Blogs blogType="pms-care" />
      <Blogs blogType="hormone-balance" />
    </div>
  );
}

import { Bell } from 'lucide-react';
import RateFeeling from '../components/RateFeeling';
import DateCycle from '../components/DateCycle';
import DayBrief from '../components/DayBrief';
import CycleGuides from '../components/CycleGuides';

export default function Home() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-4">
      <div className="flex flex-row gap-4 justify-between items-center">
        <span className="text-2xl font-bold">Hello, Samara</span>
        <button className="bg-[#FF8D7B] text-white p-2 rounded-full">
          <Bell size={18} />
        </button>
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
    </div>
  );
}

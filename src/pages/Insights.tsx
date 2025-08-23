import Notifications from '../components/Notifications';
import Chart from '../components/home/Chart';
import LoggedInsights from '../components/insights/LoggedInsights';
import Cycles from '../components/insights/Cycles';
import CycleHistory from '../components/insights/CycleHistory';

export default function Insights() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-4">
      <div className="flex flex-row gap-4 justify-between items-center">
        <span className="text-2xl font-bold">Insights</span>
        <Notifications />
      </div>
      <button type="button" className="rounded-full bg-[#FF8D7B] p-2 font-bold">
        Current Month Insights
      </button>
      <Chart />
      <LoggedInsights />
      <button type="button" className="rounded-full bg-[#FF8D7B] p-2 font-bold">
        General Insights
      </button>
      <Cycles />
      <CycleHistory />
    </div>
  );
}

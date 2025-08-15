import { Bell } from 'lucide-react';
import React from 'react';
import RateFeeling from '../components/RateFeeling';

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
    </div>
  );
}

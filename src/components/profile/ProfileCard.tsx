import { Info } from "lucide-react";

export default function ProfileCard() {
  return (
    <div className="flex flex-row gap-4 bg-[#F9D1CD] rounded-2xl p-4 w-full justify-between">
      <div className="flex flex-row gap-4 w-full  items-center">
        <span className="w-[5rem] h-[5rem] bg-white rounded-2xl flex"></span>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold">Samara Philip</span>
          <span className="text-sm font-medium">26 Years Old</span>
          <span className="text-sm font-medium">samara@gmail.com</span>
        </div>
      </div>
      <button type="button" className="text-sm pr-2 text-gray-500 self-start">
        <Info className="w-4 h-4" />
      </button>
    </div>
  );
}

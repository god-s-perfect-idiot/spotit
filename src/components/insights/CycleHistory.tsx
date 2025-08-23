function DotIndicator({
  red = 0,
  white = 0,
  yellow = 0,
  className = "",
}: {
  red: number;
  white: number;
  yellow: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-row gap-2 ${className}`}>
      <div className="flex flex-row gap-2">
        {Array.from({ length: red }).map((_, index) => (
          <div key={index} className="w-3 h-3 bg-red-500 rounded-full"></div>
        ))}
      </div>
      <div className="flex flex-row gap-2">
        {Array.from({ length: white }).map((_, index) => (
          <div key={index} className="w-3 h-3 bg-white rounded-full"></div>
        ))}
      </div>
      <div className="flex flex-row gap-2">
        {Array.from({ length: yellow }).map((_, index) => (
          <div key={index} className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        ))}
      </div>
    </div>
  );
}

export default function CycleHistory() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <span className="font-bold">Cycle History</span>
        <button type="button" className="text-sm pr-6 text-gray-700">
          See All
        </button>
      </div>
      <div className="flex flex-col gap-4 bg-[#F9D1CD] rounded-2xl p-4 w-full h-full">
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Current Cycle : 13 days</span>
          <span className="text-sm text-gray-700">Started Jan 17</span>
          <DotIndicator red={6} white={7} yellow={1} className="mt-2" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold">31 days</span>
          <span className="text-sm text-gray-700">Dec 17 - Jan 17</span>
          <DotIndicator red={6} white={7} yellow={3} className="mt-2" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold">28 days</span>
          <span className="text-sm text-gray-700">Nov 19 - Dec 17</span>
          <DotIndicator red={5} white={4} yellow={8} className="mt-2" />
        </div>
      </div>
    </div>
  );
}

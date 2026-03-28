import { Annoyed, Frown, Laugh, Meh, Smile, type LucideIcon } from "lucide-react";
import { useState } from "react";

const MOODS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Annoyed, label: "Rough" },
  { Icon: Frown, label: "Low" },
  { Icon: Meh, label: "Okay" },
  { Icon: Smile, label: "Good" },
  { Icon: Laugh, label: "Great" },
];

export default function RateFeeling() {
  const [selected, setSelected] = useState<number | null>(2);

  return (
    <div className="flex flex-col gap-4 rounded-[2.5rem] bg-[#F9D1CD] px-6 py-4 shadow-sm transition-all duration-300 ease-in-out">
      <span className="text-center text-lg font-medium text-black transition-all duration-300">
        How are you feeling?
      </span>
      <div className="flex flex-row items-center justify-between gap-2 px-2 pb-1 sm:gap-3 sm:px-4">
        {MOODS.map(({ Icon, label }, index) => {
          const isOn = selected === index;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={isOn}
              aria-label={label}
              title={label}
              onClick={() => setSelected(index)}
              className="flex flex-1 flex-col items-center justify-center rounded-full p-0 transition-transform duration-200 ease-out active:scale-95"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 sm:h-12 sm:w-12 ${
                  isOn
                    ? "border-2 border-black bg-[#f8e080] shadow-sm"
                    : "border border-[#9ca3af] bg-white"
                }`}
              >
                <Icon
                  size={26}
                  strokeWidth={isOn ? 2.5 : 2}
                  className={isOn ? "text-black" : "text-[#6b7280]"}
                  aria-hidden
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

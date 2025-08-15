import { Annoyed, Frown, Laugh, Meh, Smile } from "lucide-react";
import { useState } from "react";

export default function RateFeeling() {
  const [selected, setSelected] = useState<number | null>(2);

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  // on selection: bg-- #f8e080 text-black

  return (
    <div className="flex flex-col gap-4 bg-[#F9D1CD] py-4 px-6 rounded-[2.5rem] transition-all duration-300 ease-in-out">
      <span className="text-lg font-medium text-center transition-all duration-300">
        How are you feeling?
      </span>
      <div className="flex flex-row gap-2 justify-between px-4 pb-2">
        <button
          onClick={() => handleSelect(0)}
          className={`text-[#00000070] p-0 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${
            selected === 0 
              ? "bg-[#f8e080] text-black scale-110 shadow-lg" 
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="-m-1">
            <Annoyed size={28} />
          </div>
        </button>
        <button
          onClick={() => handleSelect(1)}
          className={`text-[#00000070] p-0 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${
            selected === 1 
              ? "bg-[#f8e080] text-black scale-110 shadow-lg" 
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="-m-1">
            <Frown size={28} />
          </div>
        </button>
        <button
          onClick={() => handleSelect(2)}
          className={`text-[#00000070] p-0 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${
            selected === 2 
              ? "bg-[#f8e080] text-black scale-110 shadow-lg" 
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="-m-1">
            <Meh size={28} />
          </div>
        </button>
        <button
          onClick={() => handleSelect(3)}
          className={`text-[#00000070] p-0 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${
            selected === 3 
              ? "bg-[#f8e080] text-black scale-110 shadow-lg" 
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="-m-1">
            <Smile size={28} />
          </div>
        </button>
        <button
          onClick={() => handleSelect(4)}
          className={`text-[#00000070] p-0 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${
            selected === 4 
              ? "bg-[#f8e080] text-black scale-110 shadow-lg" 
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="-m-1">
            <Laugh size={28} />
          </div>
        </button>
      </div>
    </div>
  );
}

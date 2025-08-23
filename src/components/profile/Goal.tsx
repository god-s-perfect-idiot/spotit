import { useState } from "react";

export default function Goal() {
    const [goal, setGoal] = useState<string>("Track Cycle");

    const handleGoal = (goal: string) => {
        setGoal(goal);
    }   

    return (
        <div className="flex flex-col gap-4">
            <span className="text-lg font-semibold">My Goal</span>
            <div className="flex flex-row gap-1 w-full justify-between">
                <button 
                    type="button" 
                    className={`text-xs w-1/3 rounded-full px-1 py-2 font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                        goal === "Track Cycle" 
                            ? "bg-[#FF6961] text-white shadow-lg" 
                            : "bg-white border-2 border-[#FF6961] text-black hover:bg-[#FF6961] hover:text-white hover:border-[#FF6961]"
                    }`} 
                    onClick={() => handleGoal("Track Cycle")}
                >
                    Track Cycle
                </button>
                <button 
                    type="button" 
                    className={`text-xs w-1/3 rounded-full px-1 py-2 font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                        goal === "Get Pregnant" 
                            ? "bg-[#FF6961] text-white shadow-lg" 
                            : "bg-white border-2 border-[#FF6961] text-black hover:bg-[#FF6961] hover:text-white hover:border-[#FF6961]"
                    }`} 
                    onClick={() => handleGoal("Get Pregnant")}
                >
                    Get Pregnant
                </button>
                <button 
                    type="button" 
                    className={`text-xs w-1/3 rounded-full px-1 py-2 font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                        goal === "Track Pregnancy" 
                            ? "bg-[#FF6961] text-white shadow-lg" 
                            : "bg-white border-2 border-[#FF6961] text-black hover:bg-[#FF6961] hover:text-white hover:border-[#FF6961]"
                    }`} 
                    onClick={() => handleGoal("Track Pregnancy")}
                >
                    Track Pregnancy
                </button>
            </div>
        </div>
    )
}
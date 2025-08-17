import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef, useState } from "react";

export default function DateCycle() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate dates for a week centered around a specific date
  const generateWeekDates = (centerDate: Date) => {
    const dates = [];
    
    // Generate 7 days: center ± 3 days
    for (let i = -3; i <= 3; i++) {
      const date = new Date(centerDate);
      date.setDate(centerDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  // Get the center date for the current week view
  const getCenterDate = () => {
    const centerDate = new Date(today);
    centerDate.setDate(today.getDate() + (currentWeekOffset * 7));
    return centerDate;
  };

  const weekDates = generateWeekDates(getCenterDate());

  // Determine the month/year to display based on the dates in view
  const getMonthYear = () => {
    const dates = weekDates;
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    
    // If all dates are in the same month, use that month
    if (firstDate.getMonth() === lastDate.getMonth() && firstDate.getFullYear() === lastDate.getFullYear()) {
      return firstDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    
    // If dates span two months, determine which month has more days in view
    const firstMonthCount = dates.filter(date => 
      date.getMonth() === firstDate.getMonth() && date.getFullYear() === firstDate.getFullYear()
    ).length;
    
    const lastMonthCount = dates.filter(date => 
      date.getMonth() === lastDate.getMonth() && date.getFullYear() === lastDate.getFullYear()
    ).length;
    
    // Use the month that has more days in view, or the first month if equal
    const dominantMonth = firstMonthCount >= lastMonthCount ? firstDate : lastDate;
    return dominantMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const monthYear = getMonthYear();

  // Navigation button base classes
  const navButtonClasses = `py-1 px-4 rounded-full transition-all duration-200 bg-white border border-2 font-semibold border-[#ff6961] ${
    isTransitioning 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-gray-100 text-[#ff6961] hover:scale-105'
  }`;

  // Navigation handlers
  const handlePreviousWeek = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Create the connected scrolling effect - both views scroll right together
    if (scrollContainerRef.current) {
      // First, position the new week to the left of current week
      scrollContainerRef.current.style.transition = 'none';
      scrollContainerRef.current.style.transform = 'translateX(-100%)';
      
      // Force reflow
      scrollContainerRef.current.offsetHeight;
      
      // Update the week data
      setCurrentWeekOffset(prev => prev - 1);
      
      // Now animate both views scrolling right together
      scrollContainerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      scrollContainerRef.current.style.transform = 'translateX(0)';
    }
    
    // Clean up after animation
    setTimeout(() => {
      setIsTransitioning(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.transition = '';
        scrollContainerRef.current.style.transform = '';
      }
    }, 300);
  };

  const handleNextWeek = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Create the connected scrolling effect - both views scroll left together
    if (scrollContainerRef.current) {
      // First, position the new week to the right of current week
      scrollContainerRef.current.style.transition = 'none';
      scrollContainerRef.current.style.transform = 'translateX(100%)';
      
      // Force reflow
      scrollContainerRef.current.offsetHeight;
      
      // Update the week data
      setCurrentWeekOffset(prev => prev + 1);
      
      // Now animate both views scrolling left together
      scrollContainerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      scrollContainerRef.current.style.transform = 'translateX(0)';
    }
    
    // Clean up after animation
    setTimeout(() => {
      setIsTransitioning(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.transition = '';
        scrollContainerRef.current.style.transform = '';
      }
    }, 300);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row gap-4 justify-between w-full items-center text-lg">
        <button
          type="button"
          onClick={handlePreviousWeek}
          disabled={isTransitioning}
          className={navButtonClasses}
          aria-label="Previous week"
        >
          <ChevronLeftIcon className="w-6 h-6" strokeWidth={2} />
        </button>
        
        <span className="min-w-[120px] text-center font-semibold">{monthYear}</span>
        
        <button
          type="button"
          onClick={handleNextWeek}
          disabled={isTransitioning}
          className={navButtonClasses}
          aria-label="Next week"
        >
          <ChevronRightIcon className="w-6 h-6" strokeWidth={2} />
        </button>
      </div>

      {/* Horizontal scrollable date component */}
      <div className="w-full flex justify-center overflow-hidden pb-4">
        <div 
          ref={scrollContainerRef}
          className={`flex gap-3 min-w-max transition-transform duration-300 ${
            isTransitioning ? 'pointer-events-none' : ''
          }`}
        >
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const dayName = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const dayNumber = date.getDate();

            const isSelected = selectedDate.toDateString() === date.toDateString();
            // TODO: Get prediction type from backend
            const predictionType = "none" as "none" | "period" | "ovulation";
            // TODO: Get logged state from backend
            const isLogged = false;

            return (
              <button
                type="button"
                key={index}
                className="flex flex-col items-center gap-2"
                onClick={() => setSelectedDate(date)}
              >
                {/* Day of week row */}
                <div
                  className={`text-sm font-medium transition-all duration-300 ease-in-out ${
                    isSelected ? "text-black font-bold scale-110" : "text-[#818181]"
                  }`}
                >
                  {isToday ? "Today" : dayName}
                </div>

                {/* Date row */}
                <div
                  className={`relative flex items-center justify-center w-11 h-11 rounded-2xl border-3 transition-all duration-300 ease-in-out ${
                    isSelected
                      ? "border-[#FF6961] scale-105 shadow-lg"
                      : predictionType === "ovulation"
                      ? "border-dotted border-[#ffd700] hover:scale-102"
                      : predictionType === "period"
                      ? "border-dotted border-[#FF6961] hover:scale-102"
                      : "border-transparent hover:scale-102 hover:border-gray-300"
                  } ${isLogged ? "bg-[#FF6961] !border-[#FF6961]" : "bg-white"}`}
                >
                  <span
                    className={`text-lg font-medium flex justify-center items-center transition-all duration-300 ease-in-out ${
                      isSelected ? "text-black font-bold scale-110" : "text-[#818181]"
                    }`}
                  >
                    {dayNumber}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

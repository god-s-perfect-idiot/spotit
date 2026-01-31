import { useState, useEffect } from "react";
import { ChevronDown, Calendar } from "lucide-react";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  maxYear?: number; // Maximum year allowed (defaults to current year)
  minYear?: number; // Minimum year allowed (defaults to current year - 100)
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  maxYear,
  minYear,
}: DatePickerProps) {
  const currentYear = new Date().getFullYear();
  const defaultMaxYear = maxYear ?? currentYear;
  const defaultMinYear = minYear ?? currentYear - 100;

  const [selectedMonth, setSelectedMonth] = useState(value.getMonth());
  const [selectedYear, setSelectedYear] = useState(value.getFullYear());
  const [selectedDay, setSelectedDay] = useState(value.getDate());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate years from maxYear down to minYear
  const years = Array.from(
    { length: defaultMaxYear - defaultMinYear + 1 },
    (_, i) => defaultMaxYear - i,
  );

  // Sync internal state with external value prop
  useEffect(() => {
    setSelectedMonth(value.getMonth());
    setSelectedYear(value.getFullYear());
    setSelectedDay(value.getDate());
  }, [value]);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    const newDate = new Date(selectedYear, selectedMonth, day);
    onChange(newDate);
  };

  const handleMonthChange = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    const daysInNewMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
    const newDay = selectedDay > daysInNewMonth ? daysInNewMonth : selectedDay;
    setSelectedDay(newDay);
    const newDate = new Date(selectedYear, monthIndex, newDay);
    onChange(newDate);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const daysInNewMonth = new Date(year, selectedMonth + 1, 0).getDate();
    const newDay = selectedDay > daysInNewMonth ? daysInNewMonth : selectedDay;
    setSelectedDay(newDay);
    const newDate = new Date(year, selectedMonth, newDay);
    onChange(newDate);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className={className}>
      {/* Date Input Field */}
      <div className="relative mb-4">
        <input
          type="text"
          value={formatDate(value)}
          readOnly
          placeholder={placeholder}
          className="w-full px-4 py-3 font-medium rounded-full border-[2px] border-[#ff6961] bg-white text-gray-800 cursor-pointer focus:outline-none"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-[#ff6961] rounded-full">
          <Calendar size={20} className="text-white" />
        </span>
      </div>

      {/* Date Picker */}
      <div className="bg-[#F9D1CD] rounded-2xl p-4 mb-6">
        {/* Month and Year Dropdowns */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 flex w-full w-full px-4 py-2 font-medium rounded-full border-[2px] border-[#ff6961] bg-white text-gray-800 appearance-none cursor-pointer focus:outline-none items-center h-full justify-between">
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
              className="appearance-none"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="text-black pointer-events-none"
              strokeWidth={2}
            />
          </div>
          <div className="flex flex-1 w-full px-4 py-2 font-medium rounded-full border-[2px] border-[#ff6961] bg-white text-gray-800 appearance-none cursor-pointer focus:outline-none items-center h-full justify-between">
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="appearance-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="text-black pointer-events-none"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div
              key={index}
              className="text-center text-black text-sm font-bold py-1"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-10" />
          ))}

          {/* Day numbers */}
          {days.map((day) => (
            <button
              key={day}
              onClick={() => handleDaySelect(day)}
              className={`h-10 w-10 flex items-center justify-center text-sm font-medium transition-colors ${
                day === selectedDay
                  ? "border-[2px] border-[#ff6961] bg-white text-black rounded-2xl"
                  : "text-gray-800 hover:bg-white/50"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

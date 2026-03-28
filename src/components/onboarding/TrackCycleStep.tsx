import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";
import DatePicker from "../ui-kit/DatePicker";
import { Loader } from "../ui-kit/Loader";

interface TrackCycleStepProps {
  onNext: () => void;
}

export default function TrackCycleStep({ onNext }: TrackCycleStepProps) {
  const dispatch = useAppDispatch();
  // Default to a recent date (e.g., 2 weeks ago)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 14); // 2 weeks ago
    return date;
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    setIsSaving(true);
    try {
      await dispatch(updateUser({ lastPeriodStart: selectedDate })).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save last period start date:', error);
      // Still proceed to next step even if save fails
      onNext();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full min-h-screen text-center pb-24 px-4">
      <div className="w-full max-w-md mt-24">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          When did your last period start?
        </h2>
        <p className="text-black text-base mb-6 text-center">
          If you're not sure, an estimate is perfectly fine.
        </p>

        {/* Date Picker Component */}
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          maxYear={new Date().getFullYear()}
        />
      </div>

      {/* Next Button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleNext}
          disabled={isSaving}
          className="mt-2 mb-4 flex w-full max-w-[22rem] items-center justify-center rounded-full bg-[#ff6961] px-12 py-2 text-lg font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <Loader withCard={false} size="compact" label="Saving" labelClassName="text-white" />
          ) : (
            "Next"
          )}
        </button>
      </div>
    </div>
  );
}

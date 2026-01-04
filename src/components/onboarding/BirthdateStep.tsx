import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";
import DatePicker from "../ui-kit/DatePicker";

interface BirthdateStepProps {
  onNext: () => void;
}

export default function BirthdateStep({ onNext }: BirthdateStepProps) {
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(2001, 10, 16)
  ); // November 16, 2001
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    setIsSaving(true);
    try {
      await dispatch(updateUser({ birthdate: selectedDate })).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save birthdate:', error);
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
          What's your date of birth?
        </h2>
        <p className="text-black text-base mb-6 text-center">
          This helps us provide personalised health insights and content
          relevant to your life stage.
        </p>

        {/* Date Picker Component */}
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          maxYear={new Date().getFullYear() - 8}
        />
      </div>

      {/* Next Button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleNext}
          disabled={isSaving}
          className="w-full bg-[#ff6961] text-white font-bold text-lg py-2 px-12 max-w-[22rem] rounded-full shadow-md mt-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
}

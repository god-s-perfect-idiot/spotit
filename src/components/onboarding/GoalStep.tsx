import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";
import { Loader } from "../ui-kit/Loader";

interface GoalStepProps {
  onNext: () => void;
}

type GoalOption = "track-cycle" | "get-pregnant" | "track-pregnancy" | "track-perimenopause";

const GOAL_OPTIONS: { value: GoalOption; label: string }[] = [
  { value: "track-cycle", label: "Track cycle" },
  { value: "get-pregnant", label: "Get Pregnant" },
  { value: "track-pregnancy", label: "Track Pregnancy" },
  { value: "track-perimenopause", label: "Track Perimenopause" },
];

export default function GoalStep({ onNext }: GoalStepProps) {
  const dispatch = useAppDispatch();
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGoalSelect = (goal: GoalOption) => {
    setSelectedGoal(goal);
  };

  const handleNext = async () => {
    setIsSaving(true);
    try {
      // Save goal if one is selected, otherwise save undefined
      await dispatch(updateUser({ goal: selectedGoal || undefined })).unwrap();
      onNext();
    } catch (error) {
      console.error("Failed to save goal:", error);
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
          What is your goal?
        </h2>
        <p className="text-black text-base mb-6 text-center">
          Knowing your primary goal helps us customise your insights, content, and daily tracker.
        </p>

        {/* Goal Options */}
        <div className="flex flex-col gap-4 mb-6">
          {GOAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleGoalSelect(option.value)}
              className={`w-full rounded-full border-[2px] border-[#ff6961] px-4 py-3 text-center font-medium transition-colors ${
                selectedGoal === option.value
                  ? "!bg-[#ff6961] text-white"
                  : "bg-white text-black"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
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

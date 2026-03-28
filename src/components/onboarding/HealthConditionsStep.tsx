import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";
import { Plus, XCircle } from "lucide-react";
import { Loader } from "../ui-kit/Loader";

interface HealthConditionsStepProps {
  onComplete: () => void;
}

type HealthCondition =
  | "pcos"
  | "endometriosis"
  | "fibroids"
  | "hypothyroidism"
  | "hyperthyroidism"
  | "none";

const HEALTH_CONDITIONS: { value: HealthCondition; label: string }[] = [
  { value: "pcos", label: "Polycystic Ovary Syndrome (PCOS)" },
  { value: "endometriosis", label: "Endometriosis" },
  { value: "fibroids", label: "Fibroids" },
  { value: "hypothyroidism", label: "Hypothyroidism" },
  { value: "hyperthyroidism", label: "Hyperthyroidism" },
  { value: "none", label: "None of the above" },
];

export default function HealthConditionsStep({
  onComplete,
}: HealthConditionsStepProps) {
  const dispatch = useAppDispatch();
  const [selectedConditions, setSelectedConditions] = useState<
    Set<HealthCondition>
  >(new Set());
  const [customConditions, setCustomConditions] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleConditionToggle = (condition: HealthCondition) => {
    const newSelected = new Set(selectedConditions);

    if (condition === "none") {
      // If "None" is selected, clear all other selections
      if (newSelected.has("none")) {
        newSelected.delete("none");
      } else {
        newSelected.clear();
        newSelected.add("none");
      }
    } else {
      // If selecting a condition, remove "none"
      newSelected.delete("none");
      if (newSelected.has(condition)) {
        newSelected.delete(condition);
      } else {
        newSelected.add(condition);
      }
    }

    setSelectedConditions(newSelected);
  };

  const handleAddCustom = () => {
    if (customInputValue.trim()) {
      setCustomConditions([...customConditions, customInputValue.trim()]);
      setCustomInputValue("");
      setShowCustomInput(false);
    }
  };

  const handleRemoveCustom = (index: number) => {
    setCustomConditions(customConditions.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      // Convert Set to array and include custom conditions
      const conditionsArray = Array.from(selectedConditions);
      const allConditions = {
        predefined: conditionsArray,
        custom: customConditions,
      };

      await dispatch(updateUser({ healthConditions: allConditions })).unwrap();
      // Complete onboarding
      onComplete();
    } catch (error) {
      console.error("Failed to save health conditions:", error);
      // Still complete onboarding even if save fails
      onComplete();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full min-h-screen text-center pb-24 px-4">
      <div className="w-full max-w-md mt-24">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Do you have any health conditions?
        </h2>
        <p className="text-black text-base mb-6 text-center">
          <span>
            Sharing this helps us provide more relevant content and acknowledge
            potential cycle variations.
          </span>{" "}
          (Select all that apply)
        </p>

        {/* Health Condition Options */}
        <div className="flex flex-col gap-4 mb-4">
          {HEALTH_CONDITIONS.map((condition) => (
            <button
              key={condition.value}
              onClick={() => handleConditionToggle(condition.value)}
              className={`w-full rounded-full border-[2px] border-[#ff6961] px-4 py-3 text-center font-medium transition-colors ${
                selectedConditions.has(condition.value)
                  ? "!bg-[#ff6961] text-white"
                  : "bg-white text-black"
              }`}
            >
              {condition.label}
            </button>
          ))}
        </div>

        {/* Custom Conditions Display */}
        {customConditions.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {customConditions.map((condition, index) => (
              <div
                key={index}
                className="flex w-full items-center justify-between rounded-full border-[2px] border-[#ff6961] bg-white px-4 py-3"
              >
                <span className="text-black font-medium">{condition}</span>
                <button
                  onClick={() => handleRemoveCustom(index)}
                  className="text-[#ff6961] font-bold text-lg"
                  aria-label="Remove condition"
                >
                  <XCircle size={24} strokeWidth={"2px"} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Condition Input */}
        {showCustomInput ? (
          <div className="mb-4">
            <div className="flex flex-wrap justify-end gap-2 items-center">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddCustom();
                  } else if (e.key === "Escape") {
                    setShowCustomInput(false);
                    setCustomInputValue("");
                  }
                }}
                placeholder="Enter condition"
                className="flex-1 rounded-full border-[2px] border-[#ff6961] bg-white px-4 py-3 font-medium text-black focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleAddCustom}
                disabled={!customInputValue.trim()}
                className="h-fit rounded-full bg-[#ff6961] px-4 py-2 font-medium text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border-[2px] border-dashed border-[#ff6961] bg-white px-4 py-3 font-medium text-[#ff6961]"
          >
            <Plus size={20} />
            Add other conditions
          </button>
        )}
      </div>

      {/* Complete Button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleComplete}
          disabled={isSaving}
          className="mt-2 mb-4 flex w-full max-w-[22rem] items-center justify-center rounded-full bg-[#ff6961] px-12 py-2 text-lg font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <Loader withCard={false} size="compact" label="Saving" labelClassName="text-white" />
          ) : (
            "Complete"
          )}
        </button>
      </div>
    </div>
  );
}

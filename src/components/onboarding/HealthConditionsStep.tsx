import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";
import { Plus, XCircle } from "lucide-react";

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
              className={`w-full bg-white rounded-full border-[2px] border-[#ff6961] px-4 py-3 text-black font-medium transition-colors text-center ${
                selectedConditions.has(condition.value)
                  ? "!bg-[#ff6961] text-white"
                  : ""
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
                className="flex items-center justify-between w-full bg-white rounded-full border-[2px] border-[#ff6961] px-4 py-3"
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
                className="flex-1 px-4 py-3 rounded-full font-medium border-[2px] border-gray-300 bg-white text-black focus:outline-none focus:border-[#ff6961]"
                autoFocus
              />
              <button
                onClick={handleAddCustom}
                disabled={!customInputValue.trim()}
                className="px-4 py-2 h-fit bg-[#ff6961] text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full bg-white rounded-full border-[2px] border-gray-300 px-4 py-3 text-gray-500 font-medium mb-4 flex items-center justify-center gap-2"
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
          className="w-full bg-[#ff6961] text-white font-bold text-lg py-2 px-12 max-w-[22rem] rounded-full shadow-md mt-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Complete"}
        </button>
      </div>
    </div>
  );
}

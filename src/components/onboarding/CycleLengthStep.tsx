import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";
import { Minus, Plus } from "lucide-react";
import CycleLengthNotSureModal from "./CycleLengthNotSureModal";

interface CycleLengthStepProps {
  onNext: () => void;
}

export default function CycleLengthStep({ onNext }: CycleLengthStepProps) {
  const dispatch = useAppDispatch();
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [isNotSure, setIsNotSure] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDecrement = () => {
    if (cycleLength > 1) {
      setCycleLength(cycleLength - 1);
      setIsNotSure(false);
    }
  };

  const handleIncrement = () => {
    setCycleLength(cycleLength + 1);
    setIsNotSure(false);
  };

  const handleNotSure = () => {
    setIsNotSure(true);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleNext = async () => {
    setIsSaving(true);
    try {
      // Save cycleLength as null if user is not sure, otherwise save the number
      await dispatch(
        updateUser({
          cycleLength: isNotSure ? null : cycleLength,
        }),
      ).unwrap();
      onNext();
    } catch (error) {
      console.error("Failed to save cycle length:", error);
      // Still proceed to next step even if save fails
      onNext();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <CycleLengthNotSureModal isOpen={showModal} onClose={handleModalClose} />

      <div className="flex flex-col items-center justify-between h-full min-h-screen text-center pb-24 px-4">
        <div className="w-full max-w-md mt-24">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            And how long is your full cycle?
          </h2>
          <p className="text-black text-base mb-6 text-center">
            This is from the first day of one period to the day before the next.
            The average is 28 days, but variations are common.
          </p>

          {/* Cycle Length Selector */}
          <div className="mb-4">
            <div className="relative flex items-center justify-center bg-white rounded-full border-[2px] border-[#ff6961] px-2 py-2">
              <button
                onClick={handleDecrement}
                disabled={cycleLength <= 1}
                className="p-2 bg-[#ff6961] rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease cycle length"
              >
                <Minus size={20} />
              </button>

              <div className="flex-1 text-center px-4">
                <span className="text-gray-800 text-lg font-medium">
                  {cycleLength} {cycleLength === 1 ? "day" : "days"}
                </span>
              </div>

              <button
                onClick={handleIncrement}
                className="p-2 bg-[#ff6961] rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase cycle length"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* I am not sure Option */}
          <div className="mb-6">
            <button
              onClick={handleNotSure}
              className={`w-full bg-white text-lg font-medium rounded-full border-[2px] font-medium border-[#ff6961] px-4 py-3 text-gray-800 transition-colors ${
                isNotSure ? "!bg-[#ff6961] text-white" : ""
              }`}
            >
              I am not sure
            </button>
          </div>
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
    </>
  );
}

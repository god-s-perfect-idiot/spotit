import { BellDotIcon } from "lucide-react";
import Modal from "../ui-kit/Modal";

interface CycleLengthNotSureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CycleLengthNotSureModal({
  isOpen,
  onClose,
}: CycleLengthNotSureModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        {/* Bell Icon */}
        <div className="mb-6 relative">
          <BellDotIcon size={48} className="text-[#ff6961]" />
          {/* Small dot on bell */}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          No problem at all!
        </h3>

        {/* Body Text */}
        <p className="text-gray-700 text-base leading-relaxed">
          We'll use a 28-day average to get you started and will automatically
          calculate your personal average after you've logged your next couple
          of periods.
        </p>
      </div>
    </Modal>
  );
}



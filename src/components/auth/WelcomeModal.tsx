import Modal from "../Modal";

interface WelcomeModalProps {
  onGetStarted: () => void;
}

export default function WelcomeModal({ onGetStarted }: WelcomeModalProps) {
  return (
    <Modal className="pb-16 flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-black mb-4 text-center">
        Welcome to Spot it!
      </h2>
      <p className="text-black text-center mb-8 leading-relaxed text-base">
        A private, positive, and insightful space to understand your body's
        unique rhythm.
      </p>

      <div className="w-full flex justify-center">
        <button
          onClick={onGetStarted}
          className="mt-2 mb-4 w-full max-w-[26rem] self-center rounded-full bg-[#ff6961] px-12 py-2 text-lg font-bold text-white shadow-md"
        >
          Get Started
        </button>
      </div>
    </Modal>
  );
}

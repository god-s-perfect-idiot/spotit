import Modal from '../Modal';

interface WelcomeModalProps {
  onGetStarted: () => void;
}

export default function WelcomeModal({ onGetStarted }: WelcomeModalProps) {
  return (
    <Modal className='pb-16 flex flex-col items-center'>
      <h2 className="text-2xl font-bold text-black mb-4 text-center">
        Welcome to Spot it!
      </h2>
      <p className="text-black text-center mb-8 leading-relaxed text-base">
        A private, positive, and insightful space to understand your body's unique rhythm.
      </p>
      
      <button
        onClick={onGetStarted}
        className="w-full bg-[#ff6961] text-white font-bold text-lg py-2 px-12 max-w-[26rem] rounded-full shadow-md mt-2 mb-4"
      >
        Get Started
      </button>
    </Modal>
  );
}

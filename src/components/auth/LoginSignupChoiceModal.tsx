import Modal from "../Modal";

interface LoginSignupChoiceModalProps {
  onLogin: () => void;
  onSignup: () => void;
  onSkip: () => void;
}

export default function LoginSignupChoiceModal({
  onLogin,
  onSignup,
  onSkip,
}: LoginSignupChoiceModalProps) {
  return (
    <Modal className="pb-12 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Welcome to Spot it!
      </h2>
      <p className="text-gray-700 text-center mb-8 leading-relaxed">
        Track your cycle, understand your body.
      </p>

      <div className="space-y-4 w-full flex flex-col items-center">
        <button
          onClick={onLogin}
          className="w-full max-w-[18rem] bg-[#ff6961] text-white font-bold py-2 px-6 rounded-full transition-colors duration-200 shadow-md"
        >
          Log In
        </button>

        <div className="text-center text-gray-600 font-bold">or</div>

        <button
          onClick={onSignup}
          className="w-full max-w-[18rem] bg-[#ff6961] text-white font-bold py-2 px-6 rounded-full transition-colors duration-200 shadow-md"
        >
          Sign Up
        </button>

        <div className="text-center">
          <span className="font-medium text-base">
            or{" "}
            <button
              onClick={onSkip}
              className="text-[#ff6961] font-medium text-base transition-colors duration-200 hover:underline"
            >
              Skip for now
            </button>
          </span>
        </div>
      </div>
    </Modal>
  );
}

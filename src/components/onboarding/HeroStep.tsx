interface HeroStepProps {
  onNext: () => void;
}

export default function HeroStep({ onNext }: HeroStepProps) {
  return (
    <div className="flex flex-col items-center justify-end min-h-screen text-center pb-24">

      {/* Hero Image if available */}
      <div className="mb-12 mt-4 bg-[#f6beb9] rounded-3xl p-4 shadow-md drop-shadow-md">
        <img
          src="/onboarding-hero.png"
          alt="Welcome to Spot It"
          className="w-full max-w-md mx-auto"
          onError={(e) => {
            // Hide image if it doesn't exist
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-2 my-12 ">
        <span className="text-2xl font-semibold">
          Your Privacy, Your Control
        </span>
        <span className="text-base ">
          We believe your health data is yours alone. It is never sold or
          shared. Our commitment is to you, always.
        </span>
      </div>

      {/* CTA Button */}
      <div className="w-full">
        <button
          onClick={onNext}
          className="w-full bg-[#ff6961] text-white font-bold text-lg py-2 px-12 max-w-[22rem] rounded-full shadow-md mt-2 mb-4"
        >
          I understand
        </button>
      </div>
    </div>
  );
}

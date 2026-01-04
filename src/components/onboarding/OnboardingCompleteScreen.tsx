import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setOnboardingComplete } from "../../store/authSlice";
import { completeOnboarding } from "../../utils/onboarding";

const FACTS = [
  "You lose less than 80 mL of fluid on average during your entire period, that's less than half a cup!",
  "The average menstrual cycle is 28 days, but anywhere between 21-35 days is considered normal.",
  "Your period can last anywhere from 2 to 7 days, with the average being around 5 days.",
  "Hormone levels fluctuate throughout your cycle, affecting mood, energy, and even sleep patterns.",
  "Tracking your cycle can help you understand patterns in your mood, energy, and physical symptoms.",
];

// Percentage stops at believable intervals (in milliseconds from start)
const PERCENTAGE_STOPS = [
  { time: 500, percent: 10 },
  { time: 1500, percent: 25 },
  { time: 2500, percent: 40 },
  { time: 3500, percent: 55 },
  { time: 4500, percent: 70 },
  { time: 5500, percent: 82 },
  { time: 6500, percent: 90 },
  { time: 7500, percent: 95 },
  { time: 8500, percent: 98 },
  { time: 9500, percent: 100 },
];

export default function OnboardingCompleteScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [percentage, setPercentage] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [factKey, setFactKey] = useState(0);

  const handleComplete = useCallback(async () => {
    try {
      await completeOnboarding();
      dispatch(setOnboardingComplete());
      navigate("/home");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      // Still navigate even if save fails
      dispatch(setOnboardingComplete());
      navigate("/home");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    // Animate percentage from 0 to 100 over 10 seconds with stops
    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= duration) {
        setPercentage(100);
        // Complete onboarding and navigate after animation finishes
        setTimeout(() => {
          handleComplete();
        }, 500);
        return;
      }

      // Find the appropriate percentage based on stops
      let currentPercent = 0;
      for (let i = 0; i < PERCENTAGE_STOPS.length; i++) {
        if (elapsed >= PERCENTAGE_STOPS[i].time) {
          currentPercent = PERCENTAGE_STOPS[i].percent;
        } else {
          // Interpolate between stops
          if (i > 0) {
            const prevStop = PERCENTAGE_STOPS[i - 1];
            const nextStop = PERCENTAGE_STOPS[i];
            const segmentTime = nextStop.time - prevStop.time;
            const segmentElapsed = elapsed - prevStop.time;
            const segmentProgress = Math.min(segmentElapsed / segmentTime, 1);
            currentPercent = Math.round(
              prevStop.percent +
                (nextStop.percent - prevStop.percent) * segmentProgress
            );
          }
          break;
        }
      }

      setPercentage(currentPercent);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [handleComplete]);

  // Rotate facts every 3 seconds
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactKey((prev) => prev + 1); // Change key to force remount and trigger animation
      setCurrentFactIndex((prev) => (prev + 1) % FACTS.length);
    }, 3000);

    return () => clearInterval(factInterval);
  }, []);

  // Calculate circle for spinning gradient
  // Fixed 20rem circle
  const circleSize = 20 * 16; // 20rem in pixels (assuming 16px base)
  const radius = (circleSize - 32) / 2 + 4; // Account for stroke width

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Progress Circle Section */}
      <div className="flex flex-col items-center mb-16 relative overflow-hidden" style={{ width: '20rem', height: '20rem' }}>
        {/* Spinning gradient circle (processing indicator) */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <svg width="20rem" height="20rem" className="animate-spin" style={{ animationDuration: "3s" }}>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4F46" />
                <stop offset="100%" stopColor="#FFE9E5" />
              </linearGradient>
            </defs>
            <circle
              cx="10rem"
              cy="10rem"
              r={radius}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
            />
          </svg>
        </div>

        {/* Content inside circle */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8 py-12 w-full h-full">
          {/* Percentage text */}
          <span className="text-5xl font-bold text-[#FF4F46] mb-4">{percentage}%</span>

          {/* Title and Description */}
          <span className="text-xl font-medium text-black mb-2 text-center w-full">
            Setting up your personal cycle guide...
          </span>
          <p className="text-black text-sm text-center w-full">
            We're building your first forecast, selecting your best insights, and tailoring
            content just for you.
          </p>
        </div>
      </div>

      {/* Did You Know Section */}
      <div className="flex flex-col items-center max-w-[15rem]">
        {/* Illustration placeholder - you can add an SVG illustration here */}
        <div className="mb-6 flex items-center justify-center">
          <img src="/fact-hero.png" alt="Onboarding Complete" className="w-full max-w-[15rem]" />
        </div>

        {/* Fact Text */}
        <h3 className="text-xl font-bold text-black mb-3 text-center">
          Did you know?
        </h3>
        <div className="relative min-h-[3rem] flex items-center justify-center">
          <p
            key={factKey}
            className="text-black text-base text-center animate-fade-in"
          >
            {FACTS[currentFactIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}

 
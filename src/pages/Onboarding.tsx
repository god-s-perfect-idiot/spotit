import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUser } from '../store/authSlice';
import HeroStep from '../components/onboarding/HeroStep';
import BirthdateStep from '../components/onboarding/BirthdateStep';
import TrackCycleStep from '../components/onboarding/TrackCycleStep';
import CycleLengthStep from '../components/onboarding/CycleLengthStep';
import GoalStep from '../components/onboarding/GoalStep';
import HealthConditionsStep from '../components/onboarding/HealthConditionsStep';
import OnboardingCompleteScreen from '../components/onboarding/OnboardingCompleteScreen';

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Initialize step from user record or default to -1 (hero)
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const lastSavedStepRef = useRef<number | null>(null);
  const isSavingRef = useRef(false);
  
  // Load step from user record when user data is available
  useEffect(() => {
    if (user && !isInitialized) {
      // If user has a saved onboarding step, restore it
      // Otherwise, start at hero page (-1)
      const savedStep = user.onboardingStep;
      if (savedStep !== undefined && savedStep !== null) {
        setCurrentStep(savedStep);
        lastSavedStepRef.current = savedStep;
      } else {
        setCurrentStep(-1);
        lastSavedStepRef.current = -1;
      }
      setIsInitialized(true);
    } else if (!user) {
      // If user is not loaded yet, keep default state
      setIsInitialized(false);
    }
  }, [user, isInitialized]);

  // Sync lastSavedStepRef when user data changes (after updates from Redux)
  useEffect(() => {
    if (user?.onboardingStep !== undefined && user.onboardingStep !== null) {
      // Only update if it's different from current ref to avoid unnecessary updates
      if (lastSavedStepRef.current !== user.onboardingStep) {
        lastSavedStepRef.current = user.onboardingStep;
      }
    }
  }, [user?.onboardingStep]);
  
  // Save step to Firestore whenever it changes (only if different from last saved)
  useEffect(() => {
    // Don't save if:
    // 1. Not initialized yet
    // 2. Already saving
    // 3. Step hasn't changed from what we last saved
    // 4. Step matches what's in the user record (to avoid loops)
    if (
      !isInitialized ||
      isSavingRef.current ||
      currentStep === lastSavedStepRef.current ||
      (user?.onboardingStep === currentStep)
    ) {
      return;
    }

    isSavingRef.current = true;
    const timeoutId = setTimeout(async () => {
      try {
        await dispatch(updateUser({ onboardingStep: currentStep })).unwrap();
        lastSavedStepRef.current = currentStep;
      } catch (error) {
        console.error('Failed to save onboarding step:', error);
      } finally {
        isSavingRef.current = false;
      }
    }, 500); // Debounce by 500ms
    
    return () => {
      clearTimeout(timeoutId);
      isSavingRef.current = false;
    };
  }, [currentStep, isInitialized, dispatch, user?.onboardingStep]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setSlideDirection('right'); // Slide in from right (next)
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > -1) {
      setSlideDirection('left'); // Slide in from left (back)
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    // Show the complete screen instead of navigating immediately
    setShowCompleteScreen(true);
  };

  const renderStep = () => {
    // Hero page (step -1)
    if (currentStep === -1) {
      return <HeroStep onNext={handleNext} />;
    }

    // Regular onboarding steps (0-4)
    switch (currentStep) {
      case 0:
        return <BirthdateStep onNext={handleNext} />;
      case 1:
        return <TrackCycleStep onNext={handleNext} />;
      case 2:
        return <CycleLengthStep onNext={handleNext} />;
      case 3:
        return <GoalStep onNext={handleNext} />;
      case 4:
        return <HealthConditionsStep onComplete={handleComplete} />;
      default:
        return <BirthdateStep onNext={handleNext} />;
    }
  };

  // Show complete screen if onboarding is finished
  if (showCompleteScreen) {
    return <OnboardingCompleteScreen />;
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
    >
      {/* Top Navigation Bar - Only show for onboarding steps (not hero) */}
      {currentStep >= 0 && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="p-2 text-white bg-[#ff6961] rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Step Indicator */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex justify-center space-x-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-[#ff6961] w-8'
                      : index < currentStep
                      ? 'bg-[#ff6961] w-2'
                      : 'bg-white w-2'
                  }`}
                /> 
              ))}
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="p-2 text-[#ff6961] transition-colors font-medium text-base"
            aria-label="Skip onboarding"
          >
            Skip
          </button>
        </div>
      )}

      {/* Step Content - Full Page */}
      <div className="w-full max-w-2xl relative overflow-hidden">
        <div
          key={currentStep}
          className={`w-full ${
            slideDirection === 'right'
              ? 'animate-slide-in-from-right'
              : slideDirection === 'left'
              ? 'animate-slide-in-from-left'
              : ''
          }`}
          onAnimationEnd={() => setSlideDirection(null)}
        >
          {renderStep()}
        </div>
      </div>
    </div>
  );
}


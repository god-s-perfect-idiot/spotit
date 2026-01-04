import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthBackground from './AuthBackground';
import WelcomeModal from './WelcomeModal';
import LoginSignupChoiceModal from './LoginSignupChoiceModal';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

type LoginStage = 'welcome' | 'choice' | 'login' | 'signup';

export default function MultiStageLogin() {
  const [currentStage, setCurrentStage] = useState<LoginStage>('welcome');
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setCurrentStage('choice');
  };

  const handleLogin = () => {
    setCurrentStage('login');
  };

  const handleSignup = () => {
    setCurrentStage('signup');
  };

  const handleSkip = () => {
    // Skip authentication and go to home
    navigate('/home');
  };

  const handleAuthSuccess = () => {
    navigate('/home');
  };

  const handleBackToChoice = () => {
    setCurrentStage('choice');
  };

  const renderModal = () => {
    switch (currentStage) {
      case 'welcome':
        return <WelcomeModal key="welcome" onGetStarted={handleGetStarted} />;
      
      case 'choice':
        return (
          <LoginSignupChoiceModal
            key="choice"
            onLogin={handleLogin}
            onSignup={handleSignup}
            onSkip={handleSkip}
          />
        );
      
      case 'login':
        return (
          <LoginModal
            key="login"
            onSignup={handleBackToChoice}
            onSuccess={handleAuthSuccess}
          />
        );
      
      case 'signup':
        return (
          <SignupModal
            key="signup"
            onLogin={handleBackToChoice}
            onSuccess={handleAuthSuccess}
          />
        );
      
      default:
        return <WelcomeModal key="welcome-default" onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <AuthBackground>
      <div className="animate-fade-in">
        {renderModal()}
      </div>
    </AuthBackground>
  );
}

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signupWithEmail, loginWithGoogle, loginWithApple, clearError } from '../../store/authSlice';
import Modal from '../Modal';

interface SignupModalProps {
  onLogin: () => void;
  onSuccess: () => void;
}

export default function SignupModal({ onLogin, onSuccess }: SignupModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Navigate to home when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await dispatch(signupWithEmail({
        email: formData.email,
        password: formData.password,
      })).unwrap();
      // onSuccess will be called via useEffect when isAuthenticated becomes true
    } catch (error) {
      // Error is handled by Redux state
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleSignIn = async () => {
    dispatch(clearError());
    
    try {
      await dispatch(loginWithGoogle()).unwrap();
      // onSuccess will be called via useEffect when isAuthenticated becomes true
    } catch (error) {
      // Error is handled by Redux state (popup closed errors are silently ignored)
    }
  };

  const handleAppleSignIn = async () => {
    dispatch(clearError());
    
    try {
      await dispatch(loginWithApple()).unwrap();
      // onSuccess will be called via useEffect when isAuthenticated becomes true
    } catch (error) {
      // Error is handled by Redux state (popup closed errors are silently ignored)
    }
  };

  return (
    <Modal className="pb-12 flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Create Your Account
      </h2>
      <p className="text-gray-700 text-center mb-6">
        Are you ready to start your journey?
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4 flex w-full flex-col items-center">
        <div className="w-full max-w-[18rem] flex items-center">
          <input
            type="email"
            name="email"
            placeholder="Email Id"
            required
            className="w-full px-4 py-3 rounded-full bg-white border border-[#FF8D7B] focus:outline-none"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="relative flex items-center w-full max-w-[18rem]">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-full bg-white border border-[#FF8D7B] focus:outline-none pr-12"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="relative flex items-center w-full max-w-[18rem]">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3 rounded-full bg-white border border-[#FF8D7B] focus:outline-none pr-12"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {(error || localError) && (
          <div className="text-red-600 text-sm text-center">{error || localError}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full max-w-[18rem] bg-[#FF6961] hover:bg-[#FF6961] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-full shadow-md"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm mb-4">or continue with</p>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-blue-600 font-bold">G</span>
          </button>
          <button
            type="button"
            onClick={handleAppleSignIn}
            disabled={isLoading}
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-white text-sm">🍎</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={onLogin}
            className="text-[#FF6961] font-medium"
          >
            Log In
          </button>
        </p>
      </div>
    </Modal>
  );
}

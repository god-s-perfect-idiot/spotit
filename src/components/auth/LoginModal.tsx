import { useState, useEffect } from "react";
import { Loader } from "../ui-kit/Loader";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginWithEmail, loginWithGoogle, loginWithApple, clearError } from "../../store/authSlice";
import Modal from "../Modal";

interface LoginModalProps {
  onSignup: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ onSignup, onSuccess }: LoginModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Navigate to home when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  // Clear error when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    try {
      await dispatch(loginWithEmail({
        email: credentials.email,
        password: credentials.password,
      })).unwrap();
      // onSuccess will be called via useEffect when isAuthenticated becomes true
    } catch (error: unknown) {
      // Error is handled by Redux state
      console.error("Error logging in:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignIn = async () => {
    dispatch(clearError());
    
    try {
      await dispatch(loginWithGoogle()).unwrap();
      // onSuccess will be called via useEffect when isAuthenticated becomes true
    } catch (error: unknown) {
      // Error is handled by Redux state (popup closed errors are silently ignored)
      console.error("Error logging in with Google:", error);
    }
  };

  const handleAppleSignIn = async () => {
    dispatch(clearError());
    
    try {
      await dispatch(loginWithApple()).unwrap();
      // onSuccess will be called via useEffect when isAuthenticated becomes true
    } catch (error: unknown) {
      // Error is handled by Redux state (popup closed errors are silently ignored)
      console.error("Error logging in with Apple:", error);
    }
  };

  return (
    <Modal>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Welcome Back
      </h2>
      <p className="text-gray-700 text-center mb-6">
        Continue your journey of spotting it!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Id"
            required
            className="w-full rounded-full border border-[#FF8D7B] bg-white px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-coral-500"
            value={credentials.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            className="w-full rounded-full border border-[#FF8D7B] bg-white px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-coral-500"
            value={credentials.password}
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

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="custom-checkbox relative h-4 w-4 cursor-pointer appearance-none rounded border-2 border-[#FF8D7B] bg-[#FFE9E5] outline-none checked:border-[#FF8D7B] checked:bg-[#FF8D7B]"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-full bg-[#FF6961] px-6 py-4 font-semibold text-white shadow-md transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader withCard={false} size="compact" label="Signing in" labelClassName="text-white" />
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm mb-4">or continue with</p>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-shadow hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-blue-600 font-bold">G</span>
          </button>
          <button
            type="button"
            onClick={handleAppleSignIn}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black shadow-md transition-shadow hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-white text-sm">🍎</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <button
            onClick={onSignup}
            className="text-[#FF6961] font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </Modal>
  );
}

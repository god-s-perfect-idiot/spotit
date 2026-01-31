import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/store'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { checkAuthState } from './store/authSlice'
import { onAuthStateChange } from './utils/firebaseAuth'
import Layout from './Layout'
import MultiStageLogin from './components/auth/MultiStageLogin'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Insights from './pages/Insights'
import Read from './pages/Read'
import Profile from './pages/Profile'

// Auth state observer component
function AuthStateObserver() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set up Firebase auth state observer
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      await dispatch(checkAuthState(firebaseUser));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return null;
}

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  // Only show loading on initial app load when we have no persisted state
  // After that, use persisted state immediately and check auth in background
  if (isLoading && !user && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user needs onboarding
  if (user && !user.completedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

// Onboarding Route - only accessible if user hasn't completed onboarding
function OnboardingRoute() {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  // Only show loading on initial app load when we have no persisted state
  if (isLoading && !user && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user has completed onboarding, redirect to home
  if (user && user.completedOnboarding) {
    return <Navigate to="/home" replace />;
  }

  return <Onboarding />;
}

function AppContent() {
  return (
    <Router>
      <AuthStateObserver />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<MultiStageLogin />} />
        
        {/* Onboarding route - separate from Layout */}
        <Route path="/onboarding" element={<OnboardingRoute />} />
        
        {/* Protected routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/read" element={<ProtectedRoute><Read /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  )
}

export default App

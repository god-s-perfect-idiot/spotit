import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Spot It</span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Welcome, {user?.name || "User"}!
              </span>
              <button
                onClick={() => navigate("/home")}
                className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
              >
                Go to App
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Track Your
            <span className="text-pink-500"> Wellness Journey</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Spot It helps you understand your cycle, track your health, and make
            informed decisions about your wellness.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="bg-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors shadow-lg"
            >
              {isAuthenticated ? "Continue to App" : "Get Started"}
            </button>

            {!isAuthenticated && (
              <button
                onClick={handleLogin}
                className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-50 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Spot It?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Cycle Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your menstrual cycle with precision and get insights
                into your patterns.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Health Insights
              </h3>
              <p className="text-gray-600">
                Track symptoms, moods, and health metrics to better understand
                your body.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Mobile First
              </h3>
              <p className="text-gray-600">
                Access your data anywhere with our mobile app and PWA support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import TripForm from './components/TripForm';
import TripDisplay from './components/TripDisplay';
import LoadingScreen from './components/LoadingScreen';
import { generateTravelPlan } from './geminiService';
import { TravelPlan, TripFormData } from './types';
import { Plane, Compass, Globe, Map } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TravelPlan | null>(null);

  const handleFormSubmit = async (formData: TripFormData) => {
    setLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateTravelPlan(formData);
      setPlan(generatedPlan);

      // Scroll to result
      setTimeout(() => {
        document.getElementById('plan-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError('Something went wrong while generating your plan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Header */}
      <header className="relative h-[65vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_70%)]"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <Compass className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            WanderGenie
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 font-light mb-8 drop-shadow-md">
            Your personalized journey begins with a single wish. Let AI craft your perfect escape.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/20 text-sm">
              <Globe className="w-4 h-4" /> Global Destinations
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/20 text-sm">
              <Map className="w-4 h-4" /> Smart Itineraries
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <TripForm onSubmit={handleFormSubmit} isLoading={loading} />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            <div className="pt-4 lg:pt-0">
              {loading ? (
                <LoadingScreen />
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl flex items-center gap-4">
                  <span className="text-2xl">⚠️</span>
                  <p>{error}</p>
                </div>
              ) : plan ? (
                <div id="plan-results" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <TripDisplay plan={plan} />
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                  <Plane className="w-16 h-16 text-slate-300 mb-6" />
                  <h2 className="text-2xl font-semibold text-slate-400 mb-2">Ready for Adventure?</h2>
                  <p className="text-slate-400 max-w-sm">
                    Fill out the form on the left to generate your personalized AI travel plan with interactive maps and full scheduling.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-10 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} WanderGenie AI Travel Planner. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
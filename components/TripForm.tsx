
import React, { useState, useEffect } from 'react';
import { TripFormData } from '../types';
import { Send, MapPin, Calendar, Users, Wallet, Heart, Hotel, MapPinned, Coins } from 'lucide-react';

interface Props {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

const INTEREST_OPTIONS = [
  'History', 'Nature', 'Food', 'Art', 'Nightlife', 
  'Shopping', 'Adventure', 'Relaxation', 'Architecture', 'Photography'
];

const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
];

const TripForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [currency, setCurrency] = useState('INR');
  const [budget, setBudget] = useState(50000);
  const [interests, setInterests] = useState<string[]>([]);
  const [includeHotelCharges, setIncludeHotelCharges] = useState(true);
  const [mustVisitPlaces, setMustVisitPlaces] = useState('');

  // Adjust default budget when currency changes for better UX
  useEffect(() => {
    if (currency === 'INR') setBudget(50000);
    else if (currency === 'USD' || currency === 'EUR' || currency === 'GBP') setBudget(2000);
    else if (currency === 'JPY') setBudget(100000);
    else setBudget(2500);
  }, [currency]);

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    onSubmit({ 
      destination, 
      duration, 
      travelers, 
      budget, 
      currency,
      interests, 
      includeHotelCharges,
      mustVisitPlaces: mustVisitPlaces.trim() || undefined
    });
  };

  const currentCurrency = CURRENCY_OPTIONS.find(c => c.code === currency) || CURRENCY_OPTIONS[0];

  const formatCurrencyValue = (val: number) => {
    if (currency === 'INR') {
      if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
      return `₹${val.toLocaleString('en-IN')}`;
    }
    return `${currentCurrency.symbol}${val.toLocaleString()}`;
  };

  const getSliderMax = () => {
    if (currency === 'INR') return 1000000;
    if (currency === 'JPY') return 2000000;
    return 50000;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Send className="w-6 h-6 text-blue-500" />
        Trip Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Destination
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Jaipur, Rajasthan"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4" /> Currency
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} - {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Must-Visit Places (Optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2"><MapPinned className="w-4 h-4" /> Must-Visit Places</span>
            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Optional</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Hawa Mahal, Amer Fort"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={mustVisitPlaces}
            onChange={(e) => setMustVisitPlaces(e.target.value)}
          />
          <p className="mt-2 text-[10px] text-slate-400">Specify landmarks you absolutely want to see.</p>
        </div>

        {/* Duration & Travelers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Days
            </label>
            <input
              type="number"
              min="1"
              max="14"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" /> People
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Budget Slider */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-4 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Total Budget</span>
            <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
              {formatCurrencyValue(budget)}
            </span>
          </label>
          <input
            type="range"
            min={currency === 'INR' ? 1000 : 100}
            max={getSliderMax()}
            step={currency === 'INR' ? 1000 : 100}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
          />
          <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium px-1">
            <span>{formatCurrencyValue(currency === 'INR' ? 1000 : 100)}</span>
            <span>{formatCurrencyValue(getSliderMax())}</span>
          </div>
        </div>

        {/* Hotel Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${includeHotelCharges ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
              <Hotel className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">Include Stays?</p>
              <p className="text-[10px] text-slate-500">Calculate hotel costs in budget</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIncludeHotelCharges(!includeHotelCharges)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              includeHotelCharges ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                includeHotelCharges ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" /> Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  interests.includes(interest)
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !destination}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Crafting Magic...
            </span>
          ) : (
            'Generate My Trip'
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;

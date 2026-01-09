import React from 'react';
import { TravelPlan } from '../types';
import TripMap from './TripMap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { MapPin, Utensils, Hotel, Calendar, CreditCard, Clock, ExternalLink, ShieldCheck, Link2, Car, Sparkles } from 'lucide-react';

interface Props {
  plan: TravelPlan;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const CURRENCY_SYMBOLS: Record<string, string> = {
  'INR': '₹',
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'AUD': 'A$',
  'CAD': 'C$',
};

const TripDisplay: React.FC<Props> = ({ plan }) => {
  const getSymbol = () => {
    if (CURRENCY_SYMBOLS[plan.currency]) return CURRENCY_SYMBOLS[plan.currency];
    if (plan.currency.length === 1) return plan.currency;
    return plan.currency + ' ';
  };

  const currencySymbol = getSymbol();

  return (
    <div className="space-y-12">
      {/* Visual Journey Summary (The Pseudo-Map) */}
      <section className="animate-in fade-in zoom-in duration-1000 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
           <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Your Journey at a Glance</h3>
          </div>
          <span className="w-fit text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">Artistic Visualization</span>
        </div>
        <TripMap plan={plan} />
      </section>

      {/* Overview Section */}
      <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <div className="p-8 relative">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold text-slate-900">{plan.destination}</h2>
            {plan.sources && plan.sources.length > 0 && (
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Pricing Sources
              </span>
            )}
          </div>
          <p className="text-slate-600 leading-relaxed text-lg italic">
            "{plan.overview}"
          </p>
        </div>
      </section>

      {/* Itinerary */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-8 h-8 text-blue-500" />
          <h3 className="text-2xl font-bold text-slate-800">Your Daily Schedule</h3>
        </div>
        <div className="space-y-12">
          {plan.itinerary.map((day) => (
            <div key={day.day} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="mb-8 border-b border-slate-50 pb-6">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Day {day.day}
                </span>
                <h4 className="text-2xl font-bold text-slate-800">{day.theme}</h4>
              </div>

              <div className="space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                {day.activities.map((activity, idx) => (
                  <div key={idx}>
                    {/* Transportation Info from Previous */}
                    {activity.transportFromPrevious && (
                      <div className="relative pl-10 my-6">
                        <div className="absolute left-[8px] top-1/2 -translate-y-1/2 w-2 h-10 bg-slate-50 rounded-full z-10 border border-slate-200 flex items-center justify-center">
                          <Car className="w-3 h-3 text-slate-400" />
                        </div>
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase tracking-tighter font-bold text-[9px]">
                                {activity.transportFromPrevious.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.transportFromPrevious.duration}
                            </div>
                            <div className="flex items-center gap-1 text-slate-700">
                              Est. Fare: <span className="font-bold">{activity.transportFromPrevious.estimatedCost}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative pl-10 pb-8">
                      {/* Timeline Dot */}
                      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white bg-blue-500 shadow-sm z-20"></div>
                      
                      <div className="flex flex-col gap-4 group">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-blue-600 font-bold mb-3 bg-blue-50 w-fit px-3 py-1 rounded-lg">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{activity.timeSlot}</span>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1 gap-2">
                                <h5 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                  {activity.name}
                                </h5>
                                {activity.sourceUrl && (
                                  <a 
                                    href={activity.sourceUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 p-1 flex items-center gap-1 text-[10px] font-bold bg-blue-100 px-1.5 py-0.5 rounded transition-all uppercase tracking-tighter"
                                  >
                                    <ExternalLink className="w-3 h-3" /> Source
                                  </a>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
                                <MapPin className="w-3.5 h-3.5" />
                                {activity.location}
                              </div>
                              <p className="text-slate-600 leading-relaxed text-sm">{activity.description}</p>
                              {activity.estimatedCost && (
                                <div className="mt-4 flex items-center gap-2">
                                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                    Activity Cost: {activity.estimatedCost}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stay & Eat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-800">Where to Stay</h3>
          </div>
          <div className="space-y-4">
            {plan.accommodations.map((acc, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{acc.name}</h4>
                    {acc.link && (
                      <a href={acc.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                        <Link2 className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{acc.type}</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{acc.description}</p>
                <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                  {acc.priceRange}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Utensils className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-bold text-slate-800">Local Flavors</h3>
          </div>
          <div className="space-y-4">
            {plan.foodSuggestions.map((food, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{food.name}</h4>
                    {food.link && (
                      <a href={food.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 transition-colors">
                        <Link2 className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{food.cuisine}</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{food.description}</p>
                <div className="text-xs italic text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded w-fit">Try: {food.specialty}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Budget Analysis */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-8 h-8 text-rose-500" />
              <h3 className="text-2xl font-bold text-slate-800">Budget Breakdown</h3>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-500 text-sm mb-1">Total Estimated Investment</p>
                <div className="text-4xl font-black text-slate-900">
                  {currencySymbol} {plan.totalEstimatedBudget.toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.budgetBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">{item.category}</span>
                    <span className="text-slate-900 font-bold">{currencySymbol} {item.estimatedCost.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={plan.budgetBreakdown as any[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="estimatedCost"
                >
                  {plan.budgetBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Sources Section */}
      {plan.sources && plan.sources.length > 0 && (
        <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ExternalLink className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">Verified Travel & Pricing Sources</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plan.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <span className="text-xs font-bold text-blue-400">{idx + 1}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-slate-200">{source.title}</p>
                  <p className="text-xs text-slate-500 truncate">{new URL(source.uri).hostname}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 ml-auto text-slate-600 group-hover:text-blue-400 transition-colors" />
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500 text-center">
            Information grounded in real-time search results via Google Gemini. Pricing sources prioritized for accuracy.
          </p>
        </section>
      )}

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => window.print()}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
        >
          Export Travel Guide (PDF)
        </button>
      </div>
    </div>
  );
};

export default TripDisplay;
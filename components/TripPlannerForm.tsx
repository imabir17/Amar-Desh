import React, { useState } from 'react';
import { BUDGET_LEVELS, TRAVEL_MOODS } from '../constants';
import { TravelPreferences } from '../types';

interface Props {
  onPlanTrip: (prefs: TravelPreferences) => void;
  onCancel: () => void;
  loading: boolean;
}

export const TripPlannerForm: React.FC<Props> = ({ onPlanTrip, onCancel, loading }) => {
  const [budget, setBudget] = useState(BUDGET_LEVELS[1]);
  const [mood, setMood] = useState(TRAVEL_MOODS[0]);
  const [duration, setDuration] = useState('3');
  const [activities, setActivities] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlanTrip({ budget, mood, duration, activities });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl mx-auto border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            AI Trip Planner
        </h2>
        <p className="text-teal-100 mt-2">Tell us your preferences, and we'll craft the perfect Bangladesh itinerary for you.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Your Budget</label>
            <select 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            >
              {BUDGET_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Preferred Mood</label>
            <select 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            >
              {TRAVEL_MOODS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Duration (Days)</label>
          <input 
            type="number" 
            min="1" 
            max="30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Favorite Activities / Special Requests</label>
          <textarea 
            rows={3}
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            placeholder="e.g., Hiking, Trying local street food, Photography, Staying in eco-resorts..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-4">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className={`px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Planning...
              </>
            ) : (
              <>
                <span>Generate Plan</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
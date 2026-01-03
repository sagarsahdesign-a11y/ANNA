import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { UserProfileData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProfileSetupProps {
  onComplete: () => void;
  userId: string;
}

// Custom Ruler Component for Height/Weight
const RulerPicker: React.FC<{
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  unit: string;
}> = ({ min, max, value, onChange, unit }) => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <span className="text-6xl font-bold text-white">{value.toFixed(1)}</span>
        <span className="text-xl text-gray-400 ml-2">{unit}</span>
      </div>
      
      <input 
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-12 appearance-none bg-transparent cursor-pointer z-20 relative accent-brand-500"
        style={{
            backgroundImage: `linear-gradient(to right, #35383F 1px, transparent 1px)`,
            backgroundSize: '2% 100%',
            backgroundRepeat: 'repeat-x'
        }}
      />
      
      <div className="flex justify-between text-gray-500 text-xs mt-2 px-1">
        <span>{min}</span>
        <span>{(min + max) / 2}</span>
        <span>{max}</span>
      </div>
      
      <div className="flex justify-center mt-2">
         <div className="w-0.5 h-8 bg-brand-500 -mt-20 pointer-events-none"></div>
      </div>
    </div>
  );
};

// Selection List Component
const SelectionList: React.FC<{
    options: { id: string; label: string; icon: string }[];
    selected: string[];
    multiSelect?: boolean;
    onSelect: (id: string) => void;
}> = ({ options, selected, multiSelect, onSelect }) => {
    return (
        <div className="space-y-3">
            {options.map((opt) => {
                const isSelected = selected.includes(opt.id);
                return (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            isSelected 
                            ? 'bg-dark-800 border-brand-500 shadow-[0_0_0_1px_rgba(194,245,88,1)]' 
                            : 'bg-dark-800 border-dark-700 hover:border-dark-600'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">{opt.icon}</span>
                            <span className="font-semibold text-white">{opt.label}</span>
                        </div>
                        {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-dark-900">
                                <Check size={14} strokeWidth={4} />
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

// Time Picker Component
const TimePicker: React.FC<{
    value: string; // HH:MM
    onChange: (val: string) => void;
}> = ({ value, onChange }) => {
    // Parse current value
    const [h, m] = value.split(':').map(Number);
    
    // Generate hours and minutes
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div className="flex justify-center items-center gap-8 h-64 overflow-hidden relative mask-linear">
            {/* Hours */}
            <div className="h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory py-24 text-center w-20">
                {hours.map(hour => (
                    <div 
                        key={hour} 
                        onClick={() => onChange(`${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)}
                        className={`snap-center py-2 text-3xl font-bold cursor-pointer transition-colors ${hour === h ? 'text-brand-500 scale-125' : 'text-gray-600'}`}
                    >
                        {hour.toString().padStart(2, '0')}
                    </div>
                ))}
            </div>

            <div className="text-3xl font-bold text-white mb-2">:</div>

            {/* Minutes */}
            <div className="h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory py-24 text-center w-20">
                {minutes.map(minute => (
                    <div 
                        key={minute} 
                        onClick={() => onChange(`${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)}
                        className={`snap-center py-2 text-3xl font-bold cursor-pointer transition-colors ${minute === m ? 'text-brand-500 scale-125' : 'text-gray-600'}`}
                    >
                        {minute.toString().padStart(2, '0')}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, userId }) => {
  const [step, setStep] = useState(1);
  const [calculating, setCalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const [data, setData] = useState<UserProfileData>({
    name: '',
    gender: 'Male',
    birthDate: '1995-01-01',
    heightCm: 185,
    weightKg: 80,
    targetWeightKg: 75,
    goals: ['lose_weight'],
    activityLevel: 'sedentary',
    dietType: 'balanced',
    breakfastTime: '08:00',
    dinnerTime: '20:30'
  });

  const totalSteps = 11;

  useEffect(() => {
      if (calculating) {
          const interval = setInterval(() => {
              setCalculationProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(interval);
                      setCalculating(false);
                      setShowResult(true);
                      return 100;
                  }
                  return prev + 1;
              });
          }, 30); // 3 seconds total
          return () => clearInterval(interval);
      }
  }, [calculating]);

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Start calculation
      setCalculating(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const finishSetup = async () => {
    try {
      await supabase.auth.updateUser({
        data: {
          ...data,
          onboarding_completed: true
        }
      });
      onComplete();
    } catch (error) {
      console.error("Profile save failed", error);
      onComplete(); // proceed anyway for demo
    }
  };

  const updateData = (key: keyof UserProfileData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleSelection = (key: 'goals', id: string) => {
      setData(prev => {
          const current = prev[key];
          if (current.includes(id)) {
              return { ...prev, [key]: current.filter(x => x !== id) };
          } else {
              // For Goals, let's keep it multi-select as per typical UX, or single if desired. 
              // Screenshots show checkmarks which implies multi-select, but usually "Main Goal" is single.
              // I'll implement multi-select behavior for flexibility.
              return { ...prev, [key]: [...current, id] };
          }
      });
  };

  // --- Views for Calculating & Result ---

  if (calculating) {
      return (
          <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-12">Personalizing your {process.env.APP_NAME || 'ANNA'} experience...</h2>
              <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="#35383F" strokeWidth="12" fill="none" />
                      <circle 
                        cx="96" cy="96" r="88" stroke="#C2F558" strokeWidth="12" fill="none" 
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - calculationProgress / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-100 ease-linear"
                      />
                  </svg>
                  <span className="absolute text-4xl font-bold text-white">{calculationProgress}%</span>
              </div>
              <p className="text-gray-400 mt-12 max-w-xs">Hang tight! We're crafting a personalized plan just for you.</p>
          </div>
      );
  }

  if (showResult) {
      // Calculate BMR and Macros (simplified logic)
      const bmr = 10 * data.weightKg + 6.25 * data.heightCm - 5 * 25 + (data.gender === 'Male' ? 5 : -161);
      const tdee = Math.round(bmr * 1.35); // Moderate activity default
      const macros = [
          { name: 'Carbs', value: 45, color: '#ef4444' }, // Red
          { name: 'Protein', value: 35, color: '#eab308' }, // Yellow/Orange
          { name: 'Fat', value: 20, color: '#3b82f6' }, // Blue
      ];

      return (
          <div className="min-h-screen bg-dark-900 flex flex-col p-6 text-center">
              <div className="flex justify-end">
                 <button onClick={finishSetup} className="p-2 text-white"><ChevronRight /></button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-white mb-2">Your personalized calorie plan is ready!</h1>
                
                <div className="h-64 w-full max-w-xs relative mt-8 min-h-[256px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={macros}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {macros.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl font-bold text-white">{tdee}</span>
                         <span className="text-sm text-gray-400">kcal</span>
                     </div>
                </div>

                <div className="flex gap-8 mt-8">
                    {macros.map(m => (
                        <div key={m.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                            <span className="text-gray-300 font-medium">{m.name}</span>
                        </div>
                    ))}
                </div>
              </div>

              <button
                onClick={finishSetup}
                className="w-full py-4 rounded-full bg-brand-500 text-dark-900 font-bold text-lg hover:bg-brand-400 transition-colors shadow-[0_4px_20px_rgba(194,245,88,0.3)]"
              >
                Start Your Plan Now
              </button>
          </div>
      );
  }

  // --- Standard Wizard Steps ---

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={handleBack} className="p-2 text-white hover:bg-dark-800 rounded-full">
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex-1 mx-6 h-1.5 bg-dark-700 rounded-full">
          <div 
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        
        <span className="text-sm font-medium">{step} / {totalSteps}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">What's your name?</h2>
            <div className="mt-8">
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center text-2xl font-bold text-white focus:border-brand-500 focus:outline-none placeholder-gray-600"
                />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">What's your gender?</h2>
            <div className="flex flex-col gap-6 items-center">
                {['Male', 'Female', 'Other'].map((g) => (
                    <button
                        key={g}
                        onClick={() => updateData('gender', g)}
                        className={`w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 border-2 transition-all ${
                            data.gender === g 
                            ? 'bg-brand-500 border-brand-500 text-dark-900' 
                            : 'bg-dark-800 border-dark-700 text-gray-400 hover:border-brand-500'
                        }`}
                    >
                        <span className="text-4xl">{g === 'Male' ? '♂' : g === 'Female' ? '♀' : '⚥'}</span>
                        <span className="font-medium">{g}</span>
                    </button>
                ))}
            </div>
          </div>
        )}

        {step === 3 && (
           <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">When's your birthday?</h2>
            <div className="mt-8">
                <input
                    type="date"
                    value={data.birthDate}
                    onChange={(e) => updateData('birthDate', e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center text-xl text-white focus:border-brand-500 focus:outline-none"
                />
            </div>
           </div>
        )}

        {step === 4 && (
          <div className="text-center">
             <h2 className="text-3xl font-bold mb-12">How tall are you?</h2>
             <RulerPicker 
                min={120} 
                max={220} 
                value={data.heightCm} 
                onChange={(val) => updateData('heightCm', val)} 
                unit="cm"
             />
          </div>
        )}

        {step === 5 && (
          <div className="text-center">
             <h2 className="text-3xl font-bold mb-12">What's your current weight?</h2>
             <RulerPicker 
                min={30} 
                max={150} 
                value={data.weightKg} 
                onChange={(val) => updateData('weightKg', val)} 
                unit="kg"
             />
          </div>
        )}

        {step === 6 && (
          <div className="text-center">
             <h2 className="text-3xl font-bold mb-12">What's your target weight?</h2>
             <RulerPicker 
                min={30} 
                max={150} 
                value={data.targetWeightKg} 
                onChange={(val) => updateData('targetWeightKg', val)} 
                unit="kg"
             />
          </div>
        )}

        {step === 7 && (
            <div>
                <h2 className="text-3xl font-bold mb-8 text-center">What's your main goal?</h2>
                <SelectionList 
                    options={[
                        { id: 'lose_weight', label: 'Lose Weight', icon: '🔥' },
                        { id: 'gain_muscle', label: 'Gain Muscle', icon: '💪' },
                        { id: 'maintain', label: 'Maintain Weight', icon: '⚖️' },
                        { id: 'boost_energy', label: 'Boost Energy', icon: '⚡' },
                        { id: 'improve_nutrition', label: 'Improve Nutrition', icon: '🥗' },
                        { id: 'gain_weight', label: 'Gain Weight', icon: '🎈' },
                    ]}
                    selected={data.goals}
                    onSelect={(id) => toggleSelection('goals', id)}
                />
            </div>
        )}

        {step === 8 && (
            <div>
                <h2 className="text-3xl font-bold mb-8 text-center">What's your activity level?</h2>
                <SelectionList 
                    options={[
                        { id: 'sedentary', label: 'Sedentary', icon: '🛋️' },
                        { id: 'light', label: 'Lightly Active', icon: '🚶' },
                        { id: 'moderate', label: 'Moderately Active', icon: '🏃' },
                        { id: 'very', label: 'Very Active', icon: '🏋️' },
                        { id: 'super', label: 'Super Active', icon: '💪' },
                    ]}
                    selected={[data.activityLevel]}
                    onSelect={(id) => updateData('activityLevel', id)}
                />
            </div>
        )}

        {step === 9 && (
            <div>
                <h2 className="text-3xl font-bold mb-8 text-center">What's your diet type?</h2>
                <SelectionList 
                    options={[
                        { id: 'balanced', label: 'Balanced Diet', icon: '🥗' },
                        { id: 'high_protein', label: 'High Protein', icon: '🍗' },
                        { id: 'low_carb', label: 'Low Carb', icon: '🥩' },
                        { id: 'vegetarian', label: 'Vegetarian', icon: '🥕' },
                        { id: 'vegan', label: 'Vegan', icon: '🌿' },
                        { id: 'keto', label: 'Keto', icon: '🥑' },
                        { id: 'mediterranean', label: 'Mediterranean', icon: '🍅' },
                    ]}
                    selected={[data.dietType]}
                    onSelect={(id) => updateData('dietType', id)}
                />
            </div>
        )}

        {step === 10 && (
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-8">When do you usually have breakfast?</h2>
                <TimePicker value={data.breakfastTime} onChange={(v) => updateData('breakfastTime', v)} />
            </div>
        )}

        {step === 11 && (
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-8">When do you usually have dinner?</h2>
                <TimePicker value={data.dinnerTime} onChange={(v) => updateData('dinnerTime', v)} />
            </div>
        )}

      </div>

      {/* Footer Button */}
      <div className="mt-8">
        <button
          onClick={handleNext}
          disabled={step === 1 && !data.name}
          className="w-full py-4 rounded-full bg-brand-500 text-dark-900 font-bold text-lg hover:bg-brand-400 transition-colors shadow-[0_4px_20px_rgba(194,245,88,0.3)] disabled:opacity-50 disabled:shadow-none"
        >
          {step === totalSteps ? 'Finish' : 'Continue'}
        </button>
      </div>

    </div>
  );
};

export default ProfileSetup;
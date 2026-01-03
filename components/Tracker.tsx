import React, { useState } from 'react';
import { 
    Plus, Minus, Droplets, Footprints, Scale, Activity, 
    ChevronRight, ChevronLeft, Settings, History, ArrowLeft, 
    MoreHorizontal, Calendar
} from 'lucide-react';
import { 
    LineChart, Line, AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, 
    BarChart, Bar 
} from 'recharts';

type TrackerView = 'MAIN' | 'WATER' | 'STEPS' | 'WEIGHT' | 'BMI';

const Tracker: React.FC = () => {
    const [view, setView] = useState<TrackerView>('MAIN');

    // --- Mock Data & State ---
    
    // Water
    const [waterIntake, setWaterIntake] = useState(1250);
    const waterGoal = 2500;
    const waterHistory = [
        { time: '6 AM', amount: 0 },
        { time: '9 AM', amount: 300 },
        { time: '12 PM', amount: 500 },
        { time: '3 PM', amount: 200 },
        { time: '6 PM', amount: 250 },
    ];
    
    // Steps
    const [steps, setSteps] = useState(4205);
    const stepGoal = 6000;
    const stepHistory = [
        { time: '6 AM', steps: 0 },
        { time: '9 AM', steps: 1200 },
        { time: '12 PM', steps: 1500 },
        { time: '3 PM', steps: 800 },
        { time: '6 PM', steps: 705 },
    ];

    // Weight
    const [weight, setWeight] = useState(78.4);
    const weightGoal = 75.0;
    const weightHistoryData = [
        { date: 'Dec 19', weight: 78.5 },
        { date: 'Dec 20', weight: 78.7 },
        { date: 'Dec 21', weight: 78.5 },
        { date: 'Dec 22', weight: 78.4 },
        { date: 'Dec 23', weight: 78.8 },
        { date: 'Dec 24', weight: 79.0 },
        { date: 'Dec 25', weight: 78.4 },
    ];

    // BMI
    const [height, setHeight] = useState(185); // cm
    const bmi = (weight / ((height/100) * (height/100))).toFixed(1);

    // --- Components ---

    const Header = ({ title, rightIcon }: { title: string, rightIcon?: React.ReactNode }) => (
        <div className="flex items-center justify-between mb-6">
            <button 
                onClick={() => setView('MAIN')} 
                className="p-2 -ml-2 hover:bg-dark-800 rounded-full text-white transition-colors"
            >
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <div className="w-10 flex justify-end">
                {rightIcon || <button className="p-2"><Settings size={24} /></button>}
            </div>
        </div>
    );

    const DateStrip = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const currentDay = 2; // Wed
        return (
            <div className="flex justify-between mb-8 bg-dark-800 p-2 rounded-2xl">
                {days.map((d, i) => (
                    <div 
                        key={d} 
                        className={`flex flex-col items-center justify-center w-10 h-14 rounded-xl text-xs font-medium transition-colors ${
                            i === currentDay 
                            ? 'bg-brand-500 text-dark-900 shadow-lg' 
                            : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        <span className="mb-1">{d}</span>
                        <span className="font-bold text-sm">{16 + i}</span>
                    </div>
                ))}
            </div>
        );
    };

    // --- Sub-Views ---

    const WaterView = () => (
        <div className="min-h-screen bg-dark-900 px-6 pt-6 pb-24 text-white animate-in slide-in-from-right duration-300">
            <Header title="Water Tracker" />
            <DateStrip />

            {/* Main Visual */}
            <div className="flex flex-col items-center justify-center mb-8 relative">
                <div className="relative w-64 h-64">
                    {/* Background Drop */}
                    <svg viewBox="0 0 24 24" className="w-full h-full text-dark-800 fill-current">
                         <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    
                    {/* Filled Drop (Clipped) */}
                    <div className="absolute inset-0 overflow-hidden flex items-end justify-center">
                        <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500 fill-current absolute top-0 left-0">
                            <defs>
                                <clipPath id="waterLevel">
                                    <rect x="0" y={24 - (24 * (waterIntake/waterGoal))} width="24" height="24" />
                                </clipPath>
                            </defs>
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" clipPath="url(#waterLevel)" />
                        </svg>
                    </div>

                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                        <span className="text-4xl font-bold text-white">{waterIntake}</span>
                        <span className="text-gray-400 text-sm">/ {waterGoal} ml</span>
                    </div>
                </div>
            </div>

            {/* Quick Add */}
            <div className="mb-8">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Quick Add</h3>
                    <span className="text-brand-500 text-sm">Settings</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => setWaterIntake(prev => prev + 200)}
                        className="bg-dark-800 p-4 rounded-2xl border border-dark-700 hover:bg-dark-700 transition-colors flex items-center gap-3"
                     >
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                            <Droplets size={20} />
                        </div>
                        <div className="text-left">
                            <span className="block font-bold">200ml</span>
                            <span className="text-xs text-gray-500">Water</span>
                        </div>
                     </button>
                     <button 
                        onClick={() => setWaterIntake(prev => prev + 250)}
                        className="bg-dark-800 p-4 rounded-2xl border border-dark-700 hover:bg-dark-700 transition-colors flex items-center gap-3"
                     >
                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                            <Droplets size={20} />
                        </div>
                        <div className="text-left">
                            <span className="block font-bold">250ml</span>
                            <span className="text-xs text-gray-500">Juice</span>
                        </div>
                     </button>
                </div>
            </div>

            {/* History List */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Today's Records</h3>
                    <span className="text-brand-500 text-sm">View All</span>
                </div>
                <div className="space-y-3">
                    {waterHistory.map((item, i) => (
                        <div key={i} className="bg-dark-800 p-4 rounded-2xl flex items-center justify-between border border-dark-700">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                                    <Droplets size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{item.amount}ml</p>
                                    <p className="text-xs text-gray-500">Water • {item.time}</p>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-white"><MoreHorizontal size={20} /></button>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Main Action */}
             <div className="fixed bottom-24 left-6 right-6">
                <button 
                    onClick={() => setWaterIntake(prev => prev + 200)}
                    className="w-full py-4 rounded-full bg-brand-500 text-dark-900 font-bold hover:bg-brand-400 transition-colors shadow-lg"
                >
                    Drink (200 ml)
                </button>
            </div>
        </div>
    );

    const StepsView = () => (
        <div className="min-h-screen bg-dark-900 px-6 pt-6 pb-24 text-white animate-in slide-in-from-right duration-300">
            <Header title="Step Counter" />
            <DateStrip />

            {/* Circular Gauge */}
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* SVG Gauge */}
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Track */}
                        <circle cx="128" cy="128" r="110" stroke="#1F222A" strokeWidth="20" fill="none" />
                        {/* Progress */}
                        <circle 
                            cx="128" cy="128" r="110" 
                            stroke="#C2F558" 
                            strokeWidth="20" 
                            fill="none" 
                            strokeDasharray={2 * Math.PI * 110}
                            strokeDashoffset={2 * Math.PI * 110 * (1 - steps/stepGoal)}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Footprints size={32} className="text-brand-500 mb-2" />
                        <span className="text-4xl font-bold text-white">{steps.toLocaleString()}</span>
                        <span className="text-gray-400 text-sm">/ {stepGoal.toLocaleString()} steps</span>
                    </div>
                </div>
            </div>

            {/* History Graph */}
            <div className="bg-dark-800 rounded-3xl p-6 border border-dark-700 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white">Daily Average</h3>
                    <span className="text-xs text-gray-500 bg-dark-900 px-2 py-1 rounded-lg">Today</span>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stepHistory}>
                            <Tooltip 
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: '#1F222A', border: 'none', borderRadius: '8px' }}
                            />
                            <Bar 
                                dataKey="steps" 
                                fill="#C2F558" 
                                radius={[4, 4, 4, 4]} 
                                barSize={12}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-dark-800 p-4 rounded-2xl border border-dark-700">
                     <p className="text-xs text-gray-500 mb-1">Calories Burned</p>
                     <p className="text-xl font-bold text-orange-500">265 <span className="text-xs text-gray-500">kcal</span></p>
                 </div>
                 <div className="bg-dark-800 p-4 rounded-2xl border border-dark-700">
                     <p className="text-xs text-gray-500 mb-1">Distance</p>
                     <p className="text-xl font-bold text-blue-500">3.2 <span className="text-xs text-gray-500">km</span></p>
                 </div>
            </div>
        </div>
    );

    const WeightView = () => (
        <div className="min-h-screen bg-dark-900 px-6 pt-6 pb-24 text-white animate-in slide-in-from-right duration-300">
            <Header title="Weight Tracker" />
            
            <div className="bg-dark-800 rounded-3xl p-6 border border-dark-700 mb-8 text-center">
                <p className="text-gray-400 text-sm mb-2">Current Weight</p>
                <h2 className="text-5xl font-bold text-white mb-2">{weight} <span className="text-xl text-gray-500">kg</span></h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-green-500 text-sm font-medium bg-green-500/10 px-2 py-1 rounded-lg">-0.5 kg</span>
                    <span className="text-gray-500 text-sm">since last week</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2 flex justify-between text-xs text-gray-400">
                    <span>Start: 80.0 kg</span>
                    <span>Goal: {weightGoal} kg</span>
                </div>
                <div className="h-2 bg-dark-900 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-brand-500 w-[65%] rounded-full"></div>
                </div>

                <button 
                    onClick={() => setWeight(prev => Number((prev - 0.1).toFixed(1)))} // Mock update
                    className="w-full py-3 rounded-full bg-brand-500 text-dark-900 font-bold hover:bg-brand-400 transition-colors"
                >
                    Update Weight
                </button>
            </div>

            {/* History Graph */}
             <div className="bg-dark-800 rounded-3xl p-6 border border-dark-700 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white">History</h3>
                    <span className="text-brand-500 text-sm">View All</span>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weightHistoryData}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1F222A', border: 'none', borderRadius: '8px' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="weight" 
                                stroke="#A855F7" 
                                strokeWidth={3}
                                fill="url(#colorWeight)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* History List */}
            <div className="space-y-3">
                 {weightHistoryData.slice().reverse().slice(0, 3).map((item, i) => (
                    <div key={i} className="bg-dark-800 p-4 rounded-2xl flex items-center justify-between border border-dark-700">
                        <div className="flex items-center gap-4">
                             <div className="p-2 bg-purple-500/10 rounded-full text-purple-500">
                                <Scale size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-white">{item.weight} kg</p>
                                <p className="text-xs text-gray-500">{item.date} • 08:30 AM</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const BMIView = () => (
        <div className="min-h-screen bg-dark-900 px-6 pt-6 pb-24 text-white animate-in slide-in-from-right duration-300">
            <Header title="Edit BMI" />
            
            <div className="bg-dark-800 rounded-3xl p-6 border border-dark-700 mb-6">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-white mb-1">{bmi}</h2>
                    <p className="text-green-500 font-medium">Normal Weight</p>
                </div>

                {/* Simple Gauge Visual */}
                <div className="h-3 bg-dark-900 rounded-full overflow-hidden flex mb-8">
                     <div className="flex-1 bg-blue-400 opacity-50"></div>
                     <div className="flex-1 bg-green-500"></div>
                     <div className="flex-1 bg-yellow-500 opacity-50"></div>
                     <div className="flex-1 bg-red-500 opacity-50"></div>
                </div>
                
                 <div className="space-y-6">
                    <div>
                         <label className="block text-sm font-medium text-gray-400 mb-2">Height (cm)</label>
                         <div className="bg-dark-900 p-4 rounded-xl border border-dark-700 text-center">
                            <span className="text-2xl font-bold">{height}</span>
                            <input 
                                type="range" 
                                min="100" max="250" 
                                value={height} 
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full mt-2 accent-brand-500"
                            />
                         </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                         <div className="bg-dark-900 p-4 rounded-xl border border-dark-700 text-center">
                            <span className="text-2xl font-bold">{weight}</span>
                            <input 
                                type="range" 
                                min="30" max="200" step="0.1"
                                value={weight} 
                                onChange={(e) => setWeight(Number(e.target.value))}
                                className="w-full mt-2 accent-brand-500"
                            />
                         </div>
                    </div>
                 </div>

                 <button 
                    onClick={() => setView('MAIN')}
                    className="w-full mt-8 py-4 rounded-full bg-brand-500 text-dark-900 font-bold hover:bg-brand-400 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );

    // --- Main Dashboard ---

    if (view === 'MAIN') {
        return (
            <div className="min-h-screen bg-dark-900 px-6 pt-6 pb-24 text-white">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Tracker</h1>
                    <button className="p-2"><MoreHorizontal size={24} /></button>
                </div>

                <div className="space-y-6">
                    
                    {/* Water Card */}
                    <div className="bg-dark-800 rounded-3xl p-5 border border-dark-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                                    <Droplets size={20} />
                                </div>
                                <h3 className="font-bold text-lg">Water</h3>
                            </div>
                            <button onClick={() => setView('WATER')} className="p-2 bg-dark-700 rounded-full hover:bg-dark-600"><Plus size={16} /></button>
                        </div>
                        <div className="flex items-end gap-1 mb-2">
                             <span className="text-3xl font-bold text-white">{waterIntake}</span>
                             <span className="text-gray-500 mb-1">/ {waterGoal} mL</span>
                        </div>
                        <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(waterIntake/waterGoal)*100}%` }} />
                        </div>
                    </div>

                    {/* Step Card */}
                    <div onClick={() => setView('STEPS')} className="bg-dark-800 rounded-3xl p-5 border border-dark-700 flex justify-between items-center cursor-pointer hover:bg-dark-800/80 transition-colors">
                        <div>
                             <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-500">
                                    <Footprints size={20} />
                                </div>
                                <h3 className="font-bold text-lg">Step</h3>
                            </div>
                            <div className="flex items-end gap-1">
                                 <span className="text-3xl font-bold text-white">{steps.toLocaleString()}</span>
                                 <span className="text-gray-500 mb-1 text-xs">steps</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">/ {stepGoal.toLocaleString()} steps</p>
                        </div>
                        
                        <div className="relative w-20 h-20">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="32" stroke="#1F222A" strokeWidth="6" fill="none" />
                                <circle 
                                    cx="40" cy="40" r="32" 
                                    stroke="#C2F558" 
                                    strokeWidth="6" 
                                    fill="none" 
                                    strokeDasharray={2 * Math.PI * 32}
                                    strokeDashoffset={2 * Math.PI * 32 * (1 - steps/stepGoal)}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Weight Card */}
                    <div onClick={() => setView('WEIGHT')} className="bg-dark-800 rounded-3xl p-5 border border-dark-700 cursor-pointer hover:bg-dark-800/80 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                                    <Scale size={20} />
                                </div>
                                <h3 className="font-bold text-lg">Weight</h3>
                            </div>
                             <button className="px-3 py-1 bg-brand-500 text-dark-900 text-xs font-bold rounded-lg">Update</button>
                        </div>
                        <div className="flex items-end gap-2 mb-4">
                             <span className="text-3xl font-bold text-white">{weight}</span>
                             <span className="text-gray-500 mb-1">kg</span>
                             <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full mb-1 ml-2">-0.5 kg</span>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Start: 80.0 kg</span>
                            <span>Goal: {weightGoal} kg</span>
                        </div>
                        <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }} />
                        </div>
                    </div>

                    {/* BMI Card */}
                    <div onClick={() => setView('BMI')} className="bg-dark-800 rounded-3xl p-5 border border-dark-700 cursor-pointer hover:bg-dark-800/80 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">BMI (kg/m2)</h3>
                                </div>
                            </div>
                            <button className="p-2"><ChevronRight size={20} className="text-gray-500" /></button>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-3xl font-bold text-white">{bmi}</span>
                                <span className="text-green-500 font-medium ml-2">Normal</span>
                            </div>
                        </div>
                        <div className="mt-4 h-2 flex gap-1 rounded-full overflow-hidden">
                            <div className="flex-1 bg-blue-400 opacity-50"></div>
                            <div className="flex-1 bg-green-500"></div>
                            <div className="flex-1 bg-yellow-500 opacity-50"></div>
                            <div className="flex-1 bg-red-500 opacity-50"></div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // Sub-views are rendered based on state
    if (view === 'WATER') return <WaterView />;
    if (view === 'STEPS') return <StepsView />;
    if (view === 'WEIGHT') return <WeightView />;
    if (view === 'BMI') return <BMIView />;

    return null;
};

export default Tracker;
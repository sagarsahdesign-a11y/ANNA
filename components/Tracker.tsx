import React, { useState } from 'react';
import { Plus, Minus, Droplets, Footprints, Scale, Activity, ChevronRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const Tracker: React.FC = () => {
    // Mock State
    const [waterIntake, setWaterIntake] = useState(1250); // ml
    const waterGoal = 2500;
    const [weight, setWeight] = useState(78.5); // kg
    
    // Mock Data
    const weightHistory = [
        { day: 'Mon', weight: 79.2 },
        { day: 'Tue', weight: 79.0 },
        { day: 'Wed', weight: 78.8 },
        { day: 'Thu', weight: 78.5 },
        { day: 'Fri', weight: 78.5 },
    ];

    const bmi = 23.4; // Calculated based on weight/height
    const bmiCategory = "Normal";

    const addWater = (amount: number) => {
        setWaterIntake(prev => Math.min(prev + amount, waterGoal + 1000));
    };

    return (
        <div className="min-h-screen bg-dark-900 text-white pb-24 pt-6 px-6">
            <h1 className="text-2xl font-bold mb-6">Tracker</h1>

            <div className="space-y-6">
                
                {/* 1. Water Tracker */}
                <div className="bg-dark-800 rounded-3xl p-6 border border-dark-700">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                <Droplets size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Hydration</h3>
                                <p className="text-xs text-gray-500">Daily Goal: {waterGoal / 1000}L</p>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-blue-400">
                            {(waterIntake / 1000).toFixed(2)}<span className="text-sm text-gray-500">L</span>
                        </span>
                    </div>

                    {/* Water Progress Bar */}
                    <div className="h-4 bg-dark-900 rounded-full overflow-hidden mb-6 relative">
                        <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => addWater(250)}
                            className="flex-1 bg-dark-900 hover:bg-dark-700 border border-dark-700 text-blue-400 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> 250ml
                        </button>
                        <button 
                            onClick={() => addWater(500)}
                            className="flex-1 bg-dark-900 hover:bg-dark-700 border border-dark-700 text-blue-400 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> 500ml
                        </button>
                    </div>
                </div>

                {/* 2. Step Counter */}
                <div className="bg-dark-800 rounded-3xl p-6 border border-dark-700">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-500/10 rounded-xl text-brand-500">
                                <Footprints size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Steps</h3>
                                <p className="text-xs text-gray-500">Goal: 10,000</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className="text-2xl font-bold text-white">6,432</span>
                        </div>
                    </div>
                    <div className="h-3 bg-dark-900 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 w-[64%] rounded-full" />
                    </div>
                </div>

                {/* 3. Weight Tracker */}
                <div className="bg-dark-800 rounded-3xl p-6 border border-dark-700">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                                <Scale size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Weight</h3>
                                <p className="text-xs text-gray-500">Target: 75 kg</p>
                            </div>
                        </div>
                        <button className="text-xs bg-dark-900 hover:bg-dark-700 px-3 py-1.5 rounded-lg border border-dark-700 transition-colors">
                            Log Weight
                        </button>
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-bold text-white">{weight}</span>
                        <span className="text-lg text-gray-500">kg</span>
                        <span className="ml-2 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                            -0.7 kg this week
                        </span>
                    </div>

                    <div className="h-32 w-full min-h-[128px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightHistory}>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F222A', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="weight" 
                                    stroke="#A855F7" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#A855F7', strokeWidth: 0 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. BMI Tracker */}
                <div className="bg-dark-800 rounded-3xl p-6 border border-dark-700 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">BMI</h3>
                            <p className="text-xs text-gray-500">Body Mass Index</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">{bmi}</div>
                        <div className="text-xs text-green-500 font-medium">{bmiCategory}</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Tracker;
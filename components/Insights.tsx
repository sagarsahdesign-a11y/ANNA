import React from 'react';
import { Sparkles, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

const Insights: React.FC = () => {
    
    // Mock Data
    const calorieData = [
        { day: 'M', calories: 2100 },
        { day: 'T', calories: 1950 },
        { day: 'W', calories: 2400 },
        { day: 'T', calories: 1800 },
        { day: 'F', calories: 2250 },
        { day: 'S', calories: 2600 },
        { day: 'S', calories: 2100 },
    ];

    const weightTrendData = [
        { week: 'W1', weight: 80 },
        { week: 'W2', weight: 79.5 },
        { week: 'W3', weight: 79.2 },
        { week: 'W4', weight: 78.5 },
    ];

    return (
        <div className="min-h-screen bg-dark-900 text-white pb-24 pt-6 px-6">
            <h1 className="text-2xl font-bold mb-6">Insights</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-dark-800 p-4 rounded-2xl border border-dark-700">
                    <div className="text-xs text-gray-500 mb-1">Avg Kcal</div>
                    <div className="text-xl font-bold text-white">2,170</div>
                    <div className="text-[10px] text-red-400">↑ 12%</div>
                </div>
                <div className="bg-dark-800 p-4 rounded-2xl border border-dark-700">
                    <div className="text-xs text-gray-500 mb-1">Avg Steps</div>
                    <div className="text-xl font-bold text-white">7,240</div>
                    <div className="text-[10px] text-green-400">↑ 5%</div>
                </div>
                <div className="bg-dark-800 p-4 rounded-2xl border border-dark-700">
                    <div className="text-xs text-gray-500 mb-1">Weight</div>
                    <div className="text-xl font-bold text-white">-1.5</div>
                    <div className="text-[10px] text-green-400">kg/mo</div>
                </div>
            </div>

            {/* AI Insights Section */}
            <div className="bg-gradient-to-br from-brand-900/50 to-dark-800 border border-brand-500/30 p-6 rounded-3xl mb-8 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-brand-500" size={20} />
                    <h3 className="font-bold text-brand-100">AI Analysis</h3>
                </div>
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        • You tend to consume <b className="text-white">30% more calories</b> on weekends compared to weekdays.
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        • Your protein intake averages <b className="text-white">85g</b>, which is slightly below your target of 120g. Consider adding a shake post-workout.
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
                
                {/* Calorie Chart */}
                <div className="bg-dark-800 p-6 rounded-3xl border border-dark-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Calories</h3>
                        <span className="text-xs text-gray-500 bg-dark-900 px-2 py-1 rounded-lg">Last 7 Days</span>
                    </div>
                    <div className="h-48 w-full min-h-[192px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={calorieData}>
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                                    dy={10}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1F222A', border: 'none', borderRadius: '8px' }}
                                />
                                <Bar 
                                    dataKey="calories" 
                                    fill="#C2F558" 
                                    radius={[4, 4, 4, 4]} 
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weight Trend Chart */}
                <div className="bg-dark-800 p-6 rounded-3xl border border-dark-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Weight Trend</h3>
                        <span className="text-xs text-gray-500 bg-dark-900 px-2 py-1 rounded-lg">Last 30 Days</span>
                    </div>
                    <div className="h-48 w-full min-h-[192px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weightTrendData}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="week" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                                    dy={10}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F222A', border: 'none', borderRadius: '8px' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="weight" 
                                    stroke="#3b82f6" 
                                    fillOpacity={1} 
                                    fill="url(#colorWeight)" 
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Insights;
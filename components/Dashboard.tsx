import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { MealLog } from '../types';
import { 
  Plus, 
  Camera, 
  Flame, 
  Footprints, 
  Timer, 
  ChevronRight,
  Dumbbell,
  Utensils
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    onStartScan: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartScan }) => {
    const [logs, setLogs] = useState<MealLog[]>([]);
    const [dailyGoal, setDailyGoal] = useState<number>(2000);
    const [userProfile, setUserProfile] = useState<any>(null);

    // Mock Data for production-ready look (since backend might not have this data yet)
    const macros = {
        protein: { current: 85, target: 140, color: '#C2F558' }, // Brand Green
        carbs: { current: 120, target: 250, color: '#3b82f6' },  // Blue
        fat: { current: 45, target: 70, color: '#f97316' }       // Orange
    };

    const activity = {
        steps: 6432,
        caloriesBurned: 320,
        activeMinutes: 45
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // 1. Get User Settings
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserProfile(user.user_metadata);
            if (user.user_metadata?.daily_calorie_goal) {
                setDailyGoal(parseInt(user.user_metadata.daily_calorie_goal));
            }
        }

        // 2. Get Today's Logs
        // For demo purposes, fetching recent logs. In real app, filter by date.
        const { data } = await supabase
            .from('food_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (data) setLogs(data);
    };

    // Calculate totals
    const consumedCalories = logs.reduce((acc, log) => {
        const isToday = new Date(log.created_at).toDateString() === new Date().toDateString();
        return isToday ? acc + log.total_calories : acc;
    }, 0);

    const remainingCalories = Math.max(0, dailyGoal - consumedCalories);
    
    // Group logs by time for the Food Log section
    const groupedLogs = {
        Breakfast: logs.filter(l => {
            const h = new Date(l.created_at).getHours();
            return h >= 5 && h < 11;
        }),
        Lunch: logs.filter(l => {
            const h = new Date(l.created_at).getHours();
            return h >= 11 && h < 16;
        }),
        Dinner: logs.filter(l => {
            const h = new Date(l.created_at).getHours();
            return h >= 16 && h < 22;
        }),
        Snacks: logs.filter(l => {
            const h = new Date(l.created_at).getHours();
            return h >= 22 || h < 5;
        })
    };

    // Ring Chart Data
    const ringData = [
        { name: 'Consumed', value: consumedCalories },
        { name: 'Remaining', value: remainingCalories }
    ];
    const ringColors = ['#C2F558', '#35383F']; // Brand Green, Dark Gray

    return (
        <div className="min-h-screen bg-dark-900 text-white pb-24">
            
            {/* 1. HEADER */}
            <header className="flex justify-between items-center px-6 pt-6 pb-2 bg-dark-900 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="ANNA" className="w-8 h-8 rounded-lg bg-white/10 p-0.5" />
                    <span className="text-xl font-bold tracking-widest">ANNA</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center overflow-hidden">
                    {/* Placeholder Avatar */}
                    <div className="w-full h-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-dark-900">
                        {userProfile?.full_name?.[0] || 'U'}
                    </div>
                </div>
            </header>

            <div className="px-6 space-y-8 mt-4">

                {/* 2. CALORIE RING SUMMARY */}
                <div className="bg-dark-800 rounded-3xl p-6 shadow-lg border border-dark-700 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="relative w-32 h-32 min-w-[128px] min-h-[128px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ringData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={60}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={10}
                                    >
                                        {ringData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={ringColors[index % ringColors.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Icon */}
                            <div className="absolute inset-0 flex items-center justify-center text-brand-500">
                                <Flame size={24} fill="currentColor" />
                            </div>
                        </div>

                        <div className="flex-1 pl-6">
                            <h3 className="text-gray-400 text-sm font-medium mb-1">Calories Remaining</h3>
                            <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                                {remainingCalories}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                                <span className="text-brand-500 font-bold">{consumedCalories}</span> / {dailyGoal} kcal
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MACRO TRACKING */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        Nutrition <span className="text-xs font-normal text-gray-500 bg-dark-800 px-2 py-1 rounded-full">Today</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Protein', ...macros.protein },
                            { label: 'Carbs', ...macros.carbs },
                            { label: 'Fat', ...macros.fat },
                        ].map((m) => (
                            <div key={m.label} className="bg-dark-800 p-4 rounded-2xl border border-dark-700">
                                <div className="text-gray-400 text-xs font-medium mb-2">{m.label}</div>
                                <div className="text-xl font-bold mb-3">{m.current}g</div>
                                <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${(m.current / m.target) * 100}%`, backgroundColor: m.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. ACTIVITY TRACKER */}
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-lg font-bold">Activity</h3>
                        <span className="text-brand-500 text-sm font-medium cursor-pointer">Sync Device</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-dark-800 p-3 rounded-2xl border border-dark-700 flex flex-col items-center text-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
                                <Footprints size={16} />
                            </div>
                            <span className="text-lg font-bold">{activity.steps}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Steps</span>
                        </div>
                        <div className="bg-dark-800 p-3 rounded-2xl border border-dark-700 flex flex-col items-center text-center">
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-2">
                                <Flame size={16} />
                            </div>
                            <span className="text-lg font-bold">{activity.caloriesBurned}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Kcal</span>
                        </div>
                        <div className="bg-dark-800 p-3 rounded-2xl border border-dark-700 flex flex-col items-center text-center">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2">
                                <Timer size={16} />
                            </div>
                            <span className="text-lg font-bold">{activity.activeMinutes}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Mins</span>
                        </div>
                    </div>
                </div>

                {/* 5. ACTION MENU */}
                <div className="grid grid-cols-12 gap-3">
                    <button 
                        onClick={onStartScan}
                        className="col-span-8 bg-brand-500 hover:bg-brand-400 text-dark-900 rounded-2xl p-4 flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(194,245,88,0.2)] group"
                    >
                        <div className="bg-dark-900/10 p-2 rounded-full group-hover:scale-110 transition-transform">
                            <Camera size={24} />
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-lg leading-none">Scan Food</span>
                            <span className="text-xs font-medium opacity-70">AI Camera</span>
                        </div>
                    </button>
                    
                    <button className="col-span-4 bg-dark-800 border border-dark-700 hover:bg-dark-700 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-1 transition-colors">
                        <Plus size={24} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-400">Add Meal</span>
                    </button>
                    
                    {/* Log Activity button usually less prominent in this layout, maybe consolidated or extra action */}
                </div>

                {/* 6. TODAY'S FOOD LOG */}
                <div className="pb-8">
                    <h3 className="text-lg font-bold mb-4">Today's Meals</h3>
                    <div className="space-y-6">
                        {Object.entries(groupedLogs).map(([mealType, mealLogs]) => (
                            <div key={mealType}>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 pl-1 flex items-center gap-2">
                                    {mealType}
                                    <div className="h-px flex-1 bg-dark-800"></div>
                                </h4>
                                {mealLogs.length === 0 ? (
                                    <div className="border border-dashed border-dark-700 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-600">No {mealType.toLowerCase()} logged</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {mealLogs.map(log => (
                                            <div key={log.id} className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-dark-900 rounded-lg overflow-hidden flex-shrink-0">
                                                    {log.image_url ? (
                                                        <img src={log.image_url} alt="Meal" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                            <Utensils size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-bold text-white truncate">
                                                        {log.items?.map(i => i.name).join(', ') || 'Unknown Meal'}
                                                    </h5>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {Math.round(log.total_calories / 4)}g protein
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block font-bold text-brand-500">{log.total_calories}</span>
                                                    <span className="text-xs text-gray-500">kcal</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { MealLog } from '../types';
import { 
  Plus, 
  Flame, 
  Footprints, 
  ChevronRight,
  ChevronLeft,
  Bell,
  Utensils,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface DashboardProps {
    onStartScan: () => void;
}

interface MealSection {
    id: string;
    label: string;
    icon: React.ElementType;
    target: number;
    range: number[];
}

const mealSections: MealSection[] = [
    { id: 'breakfast', label: 'Breakfast', icon: Sun, target: 600, range: [5, 11] },
    { id: 'lunch', label: 'Lunch', icon: Utensils, target: 800, range: [11, 16] },
    { id: 'dinner', label: 'Dinner', icon: Moon, target: 800, range: [16, 22] },
    { id: 'snack', label: 'Snacks', icon: Coffee, target: 200, range: [22, 5] }, 
];

const MacroItem = ({ label, current, target, color }: { label: string, current: number, target: number, color: string }) => (
    <div className="flex flex-col items-center">
        <div className="relative w-12 h-12 mb-1 flex items-center justify-center">
            {/* Simple SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#35383F" strokeWidth="4" fill="none" />
                <circle 
                    cx="24" cy="24" r="20" 
                    stroke={color} 
                    strokeWidth="4" 
                    fill="none" 
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - Math.min(current / target, 1))}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute text-[10px] font-bold text-white">{current}g</span>
        </div>
        <span className="text-xs text-gray-400">{label}</span>
    </div>
);

interface MealCardProps {
    section: MealSection;
    current: number;
    onAdd: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ section, current, onAdd }) => {
    const Icon = section.icon;
    
    return (
        <div className="bg-dark-800 rounded-3xl p-4 flex items-center gap-4 mb-3 border border-dark-700">
            <div className="w-12 h-12 rounded-full bg-dark-700/50 flex items-center justify-center text-gray-400">
                <Icon size={20} />
            </div>
            
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-white">{section.label}</h4>
                    <div className="flex items-center gap-1">
                        <span className="text-brand-500 font-bold">{current}</span>
                        <span className="text-xs text-gray-500">/ {section.target} kcal</span>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-dark-900 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${Math.min((current / section.target) * 100, 100)}%` }}
                    />
                </div>
            </div>

            <button 
                onClick={onAdd}
                className="w-8 h-8 rounded-full border-2 border-brand-500 flex items-center justify-center text-brand-500 hover:bg-brand-500 hover:text-dark-900 transition-colors"
            >
                <Plus size={16} strokeWidth={3} />
            </button>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ onStartScan }) => {
    const [logs, setLogs] = useState<MealLog[]>([]);
    const [dailyGoal, setDailyGoal] = useState<number>(2000);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock Data for "Burned" and "Macros" since we don't have full backend logic for them yet
    const activityData = {
        burned: 265,
        walking: 100, // kcal
        exercise: 165 // kcal
    };

    const macroGoals = {
        carbs: 250,
        protein: 140,
        fat: 90
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserProfile(user.user_metadata);
            if (user.user_metadata?.daily_calorie_goal) {
                setDailyGoal(parseInt(user.user_metadata.daily_calorie_goal));
            }
        }

        const { data } = await supabase
            .from('food_logs')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (data) setLogs(data);
    };

    // --- Calculations ---

    const getDailyLogs = (date: Date) => {
        return logs.filter(log => new Date(log.created_at).toDateString() === date.toDateString());
    };

    const todaysLogs = getDailyLogs(currentDate);

    const consumedCalories = todaysLogs.reduce((acc, log) => acc + log.total_calories, 0);
    const remainingCalories = Math.max(0, dailyGoal - consumedCalories + activityData.burned);
    
    // Mock macro calculation based on calories (4-4-9 rule approx distribution for demo)
    const currentMacros = {
        carbs: Math.round(consumedCalories * 0.5 / 4),
        protein: Math.round(consumedCalories * 0.3 / 4),
        fat: Math.round(consumedCalories * 0.2 / 9)
    };

    const getMealCalories = (range: number[]) => {
        const [start, end] = range;
        return todaysLogs.filter(l => {
            const h = new Date(l.created_at).getHours();
            if (start > end) return h >= start || h < end; // overnight
            return h >= start && h < end;
        }).reduce((acc, l) => acc + l.total_calories, 0);
    };

    // Ring Chart Data
    const totalBudget = dailyGoal + activityData.burned;
    const chartData = [
        { name: 'Remaining', value: remainingCalories, color: '#C2F558' }, // Brand Green
        { name: 'Consumed', value: consumedCalories, color: '#35383F' }   // Dark Gray track
    ];

    return (
        <div className="min-h-screen bg-dark-900 text-white pb-24">
            
            {/* 1. Top Bar */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-dark-900 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border border-gray-600">
                        <img 
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-sm text-gray-400">Welcome Back,</h2>
                        <h1 className="text-lg font-bold text-white leading-none">{userProfile?.name?.split(' ')[0] || 'Andrew'}</h1>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-dark-700 flex items-center justify-center text-white relative">
                    <Bell size={20} />
                    <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-dark-900"></div>
                </div>
            </div>

            {/* 2. Date Navigation */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <button 
                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}
                    className="p-1 text-gray-500 hover:text-white"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2 text-white font-medium">
                    <span className="text-brand-500 px-1">Today,</span> 
                    {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <button 
                    onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}
                    className="p-1 text-gray-500 hover:text-white"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* 3. Main Calorie Card */}
            <div className="px-6 mb-6">
                <div className="bg-dark-800 rounded-[32px] p-6 relative overflow-hidden shadow-2xl border border-dark-700">
                    
                    {/* Main Stats Row */}
                    <div className="flex items-center justify-between mb-8">
                        {/* Eaten */}
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div> Eaten
                            </div>
                            <div className="text-2xl font-bold text-white">{consumedCalories}</div>
                            <div className="text-xs text-gray-500">kcal</div>
                        </div>

                        {/* Center Ring */}
                        <div className="relative w-40 h-40">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={75}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={0}
                                    >
                                        <Cell fill="#C2F558" /> {/* Remaining */}
                                        <Cell fill="#35383F" /> {/* Consumed/Track */}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-white">{remainingCalories}</span>
                                <span className="text-xs text-gray-400 font-medium">kcal left</span>
                            </div>
                        </div>

                        {/* Burned */}
                        <div className="text-center">
                             <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Burned
                            </div>
                            <div className="text-2xl font-bold text-white">{activityData.burned}</div>
                            <div className="text-xs text-gray-500">kcal</div>
                        </div>
                    </div>

                    {/* Macros Row */}
                    <div className="grid grid-cols-3 gap-4 border-t border-dark-700 pt-6">
                        <MacroItem label="Carbs" current={currentMacros.carbs} target={macroGoals.carbs} color="#C2F558" />
                        <MacroItem label="Protein" current={currentMacros.protein} target={macroGoals.protein} color="#3b82f6" />
                        <MacroItem label="Fat" current={currentMacros.fat} target={macroGoals.fat} color="#f97316" />
                    </div>
                </div>
            </div>

            {/* 4. Activity Cards */}
            <div className="px-6 mb-8">
                <div className="flex gap-4">
                     {/* Walking */}
                    <div className="flex-1 bg-dark-800 rounded-3xl p-4 flex items-center gap-4 border border-dark-700">
                        <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
                            <Footprints size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Walking</p>
                            <p className="text-lg font-bold text-white">{activityData.walking} <span className="text-xs font-normal text-gray-500">kcal</span></p>
                        </div>
                    </div>
                    {/* General Activity */}
                    <div className="flex-1 bg-dark-800 rounded-3xl p-4 flex items-center gap-4 border border-dark-700 relative">
                         <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                            <Flame size={20} />
                        </div>
                         <div>
                            <p className="text-xs text-gray-400 mb-0.5">Activity</p>
                            <p className="text-lg font-bold text-white">{activityData.exercise} <span className="text-xs font-normal text-gray-500">kcal</span></p>
                        </div>
                        {/* Plus Button Overlay */}
                         <button className="absolute -top-2 -right-2 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-dark-900 border-4 border-dark-900">
                            <Plus size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 5. Meal List */}
            <div className="px-6">
                 {mealSections.map((section) => (
                    <MealCard 
                        key={section.id} 
                        section={section} 
                        current={getMealCalories(section.range)}
                        onAdd={onStartScan}
                    />
                 ))}
            </div>

        </div>
    );
};

export default Dashboard;
import React from 'react';
import { User, Settings, Crown, ChevronRight, Bell, Shield, HelpCircle, LogOut, Moon } from 'lucide-react';

interface AccountProps {
    onSignOut: () => void;
    userEmail?: string;
}

const Account: React.FC<AccountProps> = ({ onSignOut, userEmail }) => {
    
    const SettingItem = ({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) => (
        <button className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors">
            <div className="flex items-center gap-4">
                <Icon size={20} className="text-gray-400" />
                <span className="text-white font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-sm text-gray-500">{value}</span>}
                <ChevronRight size={16} className="text-gray-600" />
            </div>
        </button>
    );

    return (
        <div className="min-h-screen bg-dark-900 text-white pb-24 pt-6">
            <h1 className="text-2xl font-bold mb-6 px-6">Account</h1>

            {/* 1. Profile Header */}
            <div className="px-6 mb-8 flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-dark-900 text-2xl font-bold border-4 border-dark-800">
                    {userEmail ? userEmail[0].toUpperCase() : 'U'}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">My Profile</h2>
                    <p className="text-sm text-gray-400">{userEmail || 'user@example.com'}</p>
                    <button className="text-xs text-brand-500 font-bold mt-1 hover:underline">Edit Profile</button>
                </div>
            </div>

            {/* 2. Premium Section */}
            <div className="px-6 mb-8">
                <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-900/20 border border-yellow-500/30 rounded-3xl p-6 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Crown size={120} className="text-yellow-500 transform rotate-12" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Crown size={20} className="text-yellow-400 fill-yellow-400" />
                            <h3 className="font-bold text-yellow-100 text-lg">ANNA Premium</h3>
                        </div>
                        <p className="text-sm text-yellow-200/80 mb-6 max-w-[80%]">
                            Unlock unlimited AI scans, advanced macro insights, and personalized meal plans.
                        </p>
                        <button className="bg-yellow-500 text-dark-900 font-bold py-3 px-6 rounded-xl text-sm w-full hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-900/20">
                            Upgrade to Premium
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Settings List */}
            <div className="bg-dark-800 mx-4 rounded-2xl overflow-hidden border border-dark-700">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 bg-dark-800/50">Preferences</h3>
                <div className="divide-y divide-dark-700">
                    <SettingItem icon={User} label="Daily Goals" value="2000 kcal" />
                    <SettingItem icon={Settings} label="Units" value="kg, cm" />
                    <SettingItem icon={Moon} label="Appearance" value="Dark Mode" />
                    <SettingItem icon={Bell} label="Notifications" />
                </div>
            </div>

            <div className="bg-dark-800 mx-4 rounded-2xl overflow-hidden border border-dark-700 mt-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 bg-dark-800/50">Support</h3>
                <div className="divide-y divide-dark-700">
                    <SettingItem icon={Shield} label="Privacy & Data" />
                    <SettingItem icon={HelpCircle} label="Help & Support" />
                </div>
            </div>

            <div className="px-4 mt-8">
                <button 
                    onClick={onSignOut}
                    className="w-full flex items-center justify-center gap-2 text-red-500 font-medium py-4 rounded-2xl border border-dark-700 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
                <p className="text-center text-xs text-gray-600 mt-6">ANNA v1.0.2 • Build 428</p>
            </div>
        </div>
    );
};

export default Account;
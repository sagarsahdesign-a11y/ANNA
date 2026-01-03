import React, { useState } from 'react';
import { User, Settings, Crown, ChevronRight, Bell, Shield, HelpCircle, LogOut, Moon, Activity, Droplets, Footprints, Scale, CreditCard, Lock, Globe, FileText, Star, Eye } from 'lucide-react';
import Premium from './Premium';
import SettingsView from './SettingsView';

interface AccountProps {
    onSignOut: () => void;
    userEmail?: string;
}

const Account: React.FC<AccountProps> = ({ onSignOut, userEmail }) => {
    const [view, setView] = useState<'MAIN' | 'PREMIUM' | 'SETTINGS'>('MAIN');
    const [settingsType, setSettingsType] = useState<string>('');

    const navigateToSettings = (type: string) => {
        setSettingsType(type);
        setView('SETTINGS');
    };

    const MenuItem = ({ icon: Icon, label, value, onClick, isDanger }: { icon: any, label: string, value?: string, onClick?: () => void, isDanger?: boolean }) => (
        <button 
            onClick={onClick} 
            className={`w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors ${isDanger ? 'text-red-500 hover:bg-red-500/10' : 'text-white'}`}
        >
            <div className="flex items-center gap-4">
                <Icon size={20} className={isDanger ? 'text-red-500' : 'text-gray-400'} />
                <span className="font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-sm text-gray-500">{value}</span>}
                {!isDanger && <ChevronRight size={18} className="text-gray-600" />}
            </div>
        </button>
    );

    // --- RENDER SUB-VIEWS ---

    if (view === 'PREMIUM') {
        return <Premium onBack={() => setView('MAIN')} />;
    }

    if (view === 'SETTINGS') {
        return <SettingsView type={settingsType} onBack={() => setView('MAIN')} />;
    }

    // --- MAIN ACCOUNT VIEW ---

    return (
        <div className="min-h-screen bg-dark-900 text-white pb-24 pt-6">
            <h1 className="text-2xl font-bold mb-6 px-6">Account</h1>

            {/* 1. Profile Header */}
            <div className="px-6 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-dark-900 text-xl font-bold border-2 border-brand-500 relative">
                        <img 
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-brand-500 border-2 border-dark-900 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-dark-900 rounded-full"></div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Andrew Ainsley</h2>
                        <p className="text-xs text-gray-400">{userEmail || 'andrew.ainsley@yourdomain.com'}</p>
                    </div>
                </div>
                <button onClick={() => navigateToSettings('PERSONAL_INFO')} className="p-2 hover:bg-dark-800 rounded-full">
                     <Settings size={20} className="text-white" />
                </button>
            </div>

            {/* 2. Premium Banner */}
            <div className="px-6 mb-8">
                <button 
                    onClick={() => setView('PREMIUM')}
                    className="w-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-3xl p-4 flex items-center justify-between shadow-lg shadow-brand-500/10 group transition-transform hover:scale-[1.02]"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-dark-900 backdrop-blur-sm">
                            <Crown size={20} fill="currentColor" />
                        </div>
                        <div className="text-left text-dark-900">
                            <h3 className="font-bold text-sm">Upgrade Plan Now!</h3>
                            <p className="text-xs font-medium opacity-80">Enjoy all the benefits and explore more possibilities</p>
                        </div>
                    </div>
                    <ChevronRight className="text-dark-900" />
                </button>
            </div>

            {/* 3. Trackers Section */}
            <div className="bg-dark-800 mx-4 rounded-3xl overflow-hidden border border-dark-700 mb-6">
                <div className="divide-y divide-dark-700">
                    <MenuItem icon={Activity} label="Calorie Counter" onClick={() => navigateToSettings('CALORIE_COUNTER')} />
                    <MenuItem icon={Droplets} label="Water Tracker" onClick={() => navigateToSettings('WATER_TRACKER')} />
                    <MenuItem icon={Footprints} label="Step Counter" onClick={() => navigateToSettings('STEP_COUNTER')} />
                    <MenuItem icon={Scale} label="Weight Tracker" onClick={() => navigateToSettings('WEIGHT_TRACKER')} />
                    <MenuItem icon={Settings} label="Preferences" onClick={() => navigateToSettings('PREFERENCES')} />
                </div>
            </div>

            {/* 4. General Settings Section */}
            <div className="bg-dark-800 mx-4 rounded-3xl overflow-hidden border border-dark-700 mb-6">
                <div className="divide-y divide-dark-700">
                    <MenuItem icon={Bell} label="Notification" onClick={() => navigateToSettings('NOTIFICATIONS')} />
                    <MenuItem icon={CreditCard} label="Payment Methods" onClick={() => navigateToSettings('PAYMENT_METHODS')} />
                    <MenuItem icon={FileText} label="Billing & Subscriptions" onClick={() => navigateToSettings('BILLING')} />
                    <MenuItem icon={Lock} label="Account & Security" onClick={() => navigateToSettings('SECURITY')} />
                    <MenuItem icon={Globe} label="Linked Accounts" onClick={() => navigateToSettings('LINKED_ACCOUNTS')} />
                    <MenuItem icon={Eye} label="App Appearance" onClick={() => navigateToSettings('APPEARANCE')} />
                    <MenuItem icon={Activity} label="Data & Analytics" onClick={() => navigateToSettings('DATA_ANALYTICS')} />
                    <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => navigateToSettings('HELP')} />
                    <MenuItem icon={Star} label="Rate us" />
                </div>
            </div>

            {/* 5. Logout */}
            <div className="mx-4 mb-8">
                <button 
                    onClick={onSignOut}
                    className="w-full flex items-center justify-center gap-2 text-red-500 font-bold text-sm py-4 rounded-3xl bg-dark-800/50 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Account;
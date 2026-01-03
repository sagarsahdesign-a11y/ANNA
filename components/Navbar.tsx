import React from 'react';
import { LayoutDashboard, ScanLine, BarChart2, User, Activity } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  onNavigate: (view: AppView) => void;
  currentView: string;
  onSignOut: () => void;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onNavigate(view)}
        className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
          isActive ? 'text-brand-500' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-900 border-t border-dark-800 pb-safe-bottom">
      <div className="flex justify-between items-center h-16 max-w-lg mx-auto px-2">
        <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Home" />
        <NavItem view="TRACKER" icon={Activity} label="Tracker" />
        
        {/* Central Scan Button */}
        <div className="relative -top-5">
            <button
                onClick={() => onNavigate('CAMERA')}
                className="w-14 h-14 rounded-full bg-brand-500 text-dark-900 flex items-center justify-center shadow-[0_0_20px_rgba(194,245,88,0.4)] border-4 border-dark-900 transition-transform active:scale-95"
            >
                <ScanLine size={24} strokeWidth={2.5} />
            </button>
        </div>

        <NavItem view="INSIGHTS" icon={BarChart2} label="Insights" />
        <NavItem view="ACCOUNT" icon={User} label="Account" />
      </div>
    </nav>
  );
};

export default Navbar;
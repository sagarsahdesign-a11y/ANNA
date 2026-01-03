import React, { useState, useRef } from 'react';
import { ArrowLeft, ChevronRight, User, Globe, Mail, Phone, Calendar, Lock, Smartphone, Eye, EyeOff, Plus, Trash2, Moon, Bell, Shield, FileText, HelpCircle, LogOut, Camera } from 'lucide-react';

interface SettingsViewProps {
    type: string;
    onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ type, onBack }) => {
    // --- State for Personal Info ---
    const [personalInfo, setPersonalInfo] = useState({
        name: 'Andrew Ainsley',
        email: 'andrew.ainsley@yourdomain.com',
        phone: '+1 (646) 555-4099',
        dob: '12-25-1995',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Handlers ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPersonalInfo(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // In a real app, this would make an API call to save data
        alert("Profile Updated Successfully!");
        onBack();
    };

    // --- Sub-Components ---
    const ToggleItem = ({ label, checked, onChange }: { label: string, checked: boolean, onChange?: () => void }) => (
        <div className="flex items-center justify-between py-4 border-b border-dark-700 last:border-0">
            <span className="text-white font-medium">{label}</span>
            <button 
                onClick={onChange}
                className={`w-12 h-7 rounded-full relative transition-colors ${checked ? 'bg-brand-500' : 'bg-dark-600'}`}
            >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${checked ? 'left-6' : 'left-1'}`} />
            </button>
        </div>
    );

    const LinkItem = ({ label, value, onClick }: { label: string, value?: string, onClick?: () => void }) => (
        <button onClick={onClick} className="w-full flex items-center justify-between py-4 border-b border-dark-700 last:border-0 hover:bg-dark-800/50 transition-colors">
             <span className="text-white font-medium">{label}</span>
             <div className="flex items-center gap-2">
                 {value && <span className="text-sm text-gray-500">{value}</span>}
                 <ChevronRight size={18} className="text-gray-500" />
             </div>
        </button>
    );

    const Section = ({ title, children }: { title?: string, children?: React.ReactNode }) => (
        <div className="bg-dark-800 rounded-3xl p-5 mb-6 border border-dark-700">
            {title && <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>}
            <div>{children}</div>
        </div>
    );

    const Header = ({ title }: { title: string }) => (
        <div className="flex items-center gap-4 mb-6 sticky top-0 bg-dark-900 py-4 z-10 border-b border-dark-800">
             <button onClick={onBack} className="p-2 -ml-2 hover:bg-dark-800 rounded-full text-white">
                <ArrowLeft size={24} />
             </button>
             <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
    );

    // --- Specific Views ---

    if (type === 'PERSONAL_INFO') {
        return (
            <div className="min-h-screen bg-dark-900 px-6 pt-2 pb-24 text-white">
                <Header title="Personal Info" />
                <div className="flex justify-center mb-8">
                     <div className="w-24 h-24 rounded-full bg-dark-800 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <img src={personalInfo.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-dark-800" />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={24} className="text-white" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-brand-500 p-2 rounded-xl border-4 border-dark-900 z-10">
                            <div className="w-3 h-3 bg-white mask-icon-edit" /> 
                            <svg className="w-4 h-4 text-dark-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                     </div>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Full Name</label>
                        <input 
                            type="text" 
                            value={personalInfo.name} 
                            onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                            className="w-full bg-dark-800 border-none rounded-2xl p-4 text-white font-medium focus:ring-1 focus:ring-brand-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-4 text-gray-500" size={20} />
                            <input 
                                type="email" 
                                value={personalInfo.email} 
                                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                                className="w-full bg-dark-800 border-none rounded-2xl p-4 pl-12 text-white font-medium focus:ring-1 focus:ring-brand-500" 
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Phone Number</label>
                        <div className="relative">
                            <div className="absolute left-4 top-4 flex items-center gap-2 border-r border-gray-600 pr-3 mr-3">
                                <img src="https://flagcdn.com/w20/us.png" className="w-5 rounded-sm" alt="US" />
                            </div>
                            <input 
                                type="tel" 
                                value={personalInfo.phone} 
                                onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                                className="w-full bg-dark-800 border-none rounded-2xl p-4 pl-20 text-white font-medium focus:ring-1 focus:ring-brand-500" 
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute right-4 top-4 text-gray-500" size={20} />
                            <input 
                                type="text" 
                                value={personalInfo.dob} 
                                onChange={(e) => setPersonalInfo({...personalInfo, dob: e.target.value})}
                                className="w-full bg-dark-800 border-none rounded-2xl p-4 text-white font-medium focus:ring-1 focus:ring-brand-500" 
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full mt-12 py-4 rounded-full bg-brand-500 text-dark-900 font-bold hover:bg-brand-400 transition-colors shadow-lg">
                        Save Changes
                    </button>
                </form>
            </div>
        );
    }

    if (type === 'NOTIFICATIONS') {
         return (
            <div className="min-h-screen bg-dark-900 px-6 pt-2 pb-24 text-white">
                <Header title="Notification" />
                <Section title="Common">
                    <ToggleItem label="General Notifications" checked={true} />
                    <ToggleItem label="Security Alerts" checked={true} />
                    <ToggleItem label="Weekly Progress Summary" checked={true} />
                    <ToggleItem label="Goal Achievement" checked={true} />
                    <ToggleItem label="Milestone Celebrations" checked={false} />
                </Section>
                <Section title="System & Services">
                    <ToggleItem label="Health Tips & Article" checked={false} />
                    <ToggleItem label="Subscription & Alerts" checked={true} />
                    <ToggleItem label="App Tips and Tutorials" checked={false} />
                </Section>
            </div>
         );
    }

    if (type === 'SECURITY') {
         return (
            <div className="min-h-screen bg-dark-900 px-6 pt-2 pb-24 text-white">
                <Header title="Account & Security" />
                
                <Section title="Biometric Security">
                    <ToggleItem label="Biometric ID" checked={true} />
                    <ToggleItem label="Face ID" checked={true} />
                </Section>

                <Section title="Two-Factor Authentication">
                    <ToggleItem label="Enable 2FA" checked={true} />
                    <LinkItem label="Link Phone Number" value="+1 (646) 555-4099" />
                    <LinkItem label="Link Authenticator App" value="Not Linked" />
                    <div className="h-px bg-dark-700 my-2" />
                    <ToggleItem label="SMS Authenticator" checked={true} />
                    <ToggleItem label="Google Authenticator" checked={false} />
                </Section>

                <Section title="Account Access">
                    <LinkItem label="Change Password" />
                    <LinkItem label="Device Management" />
                    <LinkItem label="Deactivate Account" />
                    <button className="w-full text-left py-4 text-red-500 font-medium hover:bg-dark-800/50 transition-colors">Delete Account</button>
                </Section>
            </div>
         );
    }

    if (type === 'PAYMENT_METHODS') {
        const [showAdd, setShowAdd] = useState(false);

        if (showAdd) {
            return (
                 <div className="min-h-screen bg-dark-900 px-6 pt-2 pb-24 text-white">
                    <div className="flex items-center justify-between mb-6 sticky top-0 bg-dark-900 py-4 z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setShowAdd(false)} className="p-2 -ml-2 hover:bg-dark-800 rounded-full text-white">
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-xl font-bold text-white">Add New Payment</h1>
                        </div>
                        <button className="p-2"><Plus size={24} /></button>
                    </div>

                    <div className="bg-gradient-to-br from-brand-600 to-brand-400 rounded-3xl p-6 mb-8 h-48 relative overflow-hidden shadow-xl">
                        <div className="absolute top-6 right-6 italic font-bold text-2xl text-white/50">VISA</div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <p className="text-xs opacity-75 mb-1">Card Holder Name</p>
                            <p className="font-bold tracking-wider">Andrew Ainsley</p>
                        </div>
                         <div className="absolute top-1/2 left-6 text-white text-xl font-mono tracking-[0.2em] transform -translate-y-1/2">
                            •••• •••• •••• ••••
                        </div>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-dark-800 border-none rounded-2xl p-4 text-white font-mono focus:ring-1 focus:ring-brand-500" />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Account Holder Name</label>
                            <input type="text" defaultValue="Andrew Ainsley" className="w-full bg-dark-800 border-none rounded-2xl p-4 text-white focus:ring-1 focus:ring-brand-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Expiry Date</label>
                                <input type="text" placeholder="MM/YY" className="w-full bg-dark-800 border-none rounded-2xl p-4 text-white focus:ring-1 focus:ring-brand-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">CVV</label>
                                <input type="text" placeholder="123" className="w-full bg-dark-800 border-none rounded-2xl p-4 text-white focus:ring-1 focus:ring-brand-500" />
                            </div>
                        </div>
                    </form>

                    <button className="w-full mt-12 py-4 rounded-full bg-brand-500 text-dark-900 font-bold hover:bg-brand-400 transition-colors shadow-lg">
                        Add New Payment Method
                    </button>
                 </div>
            );
        }

        return (
             <div className="min-h-screen bg-dark-900 px-6 pt-2 pb-24 text-white">
                <Header title="Payment Methods" />
                <div className="space-y-4">
                    {[
                        { id: 'paypal', name: 'PayPal', icon: 'https://www.svgrepo.com/show/349472/paypal.svg', linked: true },
                        { id: 'google', name: 'Google Pay', icon: 'https://www.svgrepo.com/show/475656/google-color.svg', linked: true },
                        { id: 'apple', name: 'Apple Pay', icon: 'https://www.svgrepo.com/show/509536/apple-pay.svg', linked: true, invert: true },
                        { id: 'mastercard', name: 'Mastercard •••• 4679', icon: 'https://www.svgrepo.com/show/362013/mastercard.svg', linked: true },
                    ].map((m) => (
                        <div key={m.id} className="bg-dark-800 p-4 rounded-2xl flex items-center justify-between border border-dark-700">
                             <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2`}>
                                    <img src={m.icon} alt={m.name} className="w-full h-full object-contain" />
                                </div>
                                <span className="font-bold text-white">{m.name}</span>
                            </div>
                            <span className="text-brand-500 text-sm font-bold">Linked</span>
                        </div>
                    ))}
                </div>
                
                <button 
                    onClick={() => setShowAdd(true)}
                    className="w-full mt-8 py-4 rounded-full bg-brand-500 text-dark-900 font-bold hover:bg-brand-400 transition-colors shadow-lg"
                >
                    Add New Payment
                </button>
             </div>
        );
    }

    if (type === 'HELP') {
        return (
             <div className="min-h-screen bg-dark-900 px-6 pt-2 pb-24 text-white">
                <Header title="Help & Support" />
                <Section>
                    <LinkItem label="FAQ" />
                    <LinkItem label="Contact Support" />
                    <LinkItem label="Privacy Policy" />
                    <LinkItem label="Terms of Service" />
                    <LinkItem label="Partner" />
                    <LinkItem label="Job Vacancy" />
                    <LinkItem label="Accessibility" />
                    <LinkItem label="Feedback" />
                    <LinkItem label="About us" />
                </Section>
             </div>
        );
    }

    if (type === 'CALORIE_COUNTER' || type === 'WATER_TRACKER' || type === 'STEP_COUNTER' || type === 'WEIGHT_TRACKER') {
        const titleMap: Record<string, string> = {
            'CALORIE_COUNTER': 'Calorie Counter',
            'WATER_TRACKER': 'Water Tracker',
            'STEP_COUNTER': 'Step Counter',
            'WEIGHT_TRACKER': 'Weight Tracker'
        };
        return (
             <div className="min-h-screen bg-dark-900 px-6 pt-2 pb-24 text-white">
                <Header title={titleMap[type]} />
                <Section>
                    <LinkItem label="Daily Goal" value={type === 'WATER_TRACKER' ? '2500 ml' : '2000 kcal'} />
                    <LinkItem label="Units" value={type === 'WATER_TRACKER' ? 'ml' : 'kcal'} />
                </Section>
                <Section title="Reminders">
                    <ToggleItem label="Reminder Enabled" checked={true} />
                    <LinkItem label="Reminder Time" value="08:00 AM" />
                    <LinkItem label="Repeat" value="Everyday" />
                </Section>
             </div>
        );
    }

    // Default Fallback for other sections
    return (
        <div className="min-h-screen bg-dark-900 px-6 pt-2 pb-24 text-white">
             <Header title={type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')} />
             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>Settings for {type} coming soon.</p>
             </div>
        </div>
    );
};

export default SettingsView;
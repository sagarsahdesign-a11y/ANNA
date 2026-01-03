import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import Logo from './Logo';

interface PremiumProps {
    onBack: () => void;
}

type Step = 'PLAN' | 'PAYMENT' | 'REVIEW' | 'PROCESSING' | 'SUCCESS';

const Premium: React.FC<PremiumProps> = ({ onBack }) => {
    const [step, setStep] = useState<Step>('PLAN');
    const [plan, setPlan] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');
    const [paymentMethod, setPaymentMethod] = useState('mastercard');
    
    // Simulate processing delay
    useEffect(() => {
        if (step === 'PROCESSING') {
            const timer = setTimeout(() => {
                setStep('SUCCESS');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const features = [
        "Ad-free experience.",
        "Advanced calorie tracking.",
        "Activity & exercise logging.",
        "Detailed progress insights.",
        "Exclusive early access.",
        "Priority customer support."
    ];

    // --- RENDER STEPS ---

    if (step === 'SUCCESS') {
        return (
            <div className="fixed inset-0 z-50 bg-dark-900 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="w-32 h-32 mb-8 relative">
                    <div className="absolute inset-0 bg-brand-500 rounded-full opacity-20 animate-ping"></div>
                    <div className="relative w-full h-full bg-brand-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(194,245,88,0.5)]">
                        <div className="bg-white p-4 rounded-full">
                            <Logo className="w-12 h-12" />
                        </div>
                    </div>
                    {/* Confetti decoration could go here */}
                </div>

                <h2 className="text-3xl font-bold text-brand-500 mb-2">Congratulations!</h2>
                <p className="text-gray-300 mb-8">You've Unlocked One Year Pro Subscriptions</p>

                <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-sm mb-8 text-left border border-dark-700">
                    <h3 className="text-white font-bold mb-4 border-b border-dark-700 pb-2">Benefits Unlocked:</h3>
                    <div className="space-y-3">
                        {features.slice(0, 5).map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                                    <Check size={12} className="text-dark-900 stroke-[3]" />
                                </div>
                                <span className="text-gray-300 text-sm">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-gray-500 max-w-xs mb-8">
                    Your subscription will automatically renew annually unless canceled. Manage your subscription in your account settings.
                </p>

                <button 
                    onClick={onBack}
                    className="w-full max-w-sm py-4 rounded-full bg-brand-500 text-dark-900 font-bold hover:bg-brand-400 transition-colors shadow-lg"
                >
                    Start Exploring Premium Features
                </button>
            </div>
        );
    }

    if (step === 'PROCESSING') {
        return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
                <div className="bg-dark-800 p-8 rounded-3xl flex flex-col items-center max-w-xs w-full border border-dark-700 shadow-2xl">
                    <div className="relative w-20 h-20 mb-6">
                         <div className="absolute inset-0 border-4 border-brand-500/30 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Processing Payment...</h3>
                    <p className="text-sm text-gray-400 text-center">Please do not close this screen</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-dark-900 flex flex-col animate-in slide-in-from-bottom duration-300 overflow-y-auto">
            {/* Header */}
            <div className="p-4 flex items-center gap-4 border-b border-dark-800 sticky top-0 bg-dark-900 z-10">
                <button onClick={onBack} className="p-2 hover:bg-dark-800 rounded-full text-white">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-white flex-1">
                    {step === 'PLAN' && 'Upgrade Plan'}
                    {step === 'PAYMENT' && 'Choose Payment Methods'}
                    {step === 'REVIEW' && 'Review Summary'}
                </h1>
            </div>

            <div className="flex-1 p-6 pb-24 max-w-lg mx-auto w-full">
                
                {step === 'PLAN' && (
                    <>
                        {/* Toggle */}
                        <div className="flex p-1 bg-dark-800 rounded-full mb-8 border border-dark-700">
                            <button 
                                onClick={() => setPlan('MONTHLY')}
                                className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${plan === 'MONTHLY' ? 'bg-brand-500 text-dark-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button 
                                onClick={() => setPlan('YEARLY')}
                                className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${plan === 'YEARLY' ? 'bg-brand-500 text-dark-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Yearly
                            </button>
                        </div>

                        {/* Card */}
                        <div className="bg-dark-800 rounded-3xl p-8 border border-dark-700 text-center relative overflow-hidden mb-8">
                            {plan === 'YEARLY' && (
                                <div className="absolute top-0 right-0 bg-brand-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
                                    Save 16%
                                </div>
                            )}
                            
                            <h2 className="text-2xl font-bold text-white mb-2">ANNA Premium</h2>
                            <div className="flex items-end justify-center gap-1 mb-8">
                                <span className="text-5xl font-bold text-brand-500">
                                    ${plan === 'YEARLY' ? '99.99' : '9.99'}
                                </span>
                                <span className="text-gray-400 mb-1">
                                    / {plan === 'YEARLY' ? 'year' : 'month'}
                                </span>
                            </div>

                            <div className="space-y-4 text-left border-t border-dark-700 pt-6">
                                {features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Check size={20} className="text-brand-500 flex-shrink-0" />
                                        <span className="text-gray-300">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {step === 'PAYMENT' && (
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-2">Select a method</p>
                        {[
                            { id: 'paypal', name: 'PayPal', icon: 'https://www.svgrepo.com/show/349472/paypal.svg' },
                            { id: 'google', name: 'Google Pay', icon: 'https://www.svgrepo.com/show/475656/google-color.svg' },
                            { id: 'apple', name: 'Apple Pay', icon: 'https://www.svgrepo.com/show/509536/apple-pay.svg', invert: true },
                            { id: 'mastercard', name: 'Mastercard •••• 4679', icon: 'https://www.svgrepo.com/show/362013/mastercard.svg' },
                            { id: 'visa', name: 'Visa •••• 5567', icon: 'https://www.svgrepo.com/show/362036/visa.svg', color: '#1a1f71' }
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setPaymentMethod(m.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                    paymentMethod === m.id 
                                    ? 'bg-dark-800 border-brand-500 shadow-[0_0_0_1px_rgba(194,245,88,1)]' 
                                    : 'bg-dark-800 border-dark-700 hover:border-dark-600'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2`}>
                                        <img src={m.icon} alt={m.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="font-bold text-white">{m.name}</span>
                                </div>
                                {paymentMethod === m.id ? (
                                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-dark-900 rounded-full"></div>
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                                )}
                            </button>
                        ))}

                        <button className="w-full py-4 rounded-2xl border border-dashed border-dark-600 text-gray-400 hover:text-white hover:border-brand-500 hover:bg-dark-800 transition-all flex items-center justify-center gap-2">
                             + Add New Payment Method
                        </button>
                    </div>
                )}

                {step === 'REVIEW' && (
                    <div className="space-y-6">
                        <div className="bg-dark-800 p-6 rounded-3xl border border-brand-500/30 relative overflow-hidden">
                             <div className="absolute top-0 right-0 bg-brand-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
                                Save 16%
                            </div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase mb-1">Plan</h3>
                            <div className="flex justify-between items-end mb-4 border-b border-dark-700 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">ANNA Premium</h2>
                                    <p className="text-brand-500 font-medium">{plan === 'YEARLY' ? 'Yearly Subscription' : 'Monthly Subscription'}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white">${plan === 'YEARLY' ? '99.99' : '9.99'}</span>
                                    <span className="text-gray-400 text-sm">/{plan === 'YEARLY' ? 'yr' : 'mo'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Amount</span>
                                    <span className="text-white font-medium">${plan === 'YEARLY' ? '99.99' : '9.99'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Tax</span>
                                    <span className="text-white font-medium">$0.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 text-brand-500">
                                    <span>Total</span>
                                    <span>${plan === 'YEARLY' ? '99.99' : '9.99'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-800 p-4 rounded-2xl border border-dark-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center">
                                    <img src="https://www.svgrepo.com/show/362013/mastercard.svg" alt="Mastercard" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Mastercard</p>
                                    <p className="text-xs text-gray-500">•••• 4679</p>
                                </div>
                            </div>
                            <button onClick={() => setStep('PAYMENT')} className="text-brand-500 text-sm font-bold hover:underline">
                                Change
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Action */}
            <div className="p-4 bg-dark-900 border-t border-dark-800 safe-area-bottom">
                <button 
                    onClick={() => {
                        if (step === 'PLAN') setStep('PAYMENT');
                        else if (step === 'PAYMENT') setStep('REVIEW');
                        else if (step === 'REVIEW') setStep('PROCESSING');
                    }}
                    className="w-full py-4 rounded-full bg-brand-500 text-dark-900 font-bold text-lg hover:bg-brand-400 transition-colors shadow-[0_4px_20px_rgba(194,245,88,0.3)]"
                >
                    {step === 'PLAN' && `Continue - $${plan === 'YEARLY' ? '99.99' : '9.99'}`}
                    {step === 'PAYMENT' && 'Continue'}
                    {step === 'REVIEW' && `Confirm Payment - $${plan === 'YEARLY' ? '99.99' : '9.99'}`}
                </button>
            </div>
        </div>
    );
};

export default Premium;
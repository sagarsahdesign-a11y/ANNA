import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "ANNA - Personalized Tracking Made Easy",
      description: "Log your meals, track activities, steps, weight, BMI, and monitor hydration with tailored insights just for you.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" // Salad/Healthy food
    },
    {
      title: "Gain Clear Insights Into Your Progress",
      description: "See how your daily efforts stack up with detailed graphs and reports on calories, nutrition, and fitness.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" // Charts/Data
    },
    {
      title: "Empower Your Health with Expert Advice",
      description: "Access a wealth of knowledge, nutrition, and wellness articles tailored to your needs, written by our top experts.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80" // Healthy cooking/fruit
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-brand-500 relative overflow-hidden">
      {/* Background Image Area (Top Half) */}
      <div className="h-[55%] relative">
        <img 
            src={slides[step].image} 
            alt="Onboarding" 
            className="w-full h-full object-cover"
        />
        {/* Decorative branding overlay or status bar placeholder could go here */}
      </div>

      {/* Content Area (Bottom Half with Curve) */}
      <div className="flex-1 bg-dark-900 rounded-t-[40px] -mt-10 relative z-10 flex flex-col p-8 pb-10">
        
        {/* Text Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-6">
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            {slides[step].title}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed px-4">
            {slides[step].description}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-brand-500' : 'w-2 bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={onComplete}
            className="flex-1 py-4 rounded-full bg-dark-800 text-white font-semibold hover:bg-dark-700 transition-colors"
          >
            Skip
          </button>
          <button 
            onClick={handleNext}
            className="flex-1 py-4 rounded-full bg-brand-500 text-dark-900 font-bold hover:bg-brand-400 transition-colors shadow-[0_4px_20px_rgba(194,245,88,0.3)]"
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
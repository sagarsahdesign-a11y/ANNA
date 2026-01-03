import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CameraCapture from './components/CameraCapture';
import AnalysisResultView from './components/AnalysisResult.tsx';
import ChatInterface from './components/ChatInterface';
import VideoAnalysis from './components/VideoAnalysis';
import Onboarding from './components/Onboarding';
import ProfileSetup from './components/ProfileSetup';
import Tracker from './components/Tracker';
import Insights from './components/Insights';
import Account from './components/Account';
import { supabase } from './supabaseClient';
import { AppView, User, AnalysisResult } from './types';
import { analyzeFoodImage } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('SPLASH');
  const [user, setUser] = useState<User | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Initial Load Logic
    const initApp = async () => {
      // 1. Simulate Splash Screen
      await new Promise(r => setTimeout(r, 2000));
      
      // 2. Check Auth
      const { data: { session } } = await supabase.auth.getSession();
      
      // 3. Check Onboarding Status (Local Storage for simplicity)
      const hasOnboarded = localStorage.getItem('anna_onboarding_completed') === 'true';

      if (session) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        // Check if user has completed profile setup (using metadata)
        if (session.user.user_metadata?.onboarding_completed) {
            setView('DASHBOARD');
        } else {
            setView('SETUP');
        }
      } else {
        if (hasOnboarded) {
          setView('AUTH');
        } else {
          setView('ONBOARDING');
        }
      }
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        if (session.user.user_metadata?.onboarding_completed) {
            setView('DASHBOARD');
        } else {
            setView('SETUP');
        }
      } else {
        // Only clear user if we are not in a forced demo state (which we handle below)
        // But for simplicity, we let the auth listener drive standard flow.
        // If we force login via fallback, we manually set user.
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleManualLoginSuccess = () => {
      // This is called when Auth component bypasses actual Supabase auth (e.g. "Failed to fetch")
      console.log("Manual fallback login");
      const demoUser = { id: 'demo_user', email: 'demo@example.com' };
      setUser(demoUser);
      setView('SETUP');
  };

  const handleCapture = async (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setView('ANALYSIS');
    setAnalyzing(true);
    
    try {
      const base64Data = imageSrc.split(',')[1];
      const result = await analyzeFoodImage(base64Data);
      setCurrentResult(result);
    } catch (error) {
      alert("Analysis failed. Please try again.");
      console.error(error);
      setView('DASHBOARD');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveLog = async () => {
    if (!currentResult || !user) return;
    setIsSaving(true);
    try {
        const fakeImageUrl = currentImage; 
        await supabase.from('food_logs').insert({
            user_id: user.id,
            items: currentResult.items,
            total_calories: currentResult.totalCalories,
            image_url: fakeImageUrl 
        });
        setView('DASHBOARD');
        setCurrentImage(null);
        setCurrentResult(null);
    } catch (e) {
        console.error(e);
        // Fallback for demo
        setView('DASHBOARD');
        setCurrentImage(null);
        setCurrentResult(null);
    } finally {
        setIsSaving(false);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('anna_onboarding_completed', 'true');
    setView('AUTH');
  };

  // --- Render Views ---

  if (view === 'SPLASH') {
    return (
      <div className="fixed inset-0 bg-brand-500 flex flex-col items-center justify-center z-50">
        <img src="/logo.png" alt="ANNA" className="w-32 h-32 rounded-3xl animate-bounce shadow-xl object-contain bg-dark-900" />
        <h1 className="text-dark-900 text-3xl font-black mt-6 tracking-[0.2em]">ANNA</h1>
        <Loader2 className="mt-8 animate-spin text-dark-900" />
      </div>
    );
  }

  if (view === 'ONBOARDING') {
      return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (view === 'AUTH') {
    return <Auth onLoginSuccess={handleManualLoginSuccess} />;
  }

  if (view === 'SETUP' && user) {
      return <ProfileSetup onComplete={() => setView('DASHBOARD')} userId={user.id} />;
  }

  // Analyzing Overlay
  if (analyzing) {
      return (
          <div className="fixed inset-0 bg-dark-900/90 z-50 flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm">
              <Loader2 className="w-16 h-16 text-brand-500 animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-white">Analyzing your food...</h2>
              <p className="text-gray-400 mt-2 max-w-xs">AI is identifying ingredients and estimating calories.</p>
          </div>
      );
  }

  // Main App (Authenticated)
  return (
    <div className="min-h-screen bg-dark-900 font-sans text-white">
      <main className="pb-0">
        {view === 'DASHBOARD' && (
            <Dashboard onStartScan={() => setView('CAMERA')} />
        )}

        {view === 'TRACKER' && (
            <Tracker />
        )}

        {view === 'INSIGHTS' && (
            <Insights />
        )}

        {view === 'ACCOUNT' && (
            <Account onSignOut={() => { setUser(null); setView('AUTH'); }} userEmail={user?.email} />
        )}

        {view === 'CAMERA' && (
            <CameraCapture 
                onCapture={handleCapture} 
                onCancel={() => setView('DASHBOARD')} 
            />
        )}

        {view === 'ANALYSIS' && currentResult && (
            <AnalysisResultView 
                result={currentResult}
                onSave={handleSaveLog}
                onDiscard={() => setView('DASHBOARD')}
                isSaving={isSaving}
            />
        )}

        {view === 'CHAT' && (
          <ChatInterface />
        )}

        {view === 'VIDEO' && (
          <VideoAnalysis />
        )}
      </main>

      {view !== 'CAMERA' && view !== 'SETUP' && view !== 'ANALYSIS' && (
        <Navbar 
            onNavigate={(v) => setView(v as AppView)} 
            currentView={view} 
            onSignOut={() => supabase.auth.signOut()} 
            userEmail={user?.email}
        />
      )}
    </div>
  );
};

export default App;
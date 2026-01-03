import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MapPin, Globe, Volume2, Loader2, BrainCircuit } from 'lucide-react';
import { chatWithChef, searchNutritionInfo, findNearbyPlaces, generateSpeech } from '../services/geminiService';
import { ChatMessage } from '../types';

// Audio decoding helper
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hello! I'm your AI Chef. Ask me about nutrition, recipes, or find healthy places nearby." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'CHAT' | 'SEARCH' | 'MAPS'>('CHAT');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let responseText = '';
      let urls: any[] = [];

      if (mode === 'SEARCH') {
        const result = await searchNutritionInfo(userMsg.text);
        responseText = result.text;
        urls = result.groundingUrls;
      } else if (mode === 'MAPS') {
        // Get location
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }).catch(() => null);

        if (pos) {
          const result = await findNearbyPlaces(userMsg.text, pos.coords.latitude, pos.coords.longitude);
          responseText = result.text;
          urls = result.groundingUrls;
        } else {
          responseText = "Please enable location services to find places nearby.";
        }
      } else {
        // Default Chat with Thinking
        // Construct history for context
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));
        const result = await chatWithChef(history, userMsg.text);
        responseText = result.text;
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        isThinking: mode === 'CHAT', // Assume default chat uses the thinking model
        groundingUrls: urls
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error processing that request."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (text: string) => {
    const base64Audio = await generateSpeech(text);
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(decode(base64Audio).buffer);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start(0);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      
      {/* Mode Toggle */}
      <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto">
        <button 
          onClick={() => setMode('CHAT')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${mode === 'CHAT' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          <BrainCircuit size={16} /> Deep Thinking
        </button>
        <button 
          onClick={() => setMode('SEARCH')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${mode === 'SEARCH' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          <Globe size={16} /> Web Search
        </button>
        <button 
          onClick={() => setMode('MAPS')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${mode === 'MAPS' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          <MapPin size={16} /> Nearby Places
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white text-gray-800 border border-gray-100'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 mb-1">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.map((url, i) => (
                      <a 
                        key={i} 
                        href={url.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:underline truncate max-w-[200px]"
                      >
                        {url.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {msg.role === 'model' && (
                <div className="mt-2 flex justify-end">
                   <button onClick={() => playAudio(msg.text)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-600 transition">
                      <Volume2 size={16} />
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-2">
               <Loader2 className="animate-spin text-brand-600" size={16} />
               <span className="text-sm text-gray-500">
                  {mode === 'CHAT' ? "Thinking deeply..." : mode === 'SEARCH' ? "Searching web..." : "Locating places..."}
               </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${mode === 'MAPS' ? 'restaurants...' : mode === 'SEARCH' ? 'nutrition news...' : 'diets...'}`}
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-brand-600 text-white p-3 rounded-full hover:bg-brand-700 disabled:opacity-50 transition"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
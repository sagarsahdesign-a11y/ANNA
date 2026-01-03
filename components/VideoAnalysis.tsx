import React, { useState, useRef } from 'react';
import { Upload, Video, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { analyzeFoodVideo } from '../services/geminiService';
import { VideoAnalysisResult } from '../types';

const VideoAnalysis: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile) return;

    // Check size limit (e.g., 20MB for this demo)
    if (videoFile.size > 20 * 1024 * 1024) {
      alert("Video is too large. Please upload a clip under 20MB.");
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const res = await analyzeFoodVideo(base64String, videoFile.type);
        setResult(res);
        setLoading(false);
      };
      reader.readAsDataURL(videoFile);
    } catch (error) {
      console.error(error);
      alert("Video analysis failed.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Food Analysis</h2>
        <p className="text-gray-500 mb-8">Upload a short video of your meal for AI analysis.</p>

        {!videoFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:bg-gray-50 transition"
          >
            <Upload className="mx-auto text-gray-400 mb-4" size={40} />
            <p className="font-medium text-gray-700">Click to upload video</p>
            <p className="text-xs text-gray-500 mt-2">MP4, MOV (Max 20MB)</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="video/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-center gap-3">
                <Video size={20} className="text-brand-600" />
                <span className="text-sm font-medium truncate max-w-[200px]">{videoFile.name}</span>
              </div>
              <button 
                onClick={() => setVideoFile(null)}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Remove
              </button>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Video size={20} /> Analyze Video</>}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-8 text-left bg-brand-50 rounded-xl p-6 border border-brand-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-brand-600" /> Analysis Result
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Summary</span>
                <p className="text-gray-800 mt-1">{result.summary}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-brand-100">
                  <span className="text-xs text-gray-500">Estimated Calories</span>
                  <p className="text-xl font-bold text-brand-600">{result.calories} kcal</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-brand-100">
                  <span className="text-xs text-gray-500">Items Detected</span>
                  <p className="text-gray-800 font-medium">{result.items.length}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detected Ingredients</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.items.map((item, idx) => (
                    <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200 text-gray-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalysis;
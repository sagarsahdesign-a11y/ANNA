import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Use structured error state for better UI messaging
  const [errorState, setErrorState] = useState<{title: string, message: string} | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Attach stream to video element when available
  useEffect(() => {
    if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    setPermissionRequested(true);
    setErrorState(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
    } catch (err: any) {
      console.error("Camera Access Error:", err);
      
      let title = "Camera Access Failed";
      let message = "An unexpected error occurred. You can upload a photo instead.";

      // Handle specific error types for better user guidance
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        title = "Permission Denied";
        message = "Please allow camera access in your browser settings to use this feature, then try again.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        title = "No Camera Found";
        message = "We couldn't detect a camera on your device. Please try uploading a photo.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        title = "Camera In Use";
        message = "Another application appears to be using the camera. Please close other apps and try again.";
      } else if (err.name === 'OverconstrainedError') {
         title = "Camera Error";
         message = "Your camera doesn't support the requested resolution or mode.";
      }

      setErrorState({ title, message });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8); // Compress slightly
        onCapture(imageSrc);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
      fileInputRef.current?.click();
  };

  // 1. Permission Prompt State (Initial State)
  if (!stream && !errorState && !permissionRequested) {
      return (
          <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Camera size={40} className="text-brand-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Allow Camera Access</h2>
              <p className="text-gray-400 mb-8 max-w-xs">
                  We need access to your camera to scan food items for calorie estimation.
              </p>
              
              <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button 
                      onClick={startCamera}
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                      Allow Camera
                  </button>
                  <button 
                      onClick={triggerFileUpload}
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                      Upload Photo Instead
                  </button>
                  <button 
                      onClick={onCancel}
                      className="mt-4 text-gray-500 hover:text-white text-sm"
                  >
                      Cancel
                  </button>
              </div>

              {/* Hidden Input for Upload */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
            />
          </div>
      );
  }

  // 2. Main Camera View (or Error View)
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {errorState ? (
          <div className="text-white text-center p-8 max-w-md w-full bg-gray-900 rounded-2xl mx-4 border border-gray-800 shadow-2xl">
            <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{errorState.title}</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">{errorState.message}</p>
            
            <div className="space-y-3">
                <button 
                    onClick={triggerFileUpload}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <ImageIcon size={20} />
                    Upload Photo Instead
                </button>
                
                <button 
                    onClick={startCamera}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white px-6 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} />
                    Try Again
                </button>
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Close/Back Button (Always visible at top) */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full backdrop-blur-md z-10 hover:bg-black/60 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Bottom Controls - Hide if there is a blocking error to reduce clutter */}
      {!errorState && (
        <div className="h-32 bg-gray-900 flex items-center justify-around px-8 safe-area-bottom">
            <button 
                onClick={triggerFileUpload}
                className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
                title="Upload Photo"
            >
            <ImageIcon size={24} />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
            />

            <button 
                onClick={capturePhoto}
                disabled={!stream}
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                    !stream ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 active:scale-95 cursor-pointer'
                }`}
            >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white" />
            </button>

            <button 
                onClick={startCamera} // Retry/Restart camera
                className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
                title="Restart Camera"
            >
            <RefreshCw size={24} />
            </button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
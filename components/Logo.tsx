import React, { useState } from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
    const [imgError, setImgError] = useState(false);

    if (imgError) {
         return (
            <div className={`${className} flex items-center justify-center`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg filter">
                    {/* Ghost Body */}
                    <path 
                        d="M50 10 C25 10 10 35 10 60 C10 85 25 95 50 95 C75 95 90 85 90 60 C90 35 75 10 50 10 Z" 
                        fill="white" 
                    />
                    
                    {/* Mountains at bottom (black) */}
                    <path 
                        d="M10 80 L25 65 L40 80 L50 65 L60 80 L75 65 L90 80 V95 H10 Z" 
                        fill="#181A20" 
                    />
                    
                    {/* Eyes (Black angled ovals) */}
                    <path d="M28 50 Q35 45 42 50 Q35 58 28 50 Z" fill="#181A20" />
                    <path d="M72 50 Q65 45 58 50 Q65 58 72 50 Z" fill="#181A20" />
                    
                    {/* Hat (Fez-like) */}
                    <path d="M35 22 L65 22 L62 5 H38 Z" fill="#991B1B" /> 
                    
                    {/* Hat Patterns */}
                    <path d="M38 10 L42 14 L46 10 L50 14 L54 10 L58 14 L62 10" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
                    <path d="M36 18 L40 14 L44 18 L48 14 L52 18 L56 14 L60 18 L64 14" stroke="#22C55E" strokeWidth="1.5" fill="none" />
                </svg>
            </div>
         );
    }

    return (
        <img 
            src="/logo.png" 
            alt="ANNA" 
            className={`${className} object-contain`}
            onError={() => setImgError(true)} 
        />
    );
};

export default Logo;
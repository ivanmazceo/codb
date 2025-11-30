import React, { useMemo } from 'react';
import { BackgroundBlob } from '../types';

const Background: React.FC = () => {
  const blobs = useMemo<BackgroundBlob[]>(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 300 + Math.random() * 400,
      opacity: 0.05 + Math.random() * 0.1,
      animationDelay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-vibe-black">
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div>
      
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className={`absolute rounded-full bg-white blur-[80px] ${blob.id % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            opacity: blob.opacity,
            transform: 'translate(-50%, -50%)',
            animationDelay: blob.animationDelay,
          }}
        />
      ))}
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-vibe-black opacity-80" />
    </div>
  );
};

export default Background;
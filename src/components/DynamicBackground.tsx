/**
 * Dynamic animated background component with live crypto imagery
 */

import React, { useState, useEffect } from 'react';

interface DynamicBackgroundProps {
  className?: string;
}

export function DynamicBackground({ className = '' }: DynamicBackgroundProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Crypto-themed background images including your custom CryptoSniperPRO image
  const backgroundImages = [
    'https://pub-cdn.sider.ai/u/U0KAHY9O4N/web-coder/686f3f80d84378322bc45f1f/resource/686f3f80d84378322bc45f1f.jpg', // Your CryptoSniperPRO image
    'https://pub-cdn.sider.ai/u/U0KAHY9O4N/web-coder/685fc6490385cdf9803e9fae/resource/033d5696-c24c-40be-9bf8-d2a2ff747b9b.jpg',
    'https://pub-cdn.sider.ai/u/U0KAHY9O4N/web-coder/685fc6490385cdf9803e9fae/resource/51d28c08-1988-497b-890a-97f3270db328.jpg',
    'https://pub-cdn.sider.ai/u/U0KAHY9O4N/web-coder/685fc6490385cdf9803e9fae/resource/98e4393b-8ee3-432c-82a3-d9e939d47c33.jpg',
    'https://pub-cdn.sider.ai/u/U0KAHY9O4N/web-coder/685fc6490385cdf9803e9fae/resource/bbcfb016-8e55-421c-b020-2c02e065de8a.jpg',
    'https://pub-cdn.sider.ai/u/U0KAHY9O4N/web-coder/685fc6490385cdf9803e9fae/resource/ef464507-5375-4c59-af12-7f61b5211ec3.jpg',
    'https://pub-cdn.sider.ai/u/U0KAHY9O4N/web-coder/685fc6490385cdf9803e9fae/resource/12a0ec2a-fed0-4ae7-84c5-7ce04996fb75.jpg',
  ];

  // Rotate background images every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        setIsVisible(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 animate-gradient" />
      
      {/* Dynamic Background Image */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>
      
      {/* Geometric Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-green-500/10 rounded-lg rotate-45 animate-spin-slow" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-purple-500/10 rounded-full animate-bounce-slow" />
      </div>
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}

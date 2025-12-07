import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-green-500 flex items-center justify-center z-50">
      <div className="text-center">
        <img 
          src="images/logo-transparent.png" 
          alt="Logo" 
          className="w-24 h-24 mx-auto mb-6 animate-pulse"
        />
        <div className="flex space-x-2 justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-white mt-4 text-lg font-semibold">Chargement...</p>
      </div>
    </div>
  );
}
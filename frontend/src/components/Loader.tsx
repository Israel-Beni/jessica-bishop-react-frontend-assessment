import React from 'react';

interface LoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

function Loader({ message = "Syncing Database", subMessage = "Authenticating secure clinical channel...", fullScreen = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative mb-8">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse" />

        {/* Main spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-emerald-100/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </div>
      </div>

      <div className="text-center animate-fade-in">
        <h3 className="text-emerald-950 font-bold text-2xl tracking-tighter mb-2">
          {message}
        </h3>
        <p className="text-emerald-900/40 font-semibold text-sm  max-w-xs mx-auto">
          {subMessage}
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-emerald-50/50 backdrop-blur-md">
        <div className="glass p-16 rounded-[48px] border border-white/50 shadow-2xl scale-110">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-[48px] border border-white/40 shadow-xl overflow-hidden animate-fade-in">
      {content}
    </div>
  );
};

export default Loader;

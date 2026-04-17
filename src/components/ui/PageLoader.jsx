import React from 'react';

export default function PageLoader({ text = "Loading incredible things..." }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[50vh] py-16 gap-10">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-20 h-20 border-4 border-brand-200 rounded-full animate-pulse"></div>
        <div className="absolute w-20 h-20 border-4 border-transparent border-t-brand-600 rounded-full animate-spin"></div>
        <div className="w-4 h-4 bg-brand-500 rounded-full animate-bounce"></div>
      </div>
      <p className="text-brand-700 font-medium animate-pulse tracking-wide text-sm uppercase">{text}</p>
    </div>
  );
}

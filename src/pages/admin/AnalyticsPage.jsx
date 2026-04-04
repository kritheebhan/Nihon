import React from 'react';

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500 mt-0.5">Deep insights into user learning behaviors and platform usage.</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Advanced Analytics Coming Soon</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We're currently building comprehensive charts and metrics that will show user retention, popular kanji, test scores progress, and daily active users. Check back later!
        </p>
      </div>
    </div>
  );
}

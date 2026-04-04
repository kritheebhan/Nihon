import React from 'react';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Platform Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage global configuration, security, and administrative preferences.</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="text-4xl mb-4">⚙️</div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Settings Configuration Coming Soon</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Global platform settings to manage user roles, enable/disable registrations, maintenance mode, and application branding are currently under development.
        </p>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/icons/logo.png';

export default function SplashPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(user ? '/app' : '/welcome', { replace: true });
    }, 2200);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      {/* Logo */}
      <div className="flex flex-col items-center gap-5 animate-fadeIn">
        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden">
          <img src={logo} alt="Nihongo" className="w-full h-full object-cover" />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">Nihongo</h1>
          <p className="text-blue-100 text-sm mt-1 font-medium tracking-widest uppercase">JLPT Study</p>
        </div>
      </div>

      {/* Loading dots */}
      <div className="flex items-center gap-2 mt-16">
        <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.7s ease-out forwards; }
      `}</style>
    </div>
  );
}

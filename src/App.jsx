import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import { BottomTabBar } from './components/TabBar';
import Sidebar from './components/Sidebar';
import IndexPage from './pages/vocab/IndexPage';
import HomePage from './pages/vocab/HomePage';
import SectionPage from './pages/vocab/SectionPage';
import SearchPage from './pages/vocab/SearchPage';
import TestPage from './pages/test/TestPage';
import KanjiPage from './pages/kanji/KanjiPage';
import HiraganaPage from './pages/kana/HiraganaPage';
import KatakanaPage from './pages/kana/KatakanaPage';
import GrammarPage from './pages/grammar/GrammarPage';
import ProfilePage from './pages/profile/ProfilePage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import ContentPage from './pages/admin/ContentPage';
import CredentialsPage from './pages/admin/CredentialsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/auth/LandingPage';
import SplashPage from './pages/auth/SplashPage';

function ProtectedApp() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [search, setSearch]           = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isVocabPage = location.pathname === '/app/vocabulary' ||
    location.pathname.startsWith('/app/section') ||
    location.pathname.startsWith('/app/search');

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    if (value.trim()) navigate(`/app/search?q=${encodeURIComponent(value)}`);
    else navigate('/app');
  };

  return (
    <div className="min-h-screen bg-page-bg">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex max-w-screen-2xl mx-auto">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 min-w-0 flex flex-col">
          {isVocabPage && (
            <div className="bg-white border-b border-slate-200 sticky top-14 z-30">
              <div className="px-4 sm:px-5 py-2.5">
                <div className="relative">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/>
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Search vocabulary — English, Japanese, or romaji"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:border-n5 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 px-4 py-5 sm:px-5 md:px-6 lg:px-8 md:py-7 pb-24 md:pb-8">
            <Routes>
              <Route index                              element={<HomePage />} />
              <Route path="vocabulary"                 element={<IndexPage />} />
              <Route path="section/:sectionId"          element={<SectionPage />} />
              <Route path="search"                      element={<SearchPage />} />
              <Route path="test"                        element={<TestPage />} />
              <Route path="kanji"                       element={<KanjiPage />} />
              <Route path="hiragana"                    element={<HiraganaPage />} />
              <Route path="katakana"                    element={<KatakanaPage />} />
              <Route path="grammar"                     element={<GrammarPage />} />
              <Route path="profile"                     element={<ProfilePage />} />
              <Route path="*"                           element={<Navigate to="/app" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/app" replace />;
  return children;
}

function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let activeListener = null;

    CapApp.addListener('backButton', ({ canGoBack }) => {
      const isHome = 
        location.pathname === '/app' || 
        location.pathname === '/admin' || 
        location.pathname === '/welcome' || 
        location.pathname === '/login' || 
        location.pathname === '/' ||
        location.pathname === '/register';

      if (isHome) {
        CapApp.exitApp();
      } else {
        navigate(-1);
      }
    }).then(listener => { activeListener = listener; });

    return () => {
      if (activeListener) activeListener.remove();
    };
  }, [location, navigate]);

  return null;
}

export default function App() {
  const { user, loading } = useAuth();
  const homeRoute = user?.role === 'admin' ? '/admin' : '/app';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackButtonHandler />
      <Routes>
        <Route path="/"         element={<SplashPage />} />
      <Route path="/welcome"  element={user ? <Navigate to={homeRoute} replace /> : <LandingPage />} />
      <Route path="/login"    element={user ? <Navigate to={homeRoute} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={homeRoute} replace /> : <RegisterPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index          element={<DashboardPage />} />
        <Route path="users"       element={<UsersPage />} />
        <Route path="content"     element={<ContentPage />} />
        <Route path="credentials" element={<CredentialsPage />} />
        <Route path="analytics"   element={<AnalyticsPage />} />
        <Route path="settings"    element={<SettingsPage />} />
      </Route>

      {/* App routes */}
      <Route path="/app/*" element={<RequireAuth><ProtectedApp /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

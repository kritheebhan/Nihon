import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import { BottomTabBar } from './components/TabBar';
import Sidebar from './components/Sidebar';
import IndexPage from './pages/vocab/IndexPage';
import SectionPage from './pages/vocab/SectionPage';
import SearchPage from './pages/vocab/SearchPage';
import TestPage from './pages/test/TestPage';
import HiraganaPage from './pages/kana/HiraganaPage';
import KatakanaPage from './pages/kana/KatakanaPage';
import MNNPage from './pages/books/MNNPage';
import GenkiPage from './pages/books/GenkiPage';
import GrammarPage from './pages/grammar/GrammarPage';

export default function App() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [search, setSearch]           = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isVocabPage = location.pathname === '/' ||
    location.pathname.startsWith('/section') ||
    location.pathname === '/search';

  // Close drawer on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    if (value.trim()) navigate(`/search?q=${encodeURIComponent(value)}`);
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-page-bg">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex max-w-screen-2xl mx-auto">
        {/* Sidebar — always rendered (desktop sticky, mobile drawer) */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Page content column */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Search bar — vocab pages only */}
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
              <Route path="/"                   element={<IndexPage />} />
              <Route path="/section/:sectionId" element={<SectionPage />} />
              <Route path="/search"             element={<SearchPage />} />
              <Route path="/test"               element={<TestPage />} />
              <Route path="/hiragana"           element={<HiraganaPage />} />
              <Route path="/katakana"           element={<KatakanaPage />} />
              <Route path="/mnn"                element={<MNNPage />} />
              <Route path="/genki"              element={<GenkiPage />} />
              <Route path="/grammar"            element={<GrammarPage />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <BottomTabBar />
    </div>
  );
}

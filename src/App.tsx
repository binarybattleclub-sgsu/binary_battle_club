import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Team } from './pages/Team';
import { ExploreTechnologies } from './pages/ExploreTechnologies';
import { CodeAndCompete } from './pages/CodeAndCompete';
import { InnovateAndBuild } from './pages/InnovateAndBuild';
import { Hackathons } from './pages/Hackathons';
import { Achievements } from './pages/Achievements';
import { JoinCommunity } from './pages/JoinCommunity';

// Scroll to top helper on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
};

export const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#080D18] text-[#DCE6F5] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#DCE6F5] relative overflow-x-hidden">
      <ScrollToTop />

      {/* Fixed Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
          collapsed={collapsed}
        />

        {/* Page Inner Container */}
        <main className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/explore-technologies" element={<ExploreTechnologies />} />
            <Route path="/code-compete" element={<CodeAndCompete />} />
            <Route path="/innovate-build" element={<InnovateAndBuild />} />
            <Route path="/innovate-build/student/:studentId" element={<InnovateAndBuild />} />
            <Route path="/innovate-build/project/:projectId" element={<InnovateAndBuild />} />
            <Route path="/create-showcase" element={<InnovateAndBuild />} />
            <Route path="/create-showcase/student/:studentId" element={<InnovateAndBuild />} />
            <Route path="/create-showcase/project/:projectId" element={<InnovateAndBuild />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/join-community" element={<JoinCommunity />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

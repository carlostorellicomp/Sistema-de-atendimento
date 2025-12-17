import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TicketSystem from './pages/TicketSystem';
import ProtocolAdvisor from './pages/ProtocolAdvisor';
import KnowledgeBase from './pages/KnowledgeBase';
import TeamSettings from './pages/TeamSettings';
import Notifications from './pages/Notifications';
import { ThemeConfig } from './types';

const App: React.FC = () => {
  useEffect(() => {
    // Load saved theme on startup
    const savedTheme = localStorage.getItem('themeConfig');
    if (savedTheme) {
      try {
        const theme: ThemeConfig = JSON.parse(savedTheme);
        const root = document.documentElement;
        root.style.setProperty('--brand-50', theme.bgColor);
        root.style.setProperty('--brand-500', theme.primaryColor);
        root.style.setProperty('--brand-900', theme.sidebarColor);
        root.style.setProperty('--font-main', theme.fontFamily);
      } catch (e) {
        console.error("Error loading theme", e);
      }
    }
  }, []);

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-brand-50 font-sans">
        <Sidebar />
        <main className="flex-1 ml-64 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketSystem />} />
            <Route path="/advisor" element={<ProtocolAdvisor />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<TeamSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Beranda from './pages/Beranda';
import ModulMedia from './pages/ModulMedia';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { dataJBM as initialData } from './data/mockData';

export default function App() {
  const [dataJBM, setDataJBM] = useState(() => {
    const saved = localStorage.getItem('dataJBM');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [currentView, setCurrentView] = useState('user');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('beranda');

  useEffect(() => {
    localStorage.setItem('dataJBM', JSON.stringify(dataJBM));
  }, [dataJBM]);

  useEffect(() => {
    window.history.replaceState({ view: 'user', menu: 'beranda' }, '', '');

    const handlePopState = (event) => {
      if (event.state) {
        if (event.state.view) setCurrentView(event.state.view);
        if (event.state.menu) setActiveMenu(event.state.menu);
      } else {
        setCurrentView('user');
        setActiveMenu('beranda');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateMenu = (newMenu) => {
    if (newMenu === activeMenu && currentView === 'user') return;
    window.history.pushState({ view: 'user', menu: newMenu }, '', '');
    setCurrentView('user');
    setActiveMenu(newMenu);
  };

  const navigateView = (newView) => {
    window.history.pushState({ view: newView, menu: activeMenu }, '', '');
    setCurrentView(newView);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (currentView === 'user') {
          navigateView(isAdminLoggedIn ? 'adminDashboard' : 'adminLogin');
        } else {
          window.history.back();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn, currentView, activeMenu]);

  const handleExitAdmin = () => {
    setIsAdminLoggedIn(false);
    navigateView('user');
  };

  if (currentView === 'adminLogin' && !isAdminLoggedIn) {
    return (
      <AdminLogin 
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          navigateView('adminDashboard');
        }}
        onBack={() => window.history.back()}
      />
    );
  }

  if (currentView === 'adminDashboard' && isAdminLoggedIn) {
    return (
      <AdminDashboard 
        dataJBM={dataJBM} 
        setDataJBM={setDataJBM} 
        onBack={handleExitAdmin} 
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFDF5] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] text-zinc-900 font-sans antialiased selection:bg-yellow-300 flex flex-col justify-between">
      <div>
        <Navbar 
          activeMenu={activeMenu} 
          setActiveMenu={navigateMenu} 
        />
        
        <main className="w-full py-4">
          {activeMenu === 'beranda' && <Beranda onNavigate={navigateMenu} />}
          {activeMenu === 'modul' && <ModulMedia modulList={dataJBM.modulList} />}
        </main>
      </div>

      <Footer 
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            navigateView('adminDashboard');
          } else {
            navigateView('adminLogin');
          }
        }} 
      />
    </div>
  );
}
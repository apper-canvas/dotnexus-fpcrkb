import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface-100 dark:bg-surface-800 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">DN</span>
            </div>
          </motion.div>
          <h1 className="text-lg md:text-xl font-bold text-surface-900 dark:text-surface-50">
            DotNexus
          </h1>
        </div>

        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? 
            <SunIcon className="w-5 h-5 text-yellow-400" /> : 
            <MoonIcon className="w-5 h-5 text-surface-600" />
          }
        </button>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mt-auto bg-surface-100 dark:bg-surface-800 text-center py-3 text-surface-600 dark:text-surface-400 text-sm">
        <p>© {new Date().getFullYear()} DotNexus - Connect dots and conquer boxes!</p>
      </footer>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="text-sm"
      />
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Icons
  const GameIcon = getIcon('GamepadTwo');
  const UsersIcon = getIcon('Users');
  const BrainIcon = getIcon('Brain');
  
  useEffect(() => {
    // Simulate loading the game assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          ></motion.div>
          <p className="mt-4 text-surface-600 dark:text-surface-400">Loading the game...</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Welcome to DotNexus
            </h1>
            <p className="text-surface-600 dark:text-surface-400 text-lg max-w-2xl mx-auto">
              Connect the dots, claim boxes, and outsmart your opponent in this classic game with a modern twist!
            </p>
          </motion.div>

          <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden">
            <div className="p-4 md:p-6 lg:p-8">
              <MainFeature />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <FeatureCard 
              icon={GameIcon}
              title="Classic Gameplay"
              description="Take turns drawing lines to connect adjacent dots. When you complete a box, claim it and earn another turn."
              color="from-blue-500 to-cyan-500"
            />
            
            <FeatureCard 
              icon={UsersIcon}
              title="Play with Friends"
              description="Challenge a friend to a local multiplayer match and see who can claim the most boxes."
              color="from-purple-500 to-pink-500"
            />
            
            <FeatureCard 
              icon={BrainIcon}
              title="Strategic Depth"
              description="Plan multiple moves ahead to create traps and force your opponent into giving you boxes."
              color="from-amber-500 to-red-500"
            />
          </motion.div>
        </>
      )}
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 border border-surface-200 dark:border-surface-700"
    >
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-surface-600 dark:text-surface-400">{description}</p>
    </motion.div>
  );
};

export default Home;
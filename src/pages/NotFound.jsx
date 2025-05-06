import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const GhostIcon = getIcon('GhostIcon');
  const ChevronLeftIcon = getIcon('ChevronLeft');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto w-24 h-24 mb-6 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center">
          <GhostIcon className="w-12 h-12 text-surface-500 dark:text-surface-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8">
          Oops! The dots didn't connect here. We couldn't find the page you were looking for.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-16 grid grid-cols-3 md:grid-cols-5 gap-4"
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-surface-300 dark:bg-surface-700"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default NotFound;
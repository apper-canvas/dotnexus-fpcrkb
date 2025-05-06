import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icons
  const RefreshIcon = getIcon('RefreshCw');
  const TrophyIcon = getIcon('Trophy');
  const ArrowRightIcon = getIcon('ArrowRight');
  const SettingsIcon = getIcon('Settings');
  
  // Game settings state
  const [gridSize, setGridSize] = useState(5);  // Default 5x5 grid
  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game state
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [lines, setLines] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [hoveredLine, setHoveredLine] = useState(null);
  const [completedBoxes, setCompletedBoxes] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  
  // Generate grid dots
  const generateDots = () => {
    const dots = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        dots.push({ x, y });
      }
    }
    return dots;
  };
  
  // Generate all possible lines
  const generatePossibleLines = () => {
    const possible = [];
    
    // Horizontal lines
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize - 1; x++) {
        possible.push({
          start: { x, y },
          end: { x: x + 1, y },
          type: 'horizontal',
          drawn: false,
          id: `h-${x}-${y}`,
        });
      }
    }
    
    // Vertical lines
    for (let y = 0; y < gridSize - 1; y++) {
      for (let x = 0; x < gridSize; x++) {
        possible.push({
          start: { x, y },
          end: { x, y: y + 1 },
          type: 'vertical',
          drawn: false,
          id: `v-${x}-${y}`,
        });
      }
    }
    
    return possible;
  };
  
  // Generate possible boxes
  const generatePossibleBoxes = () => {
    const possible = [];
    
    for (let y = 0; y < gridSize - 1; y++) {
      for (let x = 0; x < gridSize - 1; x++) {
        possible.push({
          topLeft: { x, y },
          topRight: { x: x + 1, y },
          bottomLeft: { x, y: y + 1 },
          bottomRight: { x: x + 1, y: y + 1 },
          owner: null,
          id: `box-${x}-${y}`,
        });
      }
    }
    
    return possible;
  };
  
  const [dots, setDots] = useState(generateDots());
  const [possibleLines, setPossibleLines] = useState(generatePossibleLines());
  const [possibleBoxes, setPossibleBoxes] = useState(generatePossibleBoxes());
  
  // Reset game
  const resetGame = () => {
    setCurrentPlayer(1);
    setScore({ player1: 0, player2: 0 });
    setLines([]);
    setBoxes([]);
    setHoveredLine(null);
    setCompletedBoxes([]);
    setGameOver(false);
    
    // Regenerate grid based on current size
    setDots(generateDots());
    setPossibleLines(generatePossibleLines());
    setPossibleBoxes(generatePossibleBoxes());
    
    setGameStarted(true);
    toast.info("Game reset! Player 1 starts.");
  };
  
  // Start new game with current settings
  const startGame = () => {
    resetGame();
  };
  
  // Update grid size
  useEffect(() => {
    if (gameStarted) {
      resetGame();
    }
  }, [gridSize]);
  
  // Check if a box is completed by a line
  const checkBoxCompletion = (lineId) => {
    const newBoxes = [...possibleBoxes];
    let boxesCompleted = 0;
    
    newBoxes.forEach((box) => {
      if (box.owner === null) {
        // Get the four lines that form this box
        const topLine = possibleLines.find(
          (l) => l.type === 'horizontal' && 
          l.start.x === box.topLeft.x && 
          l.start.y === box.topLeft.y
        );
        
        const rightLine = possibleLines.find(
          (l) => l.type === 'vertical' && 
          l.start.x === box.topRight.x && 
          l.start.y === box.topRight.y
        );
        
        const bottomLine = possibleLines.find(
          (l) => l.type === 'horizontal' && 
          l.start.x === box.bottomLeft.x && 
          l.start.y === box.bottomLeft.y
        );
        
        const leftLine = possibleLines.find(
          (l) => l.type === 'vertical' && 
          l.start.x === box.topLeft.x && 
          l.start.y === box.topLeft.y
        );
        
        // Check if all four lines are drawn
        if (
          topLine?.drawn &&
          rightLine?.drawn &&
          bottomLine?.drawn &&
          leftLine?.drawn
        ) {
          box.owner = currentPlayer;
          setCompletedBoxes((prev) => [...prev, box.id]);
          boxesCompleted++;
        }
      }
    });
    
    setPossibleBoxes(newBoxes);
    
    // Update score
    if (boxesCompleted > 0) {
      setScore((prevScore) => ({
        ...prevScore,
        [`player${currentPlayer}`]: prevScore[`player${currentPlayer}`] + boxesCompleted,
      }));
      
      toast.success(`Player ${currentPlayer} completed ${boxesCompleted} ${boxesCompleted === 1 ? 'box' : 'boxes'}!`);
      return true;
    }
    
    return false;
  };
  
  // Handle line click
  const handleLineClick = (lineId) => {
    if (!gameStarted || gameOver) return;
    
    const newPossibleLines = [...possibleLines];
    const lineIndex = newPossibleLines.findIndex((l) => l.id === lineId);
    
    if (lineIndex === -1 || newPossibleLines[lineIndex].drawn) return;
    
    // Mark the line as drawn
    newPossibleLines[lineIndex].drawn = true;
    newPossibleLines[lineIndex].owner = currentPlayer;
    setPossibleLines(newPossibleLines);
    
    // Check if this line completes any boxes
    const completedAnyBox = checkBoxCompletion(lineId);
    
    // If no box was completed, switch to the other player
    if (!completedAnyBox) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
    
    // Check if game is over (all lines are drawn)
    if (newPossibleLines.every((line) => line.drawn)) {
      const winner = score.player1 > score.player2 ? 1 : score.player1 < score.player2 ? 2 : 0;
      setGameOver(true);
      
      if (winner === 0) {
        toast.info("Game over! It's a tie!");
      } else {
        toast.success(`Game over! Player ${winner} wins!`);
      }
    }
  };
  
  // Calculate cell size based on container size and grid size
  const cellSize = 50; // base cell size
  const gridWidthPixels = cellSize * gridSize;
  
  return (
    <div className="relative">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dots & Boxes</h2>
          <p className="text-surface-600 dark:text-surface-400">
            Connect dots to form boxes and claim territory
          </p>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="btn-outline flex items-center gap-2"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Settings</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>{gameStarted ? "Reset Game" : "Start Game"}</span>
          </motion.button>
        </div>
      </div>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Game Settings</h3>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Grid Size</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="3"
                      max="10"
                      value={gridSize}
                      onChange={(e) => setGridSize(parseInt(e.target.value))}
                      className="w-32 accent-primary"
                    />
                    <span className="bg-surface-200 dark:bg-surface-700 px-3 py-1 rounded font-medium">
                      {gridSize}×{gridSize}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setShowSettings(false);
                    if (!gameStarted) {
                      startGame();
                    }
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <ArrowRightIcon className="w-4 h-4" />
                  <span>Apply & Play</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game Board */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
        <div 
          className="relative bg-white dark:bg-surface-900 rounded-xl shadow-card p-4 md:p-6 border border-surface-200 dark:border-surface-700 overflow-auto"
          style={{ 
            minWidth: gridWidthPixels + 40, 
            minHeight: gridWidthPixels + 40,
            maxWidth: '100%',
            maxHeight: '70vh'
          }}
        >
          {/* Players Turn Indicator */}
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-surface-100 dark:bg-surface-800 rounded-lg text-sm font-medium">
            <span className="mr-2">Current Turn:</span>
            <span 
              className={`px-2 py-0.5 rounded ${
                currentPlayer === 1 
                  ? 'bg-player1 text-white' 
                  : 'bg-player2 text-white'
              }`}
            >
              Player {currentPlayer}
            </span>
          </div>
          
          {/* Grid Container */}
          <div 
            className="relative mx-auto my-10"
            style={{ 
              width: gridWidthPixels, 
              height: gridWidthPixels,
            }}
          >
            {/* Dots */}
            {dots.map((dot, index) => (
              <div
                key={`dot-${dot.x}-${dot.y}`}
                className="dot absolute"
                style={{
                  left: `${dot.x * cellSize}px`,
                  top: `${dot.y * cellSize}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
            
            {/* Lines */}
            {possibleLines.map((line) => {
              const isHorizontal = line.type === 'horizontal';
              const isHovered = hoveredLine === line.id;
              
              // Calculate position and dimensions
              const startX = line.start.x * cellSize;
              const startY = line.start.y * cellSize;
              const endX = line.end.x * cellSize;
              const endY = line.end.y * cellSize;
              
              let width, height, left, top;
              
              if (isHorizontal) {
                width = cellSize;
                height = 12; // Increased hit area
                left = startX;
                top = startY - 6; // Adjusted for the larger hit area
              } else {
                width = 12; // Increased hit area
                height = cellSize;
                left = startX - 6; // Adjusted for the larger hit area
                top = startY; 
              }
              
              return (
                <div
                  key={line.id}
                  className={`
                    ${isHorizontal ? 'game-line-horizontal' : 'game-line-vertical'}
                    ${!line.drawn && 'cursor-pointer hover:bg-primary hover:opacity-70'}
                    ${line.drawn && line.owner === 1 && 'game-line-player1'}
                    ${line.drawn && line.owner === 2 && 'game-line-player2'}
                  `}
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: isHovered && !line.drawn ? 'scale(1.1)' : 'scale(1)',
                    zIndex: isHovered ? 10 : 1,
                  }}
                  onMouseEnter={() => !line.drawn && setHoveredLine(line.id)}
                  onMouseLeave={() => setHoveredLine(null)}
                  onClick={() => !line.drawn && handleLineClick(line.id)}
                />
              );
            })}
            
            {/* Boxes */}
            {possibleBoxes.map((box) => {
              if (!box.owner) return null;
              
              const x = box.topLeft.x * cellSize;
              const y = box.topLeft.y * cellSize;
              
              return (
                <motion.div
                  key={box.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.7 }}
                  className="game-box"
                  style={{
                    left: `${x + 2}px`,
                    top: `${y + 2}px`,
                    width: `${cellSize - 4}px`,
                    height: `${cellSize - 4}px`,
                    backgroundColor: box.owner === 1 ? '#3b82f6' : '#ec4899',
                  }}
                />
              );
            })}
          </div>
          
          {/* Game Over Message */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10"
              >
                <div className="bg-white dark:bg-surface-800 p-6 rounded-xl shadow-lg text-center max-w-xs">
                  <div className="mb-4 text-yellow-500">
                    <TrophyIcon className="w-10 h-10 mx-auto" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">Game Over!</h3>
                  
                  {score.player1 === score.player2 ? (
                    <p className="text-surface-600 dark:text-surface-400 mb-4">It's a tie!</p>
                  ) : (
                    <p className="text-surface-600 dark:text-surface-400 mb-4">
                      Player {score.player1 > score.player2 ? '1' : '2'} wins!
                    </p>
                  )}
                  
                  <button
                    onClick={resetGame}
                    className="btn-primary w-full"
                  >
                    Play Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Scoreboard */}
        <div className="bg-white dark:bg-surface-900 rounded-xl shadow-card p-4 border border-surface-200 dark:border-surface-700 flex-1">
          <h3 className="text-lg font-semibold mb-4">Scoreboard</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-10 bg-player1 rounded-l-md"></div>
              <div className={`flex-1 p-3 rounded-r-md ${currentPlayer === 1 ? 'bg-surface-100 dark:bg-surface-800' : 'bg-white dark:bg-surface-900'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Player 1</span>
                  <span className="text-lg font-bold">{score.player1}</span>
                </div>
                <div className="mt-1 bg-surface-200 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-player1"
                    initial={{ width: '0%' }}
                    animate={{ width: `${possibleBoxes.length > 0 ? (score.player1 / possibleBoxes.length) * 100 : 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-3 h-10 bg-player2 rounded-l-md"></div>
              <div className={`flex-1 p-3 rounded-r-md ${currentPlayer === 2 ? 'bg-surface-100 dark:bg-surface-800' : 'bg-white dark:bg-surface-900'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Player 2</span>
                  <span className="text-lg font-bold">{score.player2}</span>
                </div>
                <div className="mt-1 bg-surface-200 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-player2"
                    initial={{ width: '0%' }}
                    animate={{ width: `${possibleBoxes.length > 0 ? (score.player2 / possibleBoxes.length) * 100 : 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
            <h4 className="font-medium mb-2">How to Play</h4>
            <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-2">
              <li>• Click on a line to claim it</li>
              <li>• Complete a box to earn a point and an extra turn</li>
              <li>• Player with the most boxes at the end wins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;
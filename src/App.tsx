import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GameMenu from './components/GameMenu';
import LetterHunt from './components/Games/LetterHunt';
import ColorHunt from './components/Games/ColorHunt';
import NumberCount from './components/Games/NumberCount';
import ShapeMatch from './components/Games/ShapeMatch';
import BigSmall from './components/Games/BigSmall';
import AnimalSounds from './components/Games/AnimalSounds';
import EmotionMatch from './components/Games/EmotionMatch';
import Opposites from './components/Games/Opposites';
import MemoryCards from './components/Games/MemoryCards';
import BalloonPop from './components/Games/BalloonPop';

export type GameView =
  | 'menu'
  | 'letter'
  | 'color'
  | 'number'
  | 'shape'
  | 'bigsmall'
  | 'animals'
  | 'emotion'
  | 'opposites'
  | 'memory'
  | 'balloon';

export default function App() {
  const [view, setView] = useState<GameView>('menu');
  const [totalScore, setTotalScore] = useState<number>(0);

  const handleGameComplete = (earnedScore: number) => {
    setTotalScore((prev) => prev + earnedScore);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 text-zinc-800 flex flex-col justify-between p-3 sm:p-6 font-sans antialiased">
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <GameMenu
                onSelectGame={(id) => setView(id as GameView)}
                totalScore={totalScore}
              />
            </motion.div>
          )}

          {view === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <LetterHunt
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}

          {view === 'animals' && (
            <motion.div
              key="animals"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <AnimalSounds
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}

          {view === 'emotion' && (
            <motion.div
              key="emotion"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <EmotionMatch
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}

          {view === 'opposites' && (
            <motion.div
              key="opposites"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <Opposites
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}

          {view === 'color' && (
            <motion.div
              key="color"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <ColorHunt
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}

          {view === 'number' && (
            <motion.div
              key="number"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <NumberCount
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}

          {view === 'shape' && (
            <motion.div
              key="shape"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <ShapeMatch
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}

          {view === 'bigsmall' && (
            <motion.div
              key="bigsmall"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <BigSmall
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}

          {view === 'memory' && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <MemoryCards
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}

          {view === 'balloon' && (
            <motion.div
              key="balloon"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <BalloonPop
                onBack={() => setView('menu')}
                onComplete={(score) => handleGameComplete(score)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center py-2 text-xs font-semibold text-zinc-400">
        Mini Oyun Kutusu · Çocuklar İçin Güvenli & Eğitici Ortam
      </footer>
    </div>
  );
}

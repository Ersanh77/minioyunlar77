import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { playPopSound, playVictoryFanfare, isSoundEnabled, setSoundEnabled } from '../../utils/sound';

export interface BalloonPopProps {
  onBack: () => void;
  onComplete?: (score: number) => void;
}

interface Balloon {
  id: number;
  color: string;
  emoji: string;
  x: number;
  speed: number;
}

const BALLOON_COLORS = [
  'bg-rose-400 border-rose-300',
  'bg-amber-400 border-amber-300',
  'bg-emerald-400 border-emerald-300',
  'bg-sky-400 border-sky-300',
  'bg-purple-400 border-purple-300',
  'bg-pink-400 border-pink-300',
];

const BALLOON_EMOJIS = ['🎈', '✨', '⭐', '🍭', '🍓', '🦄'];

export const BalloonPop: React.FC<BalloonPopProps> = ({ onBack, onComplete }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const targetCount = 15;

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const startNewGame = () => {
    setPoppedCount(0);
    setScore(0);
    setTimeLeft(25);
    setIsGameOver(false);
    setBalloons([]);
  };

  // Timer
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsGameOver(true);
          playVictoryFanfare();
          if (onComplete) onComplete(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver, score, onComplete]);

  // Balloon Spawner
  useEffect(() => {
    if (isGameOver) return;
    const spawner = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= 6) return prev;
        const newBalloon: Balloon = {
          id: Date.now() + Math.random(),
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
          emoji: BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)],
          x: Math.floor(Math.random() * 70) + 10,
          speed: Math.random() * 3 + 3,
        };
        return [...prev, newBalloon];
      });
    }, 700);

    return () => clearInterval(spawner);
  }, [isGameOver]);

  const popBalloon = (id: number) => {
    if (isGameOver) return;
    playPopSound();
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setPoppedCount((c) => {
      const nextCount = c + 1;
      if (nextCount >= targetCount) {
        setIsGameOver(true);
        playVictoryFanfare();
        if (onComplete) onComplete(score + 10);
      }
      return nextCount;
    });
    setScore((s) => s + 10);
  };

  const starsCount = poppedCount >= 15 ? 3 : poppedCount >= 10 ? 2 : poppedCount > 0 ? 1 : 0;

  return (
    <div className="relative min-h-[620px] w-full max-w-2xl mx-auto flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-sky-50 via-pink-50 to-amber-50 rounded-3xl shadow-xl border-4 border-sky-200 overflow-hidden select-none">
      {/* Header bar */}
      <header className="relative z-20 flex items-center justify-between gap-2 pb-3 border-b-2 border-sky-200/80">
        <button
          onClick={onBack}
          aria-label="Geri Dön"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 hover:bg-white text-sky-700 font-bold rounded-2xl shadow-sm border-2 border-sky-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-sky-600" />
          <span className="hidden sm:inline text-sm">Menü</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
            Balon Patlatma
          </span>
          <span className="text-xs font-bold text-amber-600">Süre: {timeLeft}s</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 bg-white/90 hover:bg-white text-sky-600 rounded-2xl shadow-sm border-2 border-sky-200 active:scale-95 transition-all cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-zinc-400" />}
          </button>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100/90 text-amber-800 font-black rounded-2xl border-2 border-amber-300 shadow-sm">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            <span className="text-base font-extrabold tabular-nums">{score}</span>
          </div>
        </div>
      </header>

      {/* Floating playfield */}
      {!isGameOver ? (
        <main className="relative z-10 flex-1 w-full h-[400px] overflow-hidden my-2">
          <p className="absolute top-2 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-bold text-sky-600/90 bg-white/80 px-3 py-1 rounded-full border border-sky-200 z-10">
            Balonlara dokun ve patlat! ({poppedCount}/{targetCount})
          </p>

          <AnimatePresence>
            {balloons.map((b) => (
              <motion.button
                key={b.id}
                onClick={() => popBalloon(b.id)}
                initial={{ y: 440, opacity: 0.9, scale: 0.8 }}
                animate={{ y: -80, opacity: 1, scale: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: b.speed, ease: 'linear' }}
                onAnimationComplete={() => {
                  setBalloons((prev) => prev.filter((item) => item.id !== b.id));
                }}
                style={{ left: `${b.x}%` }}
                className={`absolute w-16 h-20 sm:w-20 sm:h-24 rounded-full border-4 shadow-lg flex items-center justify-center cursor-pointer active:scale-90 ${b.color}`}
              >
                <span className="text-2xl sm:text-3xl">{b.emoji}</span>
                {/* Balloon knot */}
                <div className="absolute -bottom-1 w-2.5 h-2.5 bg-inherit border-b-2 border-r-2 rotate-45 rounded-sm" />
              </motion.button>
            ))}
          </AnimatePresence>
        </main>
      ) : (
        /* Victory Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-6 px-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-12 h-12 sm:w-16 sm:h-16 ${
                  starIdx <= starsCount
                    ? 'fill-amber-400 text-amber-500 filter drop-shadow-md'
                    : 'fill-zinc-200 text-zinc-300'
                }`}
              />
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-sky-900 mb-1">
            Harika Patlatmaca! 🎈
          </h2>
          <p className="text-sky-600 font-semibold mb-6">
            Toplam {poppedCount} balon patlatarak {score} puan kazandın!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={startNewGame}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Oyna
            </button>
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-sky-700 font-black text-base rounded-2xl border-2 border-sky-200 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5 text-sky-600" />
              Oyunlar Menüsü
            </button>
          </div>
        </motion.div>
      )}

      <footer className="relative z-10 text-center pt-2 text-xs font-semibold text-sky-500">
        Mini Oyun Kutusu · Çocuklar İçin El-Göz Koordinasyonu
      </footer>
    </div>
  );
};

export default BalloonPop;

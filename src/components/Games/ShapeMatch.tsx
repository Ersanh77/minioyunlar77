import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, RotateCcw, Home, CheckCircle2, XCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playCorrectSound, playWrongSound, playVictoryFanfare, isSoundEnabled, setSoundEnabled } from '../../utils/sound';

export interface ShapeMatchProps {
  onBack: () => void;
  onComplete?: (score: number) => void;
}

interface ShapeOption {
  id: string;
  name: string;
  symbol: string;
  colorClass: string;
  isCorrect: boolean;
}

interface ShapeRound {
  targetName: string;
  symbol: string;
  colorClass: string;
  bgGradient: string;
  options: ShapeOption[];
}

const SHAPE_ROUNDS: ShapeRound[] = [
  {
    targetName: 'Daire',
    symbol: '●',
    colorClass: 'text-amber-500',
    bgGradient: 'from-amber-400 to-orange-500',
    options: [
      { id: 's1_1', name: 'Daire', symbol: '●', colorClass: 'text-amber-500', isCorrect: true },
      { id: 's1_2', name: 'Kare', symbol: '■', colorClass: 'text-blue-500', isCorrect: false },
      { id: 's1_3', name: 'Üçgen', symbol: '▲', colorClass: 'text-emerald-500', isCorrect: false },
      { id: 's1_4', name: 'Yıldız', symbol: '★', colorClass: 'text-purple-500', isCorrect: false },
    ],
  },
  {
    targetName: 'Kare',
    symbol: '■',
    colorClass: 'text-sky-500',
    bgGradient: 'from-sky-400 to-blue-600',
    options: [
      { id: 's2_1', name: 'Kare', symbol: '■', colorClass: 'text-sky-500', isCorrect: true },
      { id: 's2_2', name: 'Kalp', symbol: '♥', colorClass: 'text-rose-500', isCorrect: false },
      { id: 's2_3', name: 'Daire', symbol: '●', colorClass: 'text-amber-500', isCorrect: false },
      { id: 's2_4', name: 'Elmas', symbol: '◆', colorClass: 'text-indigo-500', isCorrect: false },
    ],
  },
  {
    targetName: 'Üçgen',
    symbol: '▲',
    colorClass: 'text-emerald-500',
    bgGradient: 'from-emerald-400 to-teal-600',
    options: [
      { id: 's3_1', name: 'Üçgen', symbol: '▲', colorClass: 'text-emerald-500', isCorrect: true },
      { id: 's3_2', name: 'Yıldız', symbol: '★', colorClass: 'text-amber-500', isCorrect: false },
      { id: 's3_3', name: 'Kare', symbol: '■', colorClass: 'text-sky-500', isCorrect: false },
      { id: 's3_4', name: 'Daire', symbol: '●', colorClass: 'text-rose-500', isCorrect: false },
    ],
  },
  {
    targetName: 'Yıldız',
    symbol: '★',
    colorClass: 'text-yellow-400',
    bgGradient: 'from-amber-400 to-yellow-500',
    options: [
      { id: 's4_1', name: 'Yıldız', symbol: '★', colorClass: 'text-yellow-400', isCorrect: true },
      { id: 's4_2', name: 'Elmas', symbol: '◆', colorClass: 'text-purple-500', isCorrect: false },
      { id: 's4_3', name: 'Kalp', symbol: '♥', colorClass: 'text-pink-500', isCorrect: false },
      { id: 's4_4', name: 'Üçgen', symbol: '▲', colorClass: 'text-emerald-500', isCorrect: false },
    ],
  },
  {
    targetName: 'Kalp',
    symbol: '♥',
    colorClass: 'text-rose-500',
    bgGradient: 'from-rose-400 to-pink-600',
    options: [
      { id: 's5_1', name: 'Kalp', symbol: '♥', colorClass: 'text-rose-500', isCorrect: true },
      { id: 's5_2', name: 'Daire', symbol: '●', colorClass: 'text-blue-500', isCorrect: false },
      { id: 's5_3', name: 'Kare', symbol: '■', colorClass: 'text-amber-500', isCorrect: false },
      { id: 's5_4', name: 'Yıldız', symbol: '★', colorClass: 'text-emerald-500', isCorrect: false },
    ],
  },
  {
    targetName: 'Elmas',
    symbol: '◆',
    colorClass: 'text-purple-500',
    bgGradient: 'from-purple-400 to-indigo-600',
    options: [
      { id: 's6_1', name: 'Elmas', symbol: '◆', colorClass: 'text-purple-500', isCorrect: true },
      { id: 's6_2', name: 'Üçgen', symbol: '▲', colorClass: 'text-emerald-500', isCorrect: false },
      { id: 's6_3', name: 'Daire', symbol: '●', colorClass: 'text-amber-500', isCorrect: false },
      { id: 's6_4', name: 'Kalp', symbol: '♥', colorClass: 'text-rose-500', isCorrect: false },
    ],
  },
  {
    targetName: 'Daire',
    symbol: '●',
    colorClass: 'text-teal-500',
    bgGradient: 'from-teal-400 to-cyan-600',
    options: [
      { id: 's7_1', name: 'Daire', symbol: '●', colorClass: 'text-teal-500', isCorrect: true },
      { id: 's7_2', name: 'Kare', symbol: '■', colorClass: 'text-purple-500', isCorrect: false },
      { id: 's7_3', name: 'Elmas', symbol: '◆', colorClass: 'text-rose-500', isCorrect: false },
      { id: 's7_4', name: 'Üçgen', symbol: '▲', colorClass: 'text-amber-500', isCorrect: false },
    ],
  },
  {
    targetName: 'Kare',
    symbol: '■',
    colorClass: 'text-indigo-500',
    bgGradient: 'from-indigo-400 to-purple-600',
    options: [
      { id: 's8_1', name: 'Kare', symbol: '■', colorClass: 'text-indigo-500', isCorrect: true },
      { id: 's8_2', name: 'Daire', symbol: '●', colorClass: 'text-emerald-500', isCorrect: false },
      { id: 's8_3', name: 'Yıldız', symbol: '★', colorClass: 'text-yellow-400', isCorrect: false },
      { id: 's8_4', name: 'Kalp', symbol: '♥', colorClass: 'text-pink-500', isCorrect: false },
    ],
  },
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const ShapeMatch: React.FC<ShapeMatchProps> = ({ onBack, onComplete }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [floatingPoints, setFloatingPoints] = useState(false);

  const [shuffledOptions, setShuffledOptions] = useState<ShapeOption[]>(() =>
    shuffle(SHAPE_ROUNDS[0].options)
  );

  const activeRound = SHAPE_ROUNDS[currentRound];
  const totalRounds = SHAPE_ROUNDS.length;

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleSelectOption = (option: ShapeOption) => {
    if (selectedOptionId !== null || isGameOver) return;

    setSelectedOptionId(option.id);
    const correct = option.isCorrect;
    setIsAnswerCorrect(correct);

    if (correct) {
      playCorrectSound();
      setScore((s) => s + 15);
      setFloatingPoints(true);
    } else {
      playWrongSound();
    }

    setTimeout(() => {
      setFloatingPoints(false);
      if (currentRound + 1 < totalRounds) {
        const next = currentRound + 1;
        setCurrentRound(next);
        setShuffledOptions(shuffle(SHAPE_ROUNDS[next].options));
        setSelectedOptionId(null);
        setIsAnswerCorrect(null);
      } else {
        const finalScore = score + (correct ? 15 : 0);
        setIsGameOver(true);
        playVictoryFanfare();
        if (onComplete) onComplete(finalScore);
      }
    }, 1100);
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setScore(0);
    setSelectedOptionId(null);
    setIsAnswerCorrect(null);
    setIsGameOver(false);
    setShuffledOptions(shuffle(SHAPE_ROUNDS[0].options));
  };

  const starsCount = score >= 90 ? 3 : score >= 45 ? 2 : score > 0 ? 1 : 0;

  return (
    <div className="relative min-h-[620px] w-full max-w-2xl mx-auto flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-amber-50 via-teal-50 to-emerald-100 rounded-3xl shadow-xl border-4 border-emerald-200 overflow-hidden select-none">
      {/* Background decorations */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-teal-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b-2 border-emerald-200/80">
        <button
          onClick={onBack}
          aria-label="Geri Dön"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 hover:bg-white text-emerald-700 font-bold rounded-2xl shadow-sm border-2 border-emerald-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-600" />
          <span className="hidden sm:inline text-sm">Menü</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
            Tur {currentRound + 1} / {totalRounds}
          </span>
          <div className="flex gap-1.5 mt-1">
            {SHAPE_ROUNDS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentRound
                    ? 'bg-emerald-600 scale-125 ring-2 ring-emerald-300'
                    : idx < currentRound
                    ? 'bg-teal-500'
                    : 'bg-emerald-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 bg-white/90 hover:bg-white text-emerald-600 rounded-2xl shadow-sm border-2 border-emerald-200 active:scale-95 transition-all cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-zinc-400" />}
          </button>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100/90 text-amber-800 font-black rounded-2xl border-2 border-amber-300 shadow-sm">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            <span className="text-base font-extrabold tabular-nums">{score}</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      {!isGameOver ? (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 sm:py-6">
          <div className="relative text-center mb-6">
            <p className="text-sm sm:text-base font-bold text-emerald-700 mb-2">
              Aynı olan şekli bul:
            </p>

            <motion.div
              key={activeRound.targetName + currentRound}
              initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="relative inline-flex flex-col items-center justify-center gap-1 px-8 py-4 bg-white/95 rounded-3xl shadow-lg border-4 border-white min-w-[160px]"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr ${activeRound.bgGradient} shadow-md border-3 border-white flex items-center justify-center text-5xl sm:text-6xl text-white`}
              >
                {activeRound.symbol}
              </div>

              <span className="text-xl sm:text-2xl font-black text-zinc-800 tracking-wide mt-1">
                {activeRound.targetName}
              </span>

              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-2 -right-2 p-1.5 bg-amber-400 rounded-full border-2 border-white shadow"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>

            {/* Floating +15 points popup */}
            <AnimatePresence>
              {floatingPoints && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -35, scale: 1.25 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-4 px-3 py-1 bg-emerald-500 text-white font-black text-sm rounded-full shadow-lg border-2 border-white z-20 flex items-center gap-1"
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  +15 Puan!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4 Choices Grid */}
          <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 max-w-lg">
            {shuffledOptions.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const hasAnswered = selectedOptionId !== null;

              let cardStyle =
                'bg-white/95 text-zinc-800 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/70 hover:scale-[1.02] shadow-md';

              if (hasAnswered) {
                if (isSelected) {
                  cardStyle = opt.isCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-emerald-200 ring-4 ring-emerald-300 scale-105'
                    : 'bg-rose-100 border-rose-500 text-rose-900 shadow-rose-200 ring-4 ring-rose-300 scale-95';
                } else if (opt.isCorrect) {
                  cardStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200';
                } else {
                  cardStyle = 'bg-zinc-100/60 border-zinc-200 text-zinc-400 opacity-60';
                }
              }

              return (
                <motion.button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasAnswered}
                  whileTap={!hasAnswered ? { scale: 0.95 } : {}}
                  className={`relative flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-3 sm:border-4 transition-all duration-200 cursor-pointer ${cardStyle}`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      {opt.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-600 fill-rose-100" />
                      )}
                    </motion.div>
                  )}

                  <span className={`text-4xl sm:text-5xl my-1 ${opt.colorClass} filter drop-shadow-xs`}>
                    {opt.symbol}
                  </span>

                  <span className="mt-2 text-base sm:text-lg font-black tracking-wide text-zinc-800">
                    {opt.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="h-8 mt-4 flex items-center justify-center">
            {selectedOptionId && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm sm:text-base font-extrabold ${
                  isAnswerCorrect ? 'text-emerald-600' : 'text-emerald-800'
                }`}
              >
                {isAnswerCorrect
                  ? 'Aferin! Şekli doğru eşleştirdin! 🔷'
                  : 'Neredeyse oldu! Devam edelim! 🎈'}
              </motion.p>
            )}
          </div>
        </main>
      ) : (
        /* Victory Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-6 px-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((starIdx) => (
              <motion.div
                key={starIdx}
                initial={{ scale: 0, rotate: -30 }}
                animate={{
                  scale: starIdx <= starsCount ? 1 : 0.8,
                  rotate: 0,
                }}
                transition={{ delay: 0.2 + starIdx * 0.15, type: 'spring' }}
              >
                <Star
                  className={`w-12 h-12 sm:w-16 sm:h-16 ${
                    starIdx <= starsCount
                      ? 'fill-amber-400 text-amber-500 filter drop-shadow-md'
                      : 'fill-zinc-200 text-zinc-300'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-emerald-900 mb-1">
            {starsCount === 3
              ? 'Şekil Ustası! 🔷'
              : starsCount >= 2
              ? 'Çok Güzel Eşleştirdin! 🌟'
              : 'Tebrikler! 🎈'}
          </h2>
          <p className="text-emerald-700 font-semibold mb-5 text-sm sm:text-base">
            Tüm şekilleri başarıyla eşleştirdin!
          </p>

          <div className="bg-white/95 rounded-2xl border-3 border-emerald-200 p-4 w-full max-w-xs shadow-md mb-6">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              Toplam Skor
            </div>
            <div className="text-4xl font-black text-emerald-700 tabular-nums">
              {score}{' '}
              <span className="text-xl font-bold text-emerald-400">/ 120</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-300 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Oyna
            </button>
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-emerald-50 text-emerald-700 font-black text-base rounded-2xl border-2 border-emerald-200 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5 text-emerald-600" />
              Oyunlar Menüsü
            </button>
          </div>
        </motion.div>
      )}

      <footer className="relative z-10 text-center pt-2 text-xs font-semibold text-emerald-600">
        Mini Oyun Kutusu · Çocuklar İçin Geometrik Şekiller
      </footer>
    </div>
  );
};

export default ShapeMatch;

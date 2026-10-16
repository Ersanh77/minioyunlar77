import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, RotateCcw, Home, CheckCircle2, XCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playCorrectSound, playWrongSound, playVictoryFanfare, isSoundEnabled, setSoundEnabled } from '../../utils/sound';

export interface NumberCountProps {
  onBack: () => void;
  onComplete?: (score: number) => void;
}

interface NumberOption {
  id: string;
  count: number;
  emoji: string;
  name: string;
  isCorrect: boolean;
}

interface NumberRound {
  targetNumber: number;
  options: NumberOption[];
}

const NUMBER_ROUNDS: NumberRound[] = [
  {
    targetNumber: 3,
    options: [
      { id: 'n1_1', count: 3, emoji: '🍎', name: 'Elma', isCorrect: true },
      { id: 'n1_2', count: 1, emoji: '⭐', name: 'Yıldız', isCorrect: false },
      { id: 'n1_3', count: 5, emoji: '🎈', name: 'Balon', isCorrect: false },
      { id: 'n1_4', count: 2, emoji: '🌸', name: 'Çiçek', isCorrect: false },
    ],
  },
  {
    targetNumber: 5,
    options: [
      { id: 'n2_1', count: 5, emoji: '⭐', name: 'Yıldız', isCorrect: true },
      { id: 'n2_2', count: 3, emoji: '🚗', name: 'Araba', isCorrect: false },
      { id: 'n2_3', count: 4, emoji: '🍓', name: 'Çilek', isCorrect: false },
      { id: 'n2_4', count: 2, emoji: '🐱', name: 'Kedi', isCorrect: false },
    ],
  },
  {
    targetNumber: 2,
    options: [
      { id: 'n3_1', count: 2, emoji: '🎈', name: 'Balon', isCorrect: true },
      { id: 'n3_2', count: 4, emoji: '🍎', name: 'Elma', isCorrect: false },
      { id: 'n3_3', count: 1, emoji: '🍦', name: 'Dondurma', isCorrect: false },
      { id: 'n3_4', count: 3, emoji: '🐶', name: 'Köpek', isCorrect: false },
    ],
  },
  {
    targetNumber: 4,
    options: [
      { id: 'n4_1', count: 4, emoji: '🌸', name: 'Çiçek', isCorrect: true },
      { id: 'n4_2', count: 2, emoji: '🦋', name: 'Kelebek', isCorrect: false },
      { id: 'n4_3', count: 5, emoji: '🍭', name: 'Şeker', isCorrect: false },
      { id: 'n4_4', count: 3, emoji: '🍌', name: 'Muz', isCorrect: false },
    ],
  },
  {
    targetNumber: 1,
    options: [
      { id: 'n5_1', count: 1, emoji: '🌞', name: 'Güneş', isCorrect: true },
      { id: 'n5_2', count: 3, emoji: '🐟', name: 'Balık', isCorrect: false },
      { id: 'n5_3', count: 2, emoji: '🐰', name: 'Tavşan', isCorrect: false },
      { id: 'n5_4', count: 4, emoji: '🍊', name: 'Portakal', isCorrect: false },
    ],
  },
  {
    targetNumber: 6,
    options: [
      { id: 'n6_1', count: 6, emoji: '🍬', name: 'Şeker', isCorrect: true },
      { id: 'n6_2', count: 4, emoji: '🚗', name: 'Araba', isCorrect: false },
      { id: 'n6_3', count: 5, emoji: '🍎', name: 'Elma', isCorrect: false },
      { id: 'n6_4', count: 3, emoji: '🎈', name: 'Balon', isCorrect: false },
    ],
  },
  {
    targetNumber: 7,
    options: [
      { id: 'n7_1', count: 7, emoji: '🍓', name: 'Çilek', isCorrect: true },
      { id: 'n7_2', count: 5, emoji: '⭐', name: 'Yıldız', isCorrect: false },
      { id: 'n7_3', count: 6, emoji: '🌸', name: 'Çiçek', isCorrect: false },
      { id: 'n7_4', count: 4, emoji: '🍩', name: 'Donut', isCorrect: false },
    ],
  },
  {
    targetNumber: 8,
    options: [
      { id: 'n8_1', count: 8, emoji: '⚽', name: 'Top', isCorrect: true },
      { id: 'n8_2', count: 6, emoji: '🍭', name: 'Lolipop', isCorrect: false },
      { id: 'n8_3', count: 7, emoji: '🍎', name: 'Elma', isCorrect: false },
      { id: 'n8_4', count: 5, emoji: '🐥', name: 'Civciv', isCorrect: false },
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

export const NumberCount: React.FC<NumberCountProps> = ({ onBack, onComplete }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [floatingPoints, setFloatingPoints] = useState(false);

  const [shuffledOptions, setShuffledOptions] = useState<NumberOption[]>(() =>
    shuffle(NUMBER_ROUNDS[0].options)
  );

  const activeRound = NUMBER_ROUNDS[currentRound];
  const totalRounds = NUMBER_ROUNDS.length;

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleSelectOption = (option: NumberOption) => {
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
        setShuffledOptions(shuffle(NUMBER_ROUNDS[next].options));
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
    setShuffledOptions(shuffle(NUMBER_ROUNDS[0].options));
  };

  const starsCount = score >= 90 ? 3 : score >= 45 ? 2 : score > 0 ? 1 : 0;

  return (
    <div className="relative min-h-[620px] w-full max-w-2xl mx-auto flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-blue-50 via-indigo-50 to-cyan-100 rounded-3xl shadow-xl border-4 border-blue-200 overflow-hidden select-none">
      {/* Background playful circles */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-blue-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b-2 border-blue-200/80">
        <button
          onClick={onBack}
          aria-label="Geri Dön"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 hover:bg-white text-blue-700 font-bold rounded-2xl shadow-sm border-2 border-blue-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600" />
          <span className="hidden sm:inline text-sm">Menü</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
            Tur {currentRound + 1} / {totalRounds}
          </span>
          <div className="flex gap-1.5 mt-1">
            {NUMBER_ROUNDS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentRound
                    ? 'bg-blue-600 scale-125 ring-2 ring-blue-300'
                    : idx < currentRound
                    ? 'bg-emerald-500'
                    : 'bg-blue-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-2xl shadow-sm border-2 border-blue-200 active:scale-95 transition-all cursor-pointer"
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
            <p className="text-sm sm:text-base font-bold text-blue-600 mb-2">
              Tam bu kadar nesne olan grubu bul:
            </p>

            <motion.div
              key={activeRound.targetNumber}
              initial={{ scale: 0.5, rotate: 10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="relative inline-flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 rounded-3xl shadow-lg shadow-blue-300/60 border-4 border-white"
            >
              <span className="text-6xl sm:text-7xl font-black text-white drop-shadow-md">
                {activeRound.targetNumber}
              </span>

              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
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

          {/* 4 Choices Grid (Groups of emojis) */}
          <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 max-w-lg">
            {shuffledOptions.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const hasAnswered = selectedOptionId !== null;

              let cardStyle =
                'bg-white/95 text-zinc-800 border-blue-200 hover:border-blue-400 hover:bg-blue-50/70 hover:scale-[1.02] shadow-md';

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
                  className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-3 sm:border-4 min-h-[120px] transition-all duration-200 cursor-pointer ${cardStyle}`}
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

                  {/* Emoji Collection with wrapping */}
                  <div className="flex flex-wrap items-center justify-center gap-1 max-w-[140px] my-1">
                    {Array.from({ length: opt.count }).map((_, i) => (
                      <span key={i} className="text-2xl sm:text-3xl filter drop-shadow-xs">
                        {opt.emoji}
                      </span>
                    ))}
                  </div>

                  <span className="mt-1 text-xs sm:text-sm font-bold text-zinc-500">
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
                  isAnswerCorrect ? 'text-emerald-600' : 'text-blue-600'
                }`}
              >
                {isAnswerCorrect
                  ? 'Doğru saydın! Harikasın! 🔢'
                  : 'Neredeyse! Birlikte saymaya devam edelim! 🎈'}
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

          <h2 className="text-2xl sm:text-3xl font-black text-blue-900 mb-1">
            {starsCount === 3
              ? 'Mükemmel Sayıcı! 🔢'
              : starsCount >= 2
              ? 'Çok Güzel Saydın! 🌟'
              : 'Tebrikler! 🎈'}
          </h2>
          <p className="text-blue-600 font-semibold mb-5 text-sm sm:text-base">
            Bütün sayıları başarıyla saydın!
          </p>

          <div className="bg-white/95 rounded-2xl border-3 border-blue-200 p-4 w-full max-w-xs shadow-md mb-6">
            <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
              Toplam Skor
            </div>
            <div className="text-4xl font-black text-blue-700 tabular-nums">
              {score}{' '}
              <span className="text-xl font-bold text-blue-400">/ 120</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base rounded-2xl shadow-lg shadow-blue-300 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Oyna
            </button>
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-blue-50 text-blue-700 font-black text-base rounded-2xl border-2 border-blue-200 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5 text-blue-500" />
              Oyunlar Menüsü
            </button>
          </div>
        </motion.div>
      )}

      <footer className="relative z-10 text-center pt-2 text-xs font-semibold text-blue-400">
        Mini Oyun Kutusu · Çocuklar İçin Sayı Eğitimi
      </footer>
    </div>
  );
};

export default NumberCount;

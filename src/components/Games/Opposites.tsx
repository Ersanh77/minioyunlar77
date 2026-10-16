import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, RotateCcw, Home, CheckCircle2, XCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playCorrectSound, playWrongSound, playVictoryFanfare, isSoundEnabled, setSoundEnabled } from '../../utils/sound';

export interface OppositesProps {
  onBack: () => void;
  onComplete?: (score: number) => void;
}

interface OppositeOption {
  id: string;
  name: string;
  emoji: string;
  isCorrect: boolean;
}

interface OppositeRound {
  targetWord: string;
  targetEmoji: string;
  bgGradient: string;
  options: OppositeOption[];
}

const OPPOSITE_ROUNDS: OppositeRound[] = [
  {
    targetWord: 'Sıcak',
    targetEmoji: '🔥',
    bgGradient: 'from-orange-500 to-red-600',
    options: [
      { id: 'op1_1', name: 'Soğuk', emoji: '❄️', isCorrect: true },
      { id: 'op1_2', name: 'Güneş', emoji: '☀️', isCorrect: false },
      { id: 'op1_3', name: 'Çorba', emoji: '🍲', isCorrect: false },
      { id: 'op1_4', name: 'Ateş', emoji: '🔥', isCorrect: false },
    ],
  },
  {
    targetWord: 'Büyük',
    targetEmoji: '🐘',
    bgGradient: 'from-indigo-500 to-purple-600',
    options: [
      { id: 'op2_1', name: 'Küçük', emoji: '🐜', isCorrect: true },
      { id: 'op2_2', name: 'Kamyon', emoji: '🚚', isCorrect: false },
      { id: 'op2_3', name: 'Dev', emoji: '🗿', isCorrect: false },
      { id: 'op2_4', name: 'Şato', emoji: '🏰', isCorrect: false },
    ],
  },
  {
    targetWord: 'Açık',
    targetEmoji: '🚪',
    bgGradient: 'from-emerald-500 to-teal-600',
    options: [
      { id: 'op3_1', name: 'Kapalı', emoji: '🔒', isCorrect: true },
      { id: 'op3_2', name: 'Pencere', emoji: '🪟', isCorrect: false },
      { id: 'op3_3', name: 'Geniş', emoji: '🛣️', isCorrect: false },
      { id: 'op3_4', name: 'Aydınlık', emoji: '💡', isCorrect: false },
    ],
  },
  {
    targetWord: 'Hızlı',
    targetEmoji: '🏎️',
    bgGradient: 'from-amber-500 to-orange-600',
    options: [
      { id: 'op4_1', name: 'Yavaş', emoji: '🐢', isCorrect: true },
      { id: 'op4_2', name: 'Uçak', emoji: '✈️', isCorrect: false },
      { id: 'op4_3', name: 'Roket', emoji: '🚀', isCorrect: false },
      { id: 'op4_4', name: 'Rüzgar', emoji: '💨', isCorrect: false },
    ],
  },
  {
    targetWord: 'Gündüz',
    targetEmoji: '☀️',
    bgGradient: 'from-sky-400 to-blue-600',
    options: [
      { id: 'op5_1', name: 'Gece', emoji: '🌙', isCorrect: true },
      { id: 'op5_2', name: 'Bulut', emoji: '☁️', isCorrect: false },
      { id: 'op5_3', name: 'Gökkuşağı', emoji: '🌈', isCorrect: false },
      { id: 'op5_4', name: 'Parlak', emoji: '✨', isCorrect: false },
    ],
  },
  {
    targetWord: 'Islak',
    targetEmoji: '🌧️',
    bgGradient: 'from-cyan-500 to-blue-600',
    options: [
      { id: 'op6_1', name: 'Kuru', emoji: '🏜️', isCorrect: true },
      { id: 'op6_2', name: 'Deniz', emoji: '🌊', isCorrect: false },
      { id: 'op6_3', name: 'Su', emoji: '💧', isCorrect: false },
      { id: 'op6_4', name: 'Yağmur', emoji: '☔', isCorrect: false },
    ],
  },
  {
    targetWord: 'Mutlu',
    targetEmoji: '😊',
    bgGradient: 'from-yellow-400 to-amber-500',
    options: [
      { id: 'op7_1', name: 'Üzgün', emoji: '😢', isCorrect: true },
      { id: 'op7_2', name: 'Kahkaha', emoji: '😄', isCorrect: false },
      { id: 'op7_3', name: 'Neşe', emoji: '🎉', isCorrect: false },
      { id: 'op7_4', name: 'Şeker', emoji: '🍭', isCorrect: false },
    ],
  },
  {
    targetWord: 'Ağır',
    targetEmoji: '🏋️',
    bgGradient: 'from-zinc-600 to-zinc-800',
    options: [
      { id: 'op8_1', name: 'Hafif', emoji: '🪶', isCorrect: true },
      { id: 'op8_2', name: 'Taş', emoji: '🪨', isCorrect: false },
      { id: 'op8_3', name: 'Demir', emoji: '🧱', isCorrect: false },
      { id: 'op8_4', name: 'Fil', emoji: '🐘', isCorrect: false },
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

export const Opposites: React.FC<OppositesProps> = ({ onBack, onComplete }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [floatingPoints, setFloatingPoints] = useState(false);

  const [shuffledOptions, setShuffledOptions] = useState<OppositeOption[]>(() =>
    shuffle(OPPOSITE_ROUNDS[0].options)
  );

  const activeRound = OPPOSITE_ROUNDS[currentRound];
  const totalRounds = OPPOSITE_ROUNDS.length;

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleSelectOption = (option: OppositeOption) => {
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
        setShuffledOptions(shuffle(OPPOSITE_ROUNDS[next].options));
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
    setShuffledOptions(shuffle(OPPOSITE_ROUNDS[0].options));
  };

  const starsCount = score >= 90 ? 3 : score >= 45 ? 2 : score > 0 ? 1 : 0;

  return (
    <div className="relative min-h-[620px] w-full max-w-2xl mx-auto flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-100 rounded-3xl shadow-xl border-4 border-indigo-200 overflow-hidden select-none">
      {/* Background bubbles */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b-2 border-indigo-200/80">
        <button
          onClick={onBack}
          aria-label="Geri Dön"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 hover:bg-white text-indigo-700 font-bold rounded-2xl shadow-sm border-2 border-indigo-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-indigo-600" />
          <span className="hidden sm:inline text-sm">Menü</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
            Tur {currentRound + 1} / {totalRounds}
          </span>
          <div className="flex gap-1.5 mt-1">
            {OPPOSITE_ROUNDS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentRound
                    ? 'bg-indigo-600 scale-125 ring-2 ring-indigo-300'
                    : idx < currentRound
                    ? 'bg-emerald-500'
                    : 'bg-indigo-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 bg-white/90 hover:bg-white text-indigo-600 rounded-2xl shadow-sm border-2 border-indigo-200 active:scale-95 transition-all cursor-pointer"
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
            <p className="text-sm sm:text-base font-bold text-indigo-700 mb-2">
              Bunun tam <span className="underline decoration-indigo-400 font-black">ZITTINI</span> bul:
            </p>

            <motion.div
              key={activeRound.targetWord + currentRound}
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="relative inline-flex flex-col items-center justify-center gap-2 px-8 py-4 bg-white/95 rounded-3xl shadow-lg border-4 border-white min-w-[170px]"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr ${activeRound.bgGradient} shadow-md border-3 border-white flex items-center justify-center text-5xl sm:text-6xl text-white`}
              >
                {activeRound.targetEmoji}
              </div>

              <span className="text-xl sm:text-2xl font-black text-zinc-800 tracking-wide">
                {activeRound.targetWord}
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
                'bg-white/95 text-zinc-800 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/70 hover:scale-[1.02] shadow-md';

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

                  <span className="text-5xl sm:text-6xl my-1 filter drop-shadow-sm transition-transform group-hover:scale-110">
                    {opt.emoji}
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
                  isAnswerCorrect ? 'text-emerald-600' : 'text-indigo-800'
                }`}
              >
                {isAnswerCorrect
                  ? 'Harika! Zıt anlamlısını doğru bildin! ⚡'
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

          <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 mb-1">
            {starsCount === 3
              ? 'Zıt Anlam Ustası! ⚡'
              : starsCount >= 2
              ? 'Çok Güzel Başardın! 🌟'
              : 'Tebrikler! 🎈'}
          </h2>
          <p className="text-indigo-700 font-semibold mb-5 text-sm sm:text-base">
            Tüm zıt kavramları başarıyla buldun!
          </p>

          <div className="bg-white/95 rounded-2xl border-3 border-indigo-200 p-4 w-full max-w-xs shadow-md mb-6">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              Toplam Skor
            </div>
            <div className="text-4xl font-black text-indigo-700 tabular-nums">
              {score}{' '}
              <span className="text-xl font-bold text-indigo-400">/ 120</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-base rounded-2xl shadow-lg shadow-indigo-300 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Oyna
            </button>
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-indigo-50 text-indigo-700 font-black text-base rounded-2xl border-2 border-indigo-200 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5 text-indigo-600" />
              Oyunlar Menüsü
            </button>
          </div>
        </motion.div>
      )}

      <footer className="relative z-10 text-center pt-2 text-xs font-semibold text-indigo-600">
        Mini Oyun Kutusu · Çocuklar İçin Zıt Kavramlar
      </footer>
    </div>
  );
};

export default Opposites;

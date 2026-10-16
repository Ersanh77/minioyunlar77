import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, RotateCcw, Home, CheckCircle2, XCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playCorrectSound, playWrongSound, playVictoryFanfare, isSoundEnabled, setSoundEnabled } from '../../utils/sound';

export interface LetterHuntProps {
  onBack: () => void;
  onComplete?: (score: number) => void;
}

interface OptionItem {
  id: string;
  name: string;
  emoji: string;
  isCorrect: boolean;
  startsLetter: string;
}

interface RoundData {
  letter: string;
  options: OptionItem[];
}

// 8 turluk harf avı verileri (Kullanıcının Türkçe harf verileri ile uyumlu)
const ROUNDS_DATA: RoundData[] = [
  {
    letter: 'A',
    options: [
      { id: 'a1', name: 'Araba', emoji: '🚗', isCorrect: true, startsLetter: 'A' },
      { id: 'a2', name: 'Elma', emoji: '🍎', isCorrect: false, startsLetter: 'E' },
      { id: 'a3', name: 'Kelebek', emoji: '🦋', isCorrect: false, startsLetter: 'K' },
      { id: 'a4', name: 'Muz', emoji: '🍌', isCorrect: false, startsLetter: 'M' },
    ],
  },
  {
    letter: 'B',
    options: [
      { id: 'b1', name: 'Balon', emoji: '🎈', isCorrect: true, startsLetter: 'B' },
      { id: 'b2', name: 'Muz', emoji: '🍌', isCorrect: false, startsLetter: 'M' },
      { id: 'b3', name: 'Kelebek', emoji: '🦋', isCorrect: false, startsLetter: 'K' },
      { id: 'b4', name: 'Ayı', emoji: '🐻', isCorrect: false, startsLetter: 'A' },
    ],
  },
  {
    letter: 'C',
    options: [
      { id: 'c1', name: 'Civciv', emoji: '🐥', isCorrect: true, startsLetter: 'C' },
      { id: 'c2', name: 'Kedi', emoji: '🐱', isCorrect: false, startsLetter: 'K' },
      { id: 'c3', name: 'Çiçek', emoji: '🌸', isCorrect: false, startsLetter: 'Ç' },
      { id: 'c4', name: 'Kurabiye', emoji: '🍪', isCorrect: false, startsLetter: 'K' },
    ],
  },
  {
    letter: 'D',
    options: [
      { id: 'd1', name: 'Donut', emoji: '🍩', isCorrect: true, startsLetter: 'D' },
      { id: 'd2', name: 'Köpek', emoji: '🐶', isCorrect: false, startsLetter: 'K' },
      { id: 'd3', name: 'Yunus', emoji: '🐬', isCorrect: false, startsLetter: 'Y' },
      { id: 'd4', name: 'Ayı', emoji: '🐻', isCorrect: false, startsLetter: 'A' },
    ],
  },
  {
    letter: 'E',
    options: [
      { id: 'e1', name: 'Ev', emoji: '🏠', isCorrect: true, startsLetter: 'E' },
      { id: 'e2', name: 'Fil', emoji: '🐘', isCorrect: false, startsLetter: 'F' },
      { id: 'e3', name: 'Yumurta', emoji: '🥚', isCorrect: false, startsLetter: 'Y' },
      { id: 'e4', name: 'Kuş', emoji: '🐦', isCorrect: false, startsLetter: 'K' },
    ],
  },
  {
    letter: 'K',
    options: [
      { id: 'k1', name: 'Kedi', emoji: '🐱', isCorrect: true, startsLetter: 'K' },
      { id: 'k2', name: 'Anahtar', emoji: '🔑', isCorrect: false, startsLetter: 'A' },
      { id: 'k3', name: 'Taç', emoji: '👑', isCorrect: false, startsLetter: 'T' },
      { id: 'k4', name: 'Yunus', emoji: '🐬', isCorrect: false, startsLetter: 'Y' },
    ],
  },
  {
    letter: 'M',
    options: [
      { id: 'm1', name: 'Maymun', emoji: '🐵', isCorrect: true, startsLetter: 'M' },
      { id: 'm2', name: 'Ay', emoji: '🌙', isCorrect: false, startsLetter: 'A' },
      { id: 'm3', name: 'Fare', emoji: '🐭', isCorrect: false, startsLetter: 'F' },
      { id: 'm4', name: 'Ağaç', emoji: '🌳', isCorrect: false, startsLetter: 'A' },
    ],
  },
  {
    letter: 'S',
    options: [
      { id: 's1', name: 'Sincap', emoji: '🐿️', isCorrect: true, startsLetter: 'S' },
      { id: 's2', name: 'Güneş', emoji: '☀️', isCorrect: false, startsLetter: 'G' },
      { id: 's3', name: 'Yıldız', emoji: '⭐', isCorrect: false, startsLetter: 'Y' },
      { id: 's4', name: 'Çilek', emoji: '🍓', isCorrect: false, startsLetter: 'Ç' },
    ],
  },
];

// Helper to shuffle options array for each round
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const LetterHunt: React.FC<LetterHuntProps> = ({ onBack, onComplete }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [floatingPoints, setFloatingPoints] = useState(false);

  // Shuffled options for current round
  const [shuffledOptions, setShuffledOptions] = useState<OptionItem[]>(() =>
    shuffleArray(ROUNDS_DATA[0].options)
  );

  const activeRound = ROUNDS_DATA[currentRound];
  const totalRounds = ROUNDS_DATA.length;

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleSelectOption = (option: OptionItem) => {
    if (selectedOptionId !== null || isGameOver) return; // Prevent double clicks

    setSelectedOptionId(option.id);
    const correct = option.isCorrect;
    setIsAnswerCorrect(correct);

    if (correct) {
      playCorrectSound();
      setScore((prev) => prev + 15);
      setFloatingPoints(true);
    } else {
      playWrongSound();
    }

    // Wait a brief moment to show feedback (green check or red X), then advance
    setTimeout(() => {
      setFloatingPoints(false);
      if (currentRound + 1 < totalRounds) {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setShuffledOptions(shuffleArray(ROUNDS_DATA[nextRound].options));
        setSelectedOptionId(null);
        setIsAnswerCorrect(null);
      } else {
        const finalScore = score + (correct ? 15 : 0);
        setIsGameOver(true);
        playVictoryFanfare();
        if (onComplete) {
          onComplete(finalScore);
        }
      }
    }, 1100);
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setScore(0);
    setSelectedOptionId(null);
    setIsAnswerCorrect(null);
    setIsGameOver(false);
    setShuffledOptions(shuffleArray(ROUNDS_DATA[0].options));
  };

  // Calculate stars earned
  const starsCount = score >= 90 ? 3 : score >= 45 ? 2 : score > 0 ? 1 : 0;

  return (
    <div className="relative min-h-[620px] w-full max-w-2xl mx-auto flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-violet-50 via-purple-50 to-indigo-100 rounded-3xl shadow-xl border-4 border-violet-200 overflow-hidden select-none">
      {/* Background playful bubbles */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-violet-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-fuchsia-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b-2 border-violet-200/80">
        <button
          onClick={onBack}
          aria-label="Geri Dön"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 hover:bg-white text-violet-700 font-bold rounded-2xl shadow-sm border-2 border-violet-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-violet-600" />
          <span className="hidden sm:inline text-sm">Menü</span>
        </button>

        {/* Round Progress indicator */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-violet-600">
            Tur {currentRound + 1} / {totalRounds}
          </span>
          <div className="flex gap-1.5 mt-1">
            {ROUNDS_DATA.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentRound
                    ? 'bg-violet-600 scale-125 ring-2 ring-violet-300'
                    : idx < currentRound
                    ? 'bg-emerald-500'
                    : 'bg-violet-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Score & Sound toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 bg-white/90 hover:bg-white text-violet-600 rounded-2xl shadow-sm border-2 border-violet-200 active:scale-95 transition-all cursor-pointer"
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
          {/* Target Letter Section */}
          <div className="relative text-center mb-6">
            <p className="text-sm sm:text-base font-bold text-violet-600 mb-2">
              Bu harfle başlayan resmi bul:
            </p>

            <motion.div
              key={activeRound.letter}
              initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="relative inline-flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-tr from-violet-600 via-purple-600 to-fuchsia-500 rounded-3xl shadow-lg shadow-violet-300/60 border-4 border-white"
            >
              <span className="text-6xl sm:text-7xl font-black text-white drop-shadow-md tracking-wider">
                {activeRound.letter}
              </span>

              {/* Floating sparkles badge */}
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

          {/* 4 Choices Grid (Emoji + Turkish Name) */}
          <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 max-w-lg">
            {shuffledOptions.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const hasAnswered = selectedOptionId !== null;

              let cardStyle =
                'bg-white/95 text-zinc-800 border-violet-200 hover:border-violet-400 hover:bg-violet-50/70 hover:scale-[1.02] shadow-md';

              if (hasAnswered) {
                if (isSelected) {
                  cardStyle = opt.isCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-emerald-200 ring-4 ring-emerald-300 scale-105'
                    : 'bg-rose-100 border-rose-500 text-rose-900 shadow-rose-200 ring-4 ring-rose-300 scale-95';
                } else if (opt.isCorrect) {
                  // Reveal correct answer gently
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
                  {/* Status Indicator Icon */}
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

                  {/* Big Friendly Emoji */}
                  <span className="text-4xl sm:text-5xl my-1 filter drop-shadow-sm transition-transform group-hover:scale-110">
                    {opt.emoji}
                  </span>

                  {/* Turkish Name with highlighted first letter */}
                  <div className="mt-2 text-base sm:text-lg font-black tracking-wide text-center">
                    <span className="text-violet-600 underline underline-offset-4 decoration-2 decoration-violet-400">
                      {opt.name.charAt(0)}
                    </span>
                    <span>{opt.name.slice(1)}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Gentle feedback banner */}
          <div className="h-8 mt-4 flex items-center justify-center">
            {selectedOptionId && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm sm:text-base font-extrabold ${
                  isAnswerCorrect ? 'text-emerald-600' : 'text-violet-600'
                }`}
              >
                {isAnswerCorrect
                  ? 'Harika! Doğru bildin! 🌟'
                  : 'Neredeyse! Bir sonrakine devam edelim! 🎈'}
              </motion.p>
            )}
          </div>
        </main>
      ) : (
        /* Game Over / Victory Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-6 px-4"
        >
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 350,
                  y: (Math.random() - 0.7) * 350,
                  scale: Math.random() * 1.5 + 0.5,
                  opacity: 0,
                }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.1 }}
                className={`absolute w-3 h-3 rounded-full ${
                  ['bg-amber-400', 'bg-violet-500', 'bg-pink-400', 'bg-emerald-400', 'bg-sky-400'][
                    i % 5
                  ]
                }`}
              />
            ))}
          </div>

          {/* Victory Icon / Stars */}
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

          <h2 className="text-2xl sm:text-3xl font-black text-violet-900 mb-1">
            {starsCount === 3
              ? 'Mükemmel Harf Avcısı! 🏆'
              : starsCount >= 2
              ? 'Çok Güzel Başardın! 🌟'
              : 'Tebrikler! 🎈'}
          </h2>
          <p className="text-violet-600 font-semibold mb-5 text-sm sm:text-base">
            Bütün harfleri başarıyla tamamladın!
          </p>

          {/* Score Box */}
          <div className="bg-white/95 rounded-2xl border-3 border-violet-200 p-4 w-full max-w-xs shadow-md mb-6">
            <div className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-1">
              Toplam Skor
            </div>
            <div className="text-4xl font-black text-violet-700 tabular-nums">
              {score}{' '}
              <span className="text-xl font-bold text-violet-400">/ 120</span>
            </div>
          </div>

          {/* Action Buttons: Tekrar Oyna & Oyunlar Menüsü */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-black text-base rounded-2xl shadow-lg shadow-violet-300 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Oyna
            </button>

            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-violet-50 text-violet-700 font-black text-base rounded-2xl border-2 border-violet-200 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5 text-violet-500" />
              Oyunlar Menüsü
            </button>
          </div>
        </motion.div>
      )}

      {/* Footer hint */}
      <footer className="relative z-10 text-center pt-2 text-xs font-semibold text-violet-400">
        Mini Oyun Kutusu · Çocuklar İçin Harf Eğitimi
      </footer>
    </div>
  );
};

export default LetterHunt;

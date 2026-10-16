import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, RotateCcw, Home, CheckCircle2, XCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playCorrectSound, playWrongSound, playVictoryFanfare, isSoundEnabled, setSoundEnabled } from '../../utils/sound';

export interface EmotionMatchProps {
  onBack: () => void;
  onComplete?: (score: number) => void;
}

interface EmotionOption {
  id: string;
  name: string;
  emoji: string;
  isCorrect: boolean;
}

interface EmotionRound {
  targetName: string;
  emoji: string;
  bgGradient: string;
  options: EmotionOption[];
}

const EMOTION_ROUNDS: EmotionRound[] = [
  {
    targetName: 'Mutlu',
    emoji: '😊',
    bgGradient: 'from-amber-400 to-yellow-500',
    options: [
      { id: 'e1_1', name: 'Mutlu', emoji: '😊', isCorrect: true },
      { id: 'e1_2', name: 'Üzgün', emoji: '😢', isCorrect: false },
      { id: 'e1_3', name: 'Kızgın', emoji: '😠', isCorrect: false },
      { id: 'e1_4', name: 'Şaşkın', emoji: '😲', isCorrect: false },
    ],
  },
  {
    targetName: 'Üzgün',
    emoji: '😢',
    bgGradient: 'from-blue-400 to-indigo-500',
    options: [
      { id: 'e2_1', name: 'Üzgün', emoji: '😢', isCorrect: true },
      { id: 'e2_2', name: 'Mutlu', emoji: '😊', isCorrect: false },
      { id: 'e2_3', name: 'Korkmuş', emoji: '😨', isCorrect: false },
      { id: 'e2_4', name: 'Kızgın', emoji: '😠', isCorrect: false },
    ],
  },
  {
    targetName: 'Kızgın',
    emoji: '😠',
    bgGradient: 'from-rose-500 to-red-600',
    options: [
      { id: 'e3_1', name: 'Kızgın', emoji: '😠', isCorrect: true },
      { id: 'e3_2', name: 'Şaşkın', emoji: '😲', isCorrect: false },
      { id: 'e3_3', name: 'Mutlu', emoji: '😊', isCorrect: false },
      { id: 'e3_4', name: 'Uykulu', emoji: '😴', isCorrect: false },
    ],
  },
  {
    targetName: 'Şaşkın',
    emoji: '😲',
    bgGradient: 'from-purple-400 to-fuchsia-600',
    options: [
      { id: 'e4_1', name: 'Şaşkın', emoji: '😲', isCorrect: true },
      { id: 'e4_2', name: 'Korkmuş', emoji: '😨', isCorrect: false },
      { id: 'e4_3', name: 'Üzgün', emoji: '😢', isCorrect: false },
      { id: 'e4_4', name: 'Mutlu', emoji: '😊', isCorrect: false },
    ],
  },
  {
    targetName: 'Korkmuş',
    emoji: '😨',
    bgGradient: 'from-teal-400 to-cyan-600',
    options: [
      { id: 'e5_1', name: 'Korkmuş', emoji: '😨', isCorrect: true },
      { id: 'e5_2', name: 'Kızgın', emoji: '😠', isCorrect: false },
      { id: 'e5_3', name: 'Şaşkın', emoji: '😲', isCorrect: false },
      { id: 'e5_4', name: 'Neşeli', emoji: '😄', isCorrect: false },
    ],
  },
  {
    targetName: 'Neşeli',
    emoji: '😄',
    bgGradient: 'from-emerald-400 to-green-500',
    options: [
      { id: 'e6_1', name: 'Neşeli', emoji: '😄', isCorrect: true },
      { id: 'e6_2', name: 'Üzgün', emoji: '😢', isCorrect: false },
      { id: 'e6_3', name: 'Korkmuş', emoji: '😨', isCorrect: false },
      { id: 'e6_4', name: 'Kızgın', emoji: '😠', isCorrect: false },
    ],
  },
  {
    targetName: 'Uykulu',
    emoji: '😴',
    bgGradient: 'from-indigo-400 to-sky-600',
    options: [
      { id: 'e7_1', name: 'Uykulu', emoji: '😴', isCorrect: true },
      { id: 'e7_2', name: 'Şaşkın', emoji: '😲', isCorrect: false },
      { id: 'e7_3', name: 'Mutlu', emoji: '😊', isCorrect: false },
      { id: 'e7_4', name: 'Korkmuş', emoji: '😨', isCorrect: false },
    ],
  },
  {
    targetName: 'Sevgi Dolu',
    emoji: '🥰',
    bgGradient: 'from-pink-400 to-rose-500',
    options: [
      { id: 'e8_1', name: 'Sevgi Dolu', emoji: '🥰', isCorrect: true },
      { id: 'e8_2', name: 'Üzgün', emoji: '😢', isCorrect: false },
      { id: 'e8_3', name: 'Kızgın', emoji: '😠', isCorrect: false },
      { id: 'e8_4', name: 'Uykulu', emoji: '😴', isCorrect: false },
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

export const EmotionMatch: React.FC<EmotionMatchProps> = ({ onBack, onComplete }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [floatingPoints, setFloatingPoints] = useState(false);

  const [shuffledOptions, setShuffledOptions] = useState<EmotionOption[]>(() =>
    shuffle(EMOTION_ROUNDS[0].options)
  );

  const activeRound = EMOTION_ROUNDS[currentRound];
  const totalRounds = EMOTION_ROUNDS.length;

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleSelectOption = (option: EmotionOption) => {
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
        setShuffledOptions(shuffle(EMOTION_ROUNDS[next].options));
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
    setShuffledOptions(shuffle(EMOTION_ROUNDS[0].options));
  };

  const starsCount = score >= 90 ? 3 : score >= 45 ? 2 : score > 0 ? 1 : 0;

  return (
    <div className="relative min-h-[620px] w-full max-w-2xl mx-auto flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-100 rounded-3xl shadow-xl border-4 border-yellow-200 overflow-hidden select-none">
      {/* Background decorations */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-yellow-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-pink-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b-2 border-yellow-200/80">
        <button
          onClick={onBack}
          aria-label="Geri Dön"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 hover:bg-white text-amber-700 font-bold rounded-2xl shadow-sm border-2 border-amber-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-amber-600" />
          <span className="hidden sm:inline text-sm">Menü</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
            Tur {currentRound + 1} / {totalRounds}
          </span>
          <div className="flex gap-1.5 mt-1">
            {EMOTION_ROUNDS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentRound
                    ? 'bg-amber-600 scale-125 ring-2 ring-amber-300'
                    : idx < currentRound
                    ? 'bg-emerald-500'
                    : 'bg-amber-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 bg-white/90 hover:bg-white text-amber-600 rounded-2xl shadow-sm border-2 border-amber-200 active:scale-95 transition-all cursor-pointer"
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
            <p className="text-sm sm:text-base font-bold text-amber-700 mb-2">
              Aynı duygu yüzünü bul:
            </p>

            <motion.div
              key={activeRound.targetName + currentRound}
              initial={{ scale: 0.5, rotate: 10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="relative inline-flex flex-col items-center justify-center gap-2 px-8 py-4 bg-white/95 rounded-3xl shadow-lg border-4 border-white min-w-[170px]"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr ${activeRound.bgGradient} shadow-md border-3 border-white flex items-center justify-center text-5xl sm:text-6xl text-white`}
              >
                {activeRound.emoji}
              </div>

              <span className="text-xl sm:text-2xl font-black text-zinc-800 tracking-wide">
                {activeRound.targetName}
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

          {/* 4 Choices Grid */}
          <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 max-w-lg">
            {shuffledOptions.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const hasAnswered = selectedOptionId !== null;

              let cardStyle =
                'bg-white/95 text-zinc-800 border-amber-200 hover:border-amber-400 hover:bg-amber-50/70 hover:scale-[1.02] shadow-md';

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
                  isAnswerCorrect ? 'text-emerald-600' : 'text-amber-800'
                }`}
              >
                {isAnswerCorrect
                  ? 'Aferin! Duyguyu çok iyi tanıdın! 😊'
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

          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mb-1">
            {starsCount === 3
              ? 'Duygu Rehberi! 😊'
              : starsCount >= 2
              ? 'Çok Güzel Eşleştirdin! 🌟'
              : 'Tebrikler! 🎈'}
          </h2>
          <p className="text-amber-700 font-semibold mb-5 text-sm sm:text-base">
            Tüm duygu yüzlerini başarıyla tanıdın!
          </p>

          <div className="bg-white/95 rounded-2xl border-3 border-amber-200 p-4 w-full max-w-xs shadow-md mb-6">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              Toplam Skor
            </div>
            <div className="text-4xl font-black text-amber-700 tabular-nums">
              {score}{' '}
              <span className="text-xl font-bold text-amber-400">/ 120</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black text-base rounded-2xl shadow-lg shadow-amber-300 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Oyna
            </button>
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-amber-50 text-amber-700 font-black text-base rounded-2xl border-2 border-amber-200 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5 text-amber-600" />
              Oyunlar Menüsü
            </button>
          </div>
        </motion.div>
      )}

      <footer className="relative z-10 text-center pt-2 text-xs font-semibold text-amber-600">
        Mini Oyun Kutusu · Çocuklar İçin Duygu Eğitimi
      </footer>
    </div>
  );
};

export default EmotionMatch;

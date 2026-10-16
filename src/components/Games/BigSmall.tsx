import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, RotateCcw, Home, CheckCircle2, XCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playCorrectSound, playWrongSound, playVictoryFanfare, isSoundEnabled, setSoundEnabled } from '../../utils/sound';

export interface BigSmallProps {
  onBack: () => void;
  onComplete?: (score: number) => void;
}

interface ItemPair {
  id: string;
  name: string;
  emoji: string;
  isBig: boolean;
}

interface BigSmallRound {
  questionType: 'big' | 'small';
  questionText: string;
  items: [ItemPair, ItemPair];
}

const BIG_SMALL_ROUNDS: BigSmallRound[] = [
  {
    questionType: 'big',
    questionText: 'Hangisi daha BÜYÜK?',
    items: [
      { id: 'bs1_1', name: 'Fil', emoji: '🐘', isBig: true },
      { id: 'bs1_2', name: 'Karınca', emoji: '🐜', isBig: false },
    ],
  },
  {
    questionType: 'small',
    questionText: 'Hangisi daha KÜÇÜK?',
    items: [
      { id: 'bs2_1', name: 'Zürafa', emoji: '🦒', isBig: true },
      { id: 'bs2_2', name: 'Civciv', emoji: '🐥', isBig: false },
    ],
  },
  {
    questionType: 'big',
    questionText: 'Hangisi daha BÜYÜK?',
    items: [
      { id: 'bs3_1', name: 'Kamyon', emoji: '🚚', isBig: true },
      { id: 'bs3_2', name: 'Bisiklet', emoji: '🚲', isBig: false },
    ],
  },
  {
    questionType: 'small',
    questionText: 'Hangisi daha KÜÇÜK?',
    items: [
      { id: 'bs4_1', name: 'Karpuz', emoji: '🍉', isBig: true },
      { id: 'bs4_2', name: 'Çilek', emoji: '🍓', isBig: false },
    ],
  },
  {
    questionType: 'big',
    questionText: 'Hangisi daha BÜYÜK?',
    items: [
      { id: 'bs5_1', name: 'Şato', emoji: '🏰', isBig: true },
      { id: 'bs5_2', name: 'Çadır', emoji: '⛺', isBig: false },
    ],
  },
  {
    questionType: 'small',
    questionText: 'Hangisi daha KÜÇÜK?',
    items: [
      { id: 'bs6_1', name: 'Ayı', emoji: '🐻', isBig: true },
      { id: 'bs6_2', name: 'Uğur Böceği', emoji: '🐞', isBig: false },
    ],
  },
  {
    questionType: 'big',
    questionText: 'Hangisi daha BÜYÜK?',
    items: [
      { id: 'bs7_1', name: 'Uçak', emoji: '✈️', isBig: true },
      { id: 'bs7_2', name: 'Uçurtma', emoji: '🪁', isBig: false },
    ],
  },
  {
    questionType: 'small',
    questionText: 'Hangisi daha KÜÇÜK?',
    items: [
      { id: 'bs8_1', name: 'Balina', emoji: '🐋', isBig: true },
      { id: 'bs8_2', name: 'Balık', emoji: '🐠', isBig: false },
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

export const BigSmall: React.FC<BigSmallProps> = ({ onBack, onComplete }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [floatingPoints, setFloatingPoints] = useState(false);

  const [shuffledPair, setShuffledPair] = useState<ItemPair[]>(() =>
    shuffle(BIG_SMALL_ROUNDS[0].items)
  );

  const activeRound = BIG_SMALL_ROUNDS[currentRound];
  const totalRounds = BIG_SMALL_ROUNDS.length;

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleSelectItem = (item: ItemPair) => {
    if (selectedItemId !== null || isGameOver) return;

    setSelectedItemId(item.id);
    const correct =
      (activeRound.questionType === 'big' && item.isBig) ||
      (activeRound.questionType === 'small' && !item.isBig);

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
        setShuffledPair(shuffle(BIG_SMALL_ROUNDS[next].items));
        setSelectedItemId(null);
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
    setSelectedItemId(null);
    setIsAnswerCorrect(null);
    setIsGameOver(false);
    setShuffledPair(shuffle(BIG_SMALL_ROUNDS[0].items));
  };

  const starsCount = score >= 90 ? 3 : score >= 45 ? 2 : score > 0 ? 1 : 0;

  return (
    <div className="relative min-h-[620px] w-full max-w-2xl mx-auto flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-100 rounded-3xl shadow-xl border-4 border-orange-200 overflow-hidden select-none">
      {/* Background decorations */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-orange-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-yellow-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b-2 border-orange-200/80">
        <button
          onClick={onBack}
          aria-label="Geri Dön"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 hover:bg-white text-orange-700 font-bold rounded-2xl shadow-sm border-2 border-orange-200 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-orange-600" />
          <span className="hidden sm:inline text-sm">Menü</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-700">
            Tur {currentRound + 1} / {totalRounds}
          </span>
          <div className="flex gap-1.5 mt-1">
            {BIG_SMALL_ROUNDS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentRound
                    ? 'bg-orange-600 scale-125 ring-2 ring-orange-300'
                    : idx < currentRound
                    ? 'bg-emerald-500'
                    : 'bg-orange-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 bg-white/90 hover:bg-white text-orange-600 rounded-2xl shadow-sm border-2 border-orange-200 active:scale-95 transition-all cursor-pointer"
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
            <motion.div
              key={activeRound.questionText + currentRound}
              initial={{ scale: 0.8, y: -10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/95 rounded-3xl shadow-lg border-4 border-orange-300"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-2xl sm:text-3xl font-black text-orange-950 tracking-wide">
                {activeRound.questionText}
              </span>
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

          {/* Two Large Comparison Cards side-by-side */}
          <div className="w-full grid grid-cols-2 gap-4 sm:gap-6 max-w-lg">
            {shuffledPair.map((item) => {
              const isSelected = selectedItemId === item.id;
              const hasAnswered = selectedItemId !== null;

              const isThisCorrect =
                (activeRound.questionType === 'big' && item.isBig) ||
                (activeRound.questionType === 'small' && !item.isBig);

              let cardStyle =
                'bg-white/95 text-zinc-800 border-orange-200 hover:border-orange-400 hover:bg-orange-50/70 hover:scale-[1.02] shadow-lg';

              if (hasAnswered) {
                if (isSelected) {
                  cardStyle = isThisCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-emerald-200 ring-4 ring-emerald-300 scale-105'
                    : 'bg-rose-100 border-rose-500 text-rose-900 shadow-rose-200 ring-4 ring-rose-300 scale-95';
                } else if (isThisCorrect) {
                  cardStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200';
                } else {
                  cardStyle = 'bg-zinc-100/60 border-zinc-200 text-zinc-400 opacity-60';
                }
              }

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  disabled={hasAnswered}
                  whileTap={!hasAnswered ? { scale: 0.95 } : {}}
                  className={`relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl border-4 h-56 sm:h-64 transition-all duration-200 cursor-pointer ${cardStyle}`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      {isThisCorrect ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <XCircle className="w-7 h-7 text-rose-600 fill-rose-100" />
                      )}
                    </motion.div>
                  )}

                  {/* Size visualization: Big item is noticeably larger */}
                  <div className="flex-1 flex items-center justify-center">
                    <span
                      className={`filter drop-shadow-md transition-transform ${
                        item.isBig ? 'text-7xl sm:text-8xl scale-125' : 'text-4xl sm:text-5xl scale-90'
                      }`}
                    >
                      {item.emoji}
                    </span>
                  </div>

                  <span className="mt-2 text-lg sm:text-xl font-black tracking-wide text-zinc-800">
                    {item.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="h-8 mt-4 flex items-center justify-center">
            {selectedItemId && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm sm:text-base font-extrabold ${
                  isAnswerCorrect ? 'text-emerald-600' : 'text-orange-700'
                }`}
              >
                {isAnswerCorrect
                  ? 'Harika! Boyutları çok iyi anladın! 📏'
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

          <h2 className="text-2xl sm:text-3xl font-black text-orange-950 mb-1">
            {starsCount === 3
              ? 'Boyut Uzmanı! 🐘'
              : starsCount >= 2
              ? 'Çok Güzel Başardın! 🌟'
              : 'Tebrikler! 🎈'}
          </h2>
          <p className="text-orange-700 font-semibold mb-5 text-sm sm:text-base">
            Büyük ve küçük nesneleri başarıyla ayırt ettin!
          </p>

          <div className="bg-white/95 rounded-2xl border-3 border-orange-200 p-4 w-full max-w-xs shadow-md mb-6">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              Toplam Skor
            </div>
            <div className="text-4xl font-black text-orange-700 tabular-nums">
              {score}{' '}
              <span className="text-xl font-bold text-orange-400">/ 120</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-base rounded-2xl shadow-lg shadow-orange-300 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Oyna
            </button>
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-orange-50 text-orange-700 font-black text-base rounded-2xl border-2 border-orange-200 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5 text-orange-600" />
              Oyunlar Menüsü
            </button>
          </div>
        </motion.div>
      )}

      <footer className="relative z-10 text-center pt-2 text-xs font-semibold text-orange-500">
        Mini Oyun Kutusu · Çocuklar İçin Boyut Karşılaştırma
      </footer>
    </div>
  );
};

export default BigSmall;

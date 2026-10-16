import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, RotateCcw, Home, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { playCardFlipSound, playCorrectSound, playVictoryFanfare, isSoundEnabled, setSoundEnabled } from '../../utils/sound';

export interface MemoryCardsProps {
  onBack: () => void;
  onComplete?: (score: number) => void;
}

interface CardItem {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_DATA = [
  { emoji: '🐶', name: 'Köpek' },
  { emoji: '🐱', name: 'Kedi' },
  { emoji: '🐰', name: 'Tavşan' },
  { emoji: '🐻', name: 'Ayı' },
  { emoji: '🦁', name: 'Aslan' },
  { emoji: '🐼', name: 'Panda' },
];

export const MemoryCards: React.FC<MemoryCardsProps> = ({ onBack, onComplete }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const initGame = () => {
    const duplicated = [...CARD_DATA, ...CARD_DATA].map((item, index) => ({
      id: index,
      emoji: item.emoji,
      name: item.name,
      isFlipped: false,
      isMatched: false,
    }));

    // Shuffle
    for (let i = duplicated.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [duplicated[i], duplicated[j]] = [duplicated[j], duplicated[i]];
    }

    setCards(duplicated);
    setFlippedIndices([]);
    setMoves(0);
    setScore(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleCardClick = (index: number) => {
    if (
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedIndices.length === 2 ||
      isGameOver
    ) {
      return;
    }

    playCardFlipSound();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [idx1, idx2] = newFlipped;

      if (cards[idx1].emoji === cards[idx2].emoji) {
        // Match!
        playCorrectSound();
        setScore((s) => s + 20);
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[idx1].isMatched = true;
            updated[idx2].isMatched = true;

            const allMatched = updated.every((c) => c.isMatched);
            if (allMatched) {
              setIsGameOver(true);
              playVictoryFanfare();
              if (onComplete) onComplete(score + 20);
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => {
            const reset = [...prev];
            reset[idx1].isFlipped = false;
            reset[idx2].isFlipped = false;
            return reset;
          });
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const starsCount = moves <= 8 ? 3 : moves <= 12 ? 2 : 1;

  return (
    <div className="relative min-h-[620px] w-full max-w-2xl mx-auto flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-100 rounded-3xl shadow-xl border-4 border-emerald-200 overflow-hidden select-none">
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
            Hafıza Kartları
          </span>
          <span className="text-xs font-bold text-emerald-600">Hamle: {moves}</span>
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

      {/* Main Grid */}
      {!isGameOver ? (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
          <p className="text-sm sm:text-base font-bold text-emerald-700 mb-4 text-center">
            Aynı olan iki sevimli hayvanı eşleştir! 🐾
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-md">
            {cards.map((card, idx) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl sm:rounded-3xl border-3 flex flex-col items-center justify-center text-3xl sm:text-4xl shadow-md transition-all duration-300 cursor-pointer ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white border-emerald-400 scale-100 rotate-0'
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-white text-white hover:brightness-105'
                } ${card.isMatched ? 'opacity-80 ring-2 ring-emerald-300' : ''}`}
              >
                {card.isFlipped || card.isMatched ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="filter drop-shadow-sm"
                  >
                    {card.emoji}
                  </motion.span>
                ) : (
                  <Sparkles className="w-7 h-7 text-emerald-100" />
                )}
              </motion.button>
            ))}
          </div>
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

          <h2 className="text-2xl sm:text-3xl font-black text-emerald-900 mb-1">
            Harika Hafıza! 🐾
          </h2>
          <p className="text-emerald-600 font-semibold mb-6">
            Bütün kartları {moves} hamlede eşleştirdin!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={initGame}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Oyna
            </button>
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-emerald-700 font-black text-base rounded-2xl border-2 border-emerald-200 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-5 h-5 text-emerald-600" />
              Oyunlar Menüsü
            </button>
          </div>
        </motion.div>
      )}

      <footer className="relative z-10 text-center pt-2 text-xs font-semibold text-emerald-500">
        Mini Oyun Kutusu · Çocuklar İçin Görsel Hafıza
      </footer>
    </div>
  );
};

export default MemoryCards;

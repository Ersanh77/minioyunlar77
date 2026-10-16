import React from 'react';
import { motion } from 'motion/react';
import { Star, Sparkles, Play, Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled } from '../utils/sound';

export interface GameItem {
  id: string;
  name: string;
  desc: string;
  badge?: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  shadowColor: string;
}

export interface GameMenuProps {
  onSelectGame: (gameId: string) => void;
  totalScore: number;
}

export const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame, totalScore }) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Games list as requested
  const games: GameItem[] = [
    {
      id: 'letter',
      name: 'Harf Avı',
      desc: 'Harfle başlayan resmi bul!',
      badge: '🔤 Harfler',
      icon: '🔤',
      color: 'text-violet-700',
      bgGradient: 'from-violet-500 via-purple-600 to-indigo-600',
      borderColor: 'border-violet-300',
      shadowColor: 'shadow-violet-200',
    },
    {
      id: 'animals',
      name: 'Hayvan Sesleri',
      desc: 'Sesi dinle, hayvanı bul!',
      badge: '🔊 Yeni!',
      icon: '🐾',
      color: 'text-teal-700',
      bgGradient: 'from-teal-500 via-emerald-600 to-cyan-600',
      borderColor: 'border-teal-300',
      shadowColor: 'shadow-teal-200',
    },
    {
      id: 'emotion',
      name: 'Duygu Yüzleri',
      desc: 'Aynı duygu ifadesini bul!',
      badge: '😊 Duygular',
      icon: '😊',
      color: 'text-amber-700',
      bgGradient: 'from-amber-400 via-yellow-500 to-orange-500',
      borderColor: 'border-amber-300',
      shadowColor: 'shadow-amber-200',
    },
    {
      id: 'opposites',
      name: 'Zıt Kavramlar',
      desc: 'Kavramın zıttını bul!',
      badge: '⚡ Zıtlar',
      icon: '❄️',
      color: 'text-indigo-700',
      bgGradient: 'from-indigo-500 via-purple-600 to-pink-600',
      borderColor: 'border-indigo-300',
      shadowColor: 'shadow-indigo-200',
    },
    {
      id: 'color',
      name: 'Renk Avı',
      desc: 'Doğru renkteki nesneyi bul!',
      badge: '🎨 Renkli',
      icon: '🎨',
      color: 'text-rose-700',
      bgGradient: 'from-rose-500 via-pink-600 to-amber-500',
      borderColor: 'border-rose-300',
      shadowColor: 'shadow-rose-200',
    },
    {
      id: 'number',
      name: 'Sayı Sayma',
      desc: 'Sayı kadar nesneyi bul!',
      badge: '🔢 Sayılar',
      icon: '🔢',
      color: 'text-blue-700',
      bgGradient: 'from-blue-500 via-indigo-600 to-cyan-500',
      borderColor: 'border-blue-300',
      shadowColor: 'shadow-blue-200',
    },
    {
      id: 'shape',
      name: 'Şekil Eşleştir',
      desc: 'Aynı geometrik şekli bul!',
      badge: '🔷 Şekiller',
      icon: '🔷',
      color: 'text-emerald-700',
      bgGradient: 'from-emerald-500 via-teal-600 to-teal-700',
      borderColor: 'border-emerald-300',
      shadowColor: 'shadow-emerald-200',
    },
    {
      id: 'bigsmall',
      name: 'Büyük-Küçük',
      desc: 'Hangisi daha büyük veya küçük?',
      badge: '📏 Boyutlar',
      icon: '🐘',
      color: 'text-orange-700',
      bgGradient: 'from-orange-500 via-amber-600 to-yellow-500',
      borderColor: 'border-orange-300',
      shadowColor: 'shadow-orange-200',
    },
    {
      id: 'memory',
      name: 'Hafıza Kartları',
      desc: 'Sevimli hayvanları eşleştir!',
      badge: '🐾 Eğitici',
      icon: '🐱',
      color: 'text-emerald-700',
      bgGradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      borderColor: 'border-emerald-300',
      shadowColor: 'shadow-emerald-200',
    },
    {
      id: 'balloon',
      name: 'Balon Patlatma',
      desc: 'Uçuşan renkli balonları yakala!',
      badge: '🎈 Eğlenceli',
      icon: '🎈',
      color: 'text-sky-700',
      bgGradient: 'from-sky-500 via-blue-600 to-indigo-500',
      borderColor: 'border-sky-300',
      shadowColor: 'shadow-sky-200',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between px-3 py-2 mb-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-amber-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-xl shadow-sm">
            🎮
          </div>
          <span className="font-black text-amber-900 text-sm sm:text-base">Mini Oyun Kutusu</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-xl border border-zinc-200 active:scale-95 transition-all cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-violet-600" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 font-extrabold rounded-xl border border-amber-300 shadow-xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="text-sm font-black tabular-nums">{totalScore}</span>
          </div>
        </div>
      </header>

      {/* Hero Welcome Title */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 mb-2 bg-violet-100 text-violet-700 font-extrabold text-xs sm:text-sm rounded-full border border-violet-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span>3-7 Yaş Eğitici Çocuk Oyunları</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
          Oyununu Seç ve Başla! 🚀
        </h1>
        <p className="text-zinc-600 font-semibold text-sm sm:text-base mt-1.5 max-w-lg mx-auto">
          Harfler, renkler, sayılar, şekiller ve daha fazlasını eğlenerek öğren!
        </p>
      </div>

      {/* Game Cards List */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {games.map((game, idx) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame(game.id)}
            className="group relative flex flex-col justify-between p-5 bg-white rounded-3xl border-3 border-zinc-200 hover:border-violet-400 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
          >
            {/* Top Badge */}
            {game.badge && (
              <div className="absolute top-3.5 right-3.5">
                <span className="px-2.5 py-1 bg-violet-100 text-violet-800 text-xs font-black rounded-full border border-violet-200 shadow-xs">
                  {game.badge}
                </span>
              </div>
            )}

            {/* Icon Avatar */}
            <div className="mb-4">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${game.bgGradient} flex items-center justify-center text-3xl shadow-md text-white border-2 border-white/50 group-hover:rotate-6 transition-transform`}
              >
                {game.icon}
              </div>
            </div>

            {/* Game Info */}
            <div className="mb-4">
              <h2 className="text-xl font-black text-zinc-900 group-hover:text-violet-700 transition-colors">
                {game.name}
              </h2>
              <p className="text-zinc-500 font-medium text-xs sm:text-sm mt-1 leading-relaxed">
                {game.desc}
              </p>
            </div>

            {/* Action Button */}
            <button
              type="button"
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-extrabold text-sm shadow-sm bg-gradient-to-r ${game.bgGradient} group-hover:brightness-105 active:scale-95 transition-all cursor-pointer`}
            >
              <Play className="w-4 h-4 fill-white" />
              Oyna
            </button>
          </motion.div>
        ))}
      </div>

      {/* Cheerful Feature Highlights */}
      <div className="mt-8 flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-xs font-bold text-zinc-400">
        <span>⭐ Yıldızları topla</span>
        <span>•</span>
        <span>🎈 Balonları patlat</span>
        <span>•</span>
        <span>🔤 Harfleri öğren</span>
        <span>•</span>
        <span>🎨 Renkleri keşfet</span>
      </div>

      {/* Production Footer Badge */}
      <footer className="mt-4 px-4 py-2 bg-white/70 backdrop-blur-xs rounded-full border border-amber-200/80 shadow-2xs text-xs font-extrabold text-amber-900/80">
        Mini Oyun Kutusu • 3-7 Yaş • Güvenli & Eğitici Ortam
      </footer>
    </div>
  );
};

export default GameMenu;

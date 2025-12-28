'use client';

import { motion } from 'framer-motion';

export default function WelcomeScreen({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      {/* 로고 */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-bold mb-4"
        style={{
          background: 'linear-gradient(135deg, #D4BBFF 0%, #A8D8FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        나다움
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-purple-400 text-sm mb-12"
      >
        Daily Ritual for Your True Self
      </motion.p>

      {/* 연도 전환 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="text-4xl md:text-5xl font-light text-pink-300">2025</span>
        <span className="text-3xl text-gray-300">―</span>
        <span className="text-4xl md:text-5xl font-bold text-blue-400">2026</span>
      </motion.div>

      {/* 설명 텍스트 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-12 space-y-1"
      >
        <p className="text-gray-600">지난 한 해를 돌아보고</p>
        <p className="text-gray-600">새로운 나를 발견하는 시간</p>
      </motion.div>

      {/* 시작 버튼 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNext({})}
        className="px-12 py-4 bg-white/80 backdrop-blur-sm text-purple-500 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        시작하기
      </motion.button>

      {/* 스크롤 힌트 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-sm text-gray-400"
      >
        Scroll to explore ↓
      </motion.p>
    </div>
  );
}

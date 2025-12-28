'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountdownTransition() {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* 감사 메시지 */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-medium text-gray-700 mb-12"
        >
          알겠습니다 🙏
        </motion.p>

        {/* 카운트다운 숫자 */}
        <div className="relative h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.2, 1], 
                opacity: [0, 1, 1],
                rotate: [0, 0, 0]
              }}
              exit={{ 
                scale: 0, 
                opacity: 0,
                rotate: 180
              }}
              transition={{ 
                duration: 0.6,
                times: [0, 0.6, 1]
              }}
              className="absolute"
            >
              <span className="text-8xl font-bold bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {count}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 안내 메시지 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 mt-12"
        >
          다른 질문으로 넘어가볼게요
        </motion.p>
      </motion.div>

      {/* 배경 펄스 효과 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"
        style={{ width: '300px', height: '300px', margin: 'auto' }}
      />
    </div>
  );
}

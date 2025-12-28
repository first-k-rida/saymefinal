'use client';

import { motion } from 'framer-motion';

export default function CompletionScreen({ answers }) {
  const handleStartDaily = () => {
    // 실제로는 다음 페이지로 이동
    console.log('일주일 챌린지 시작');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      {/* 완료 아이콘 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-2xl">
          <span className="text-5xl">✨</span>
        </div>
      </motion.div>

      {/* 완료 메시지 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          2025년 회고를
          <br />
          완료하셨습니다!
        </h1>
        <p className="text-gray-600 leading-relaxed">
          당신의 소중한 이야기를
          <br />
          잘 정리해주셨어요
        </p>
      </motion.div>

      {/* 다음 단계 안내 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl"
      >
        <p className="text-gray-700 leading-relaxed mb-4">
          이제 매일 1개씩
          <br />
          2025년의 사건과 인물,
          <br />
          나의 감정을 떠올리는
          <br />
          질문들을 드립니다.
        </p>
        <p className="text-sm text-gray-600">
          일주일 후 26년에도 이어갈
          <br />
          나의 생각과 나다움에 대해 점검하실 수 있는
        </p>
      </motion.div>

      {/* 브랜드 메시지 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-12"
      >
        <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          진정한 나를 발견하고 말할 수 있는
          <br />
          <span className="text-xl font-bold">SAY ME SPIRIT LAB</span>을
          <br />
          함께해주세요
        </p>
      </motion.div>

      {/* 시작 버튼 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartDaily}
        className="px-12 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        일주일 챌린지 시작하기
      </motion.button>

      {/* 장식 요소 */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-10 text-4xl opacity-20"
      >
        🌟
      </motion.div>
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-32 left-10 text-3xl opacity-20"
      >
        💫
      </motion.div>
    </div>
  );
}

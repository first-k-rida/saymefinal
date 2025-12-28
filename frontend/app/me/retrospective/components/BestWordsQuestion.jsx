'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BestWordsQuestion({ answers, onNext, onBack }) {
  const [words, setWords] = useState(answers.bestWords || '');
  const [whoAmI, setWhoAmI] = useState(answers.bestWordsWhoAmI || '');
  const [step, setStep] = useState(0); // 0: 말, 1: 의미

  const handleNextStep = () => {
    if (step === 0 && words.trim()) {
      setStep(1);
    } else if (step === 1 && whoAmI.trim()) {
      onNext({
        bestWords: words,
        bestWordsWhoAmI: whoAmI
      });
    }
  };

  const handleBackStep = () => {
    if (step === 1) {
      setStep(0);
    } else {
      onBack();
    }
  };

  const questions = [
    {
      title: '2025년 내가 했던 말 중에서',
      subtitle: '가장 멋있고 나다운 말은 무엇이었나요?',
      value: words,
      onChange: setWords,
      placeholder: '예: "괜찮아, 다시 하면 돼", "이번엔 내가 해볼게", "고마워, 네 덕분이야"...'
    },
    {
      title: '이것은 당신이 어떤 사람이라는 것을',
      subtitle: '나타내주나요?',
      value: whoAmI,
      onChange: setWhoAmI,
      placeholder: '예: 포기하지 않는 사람, 도전을 두려워하지 않는 사람, 감사할 줄 아는 사람...'
    }
  ];

  const currentQ = questions[step];
  const isValid = currentQ.value.trim().length > 0;

  return (
    <div className="py-12 px-6">
      {/* 질문 제목 */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {currentQ.title}
        </h2>
        <p className="text-sm text-gray-500">
          {currentQ.subtitle}
        </p>
      </motion.div>

      {/* 텍스트 입력 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <textarea
          value={currentQ.value}
          onChange={(e) => currentQ.onChange(e.target.value)}
          placeholder={currentQ.placeholder}
          className="w-full h-48 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 resize-none text-gray-700 placeholder:text-gray-400"
          style={{ fontSize: '16px' }}
        />
      </motion.div>

      {/* 버튼 그룹 */}
      <div className="flex gap-3 mt-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackStep}
          className="flex-1 py-4 bg-gray-200 text-gray-600 rounded-full font-medium hover:bg-gray-300 transition-colors"
        >
          이전
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: isValid ? 1.05 : 1 }}
          whileTap={{ scale: isValid ? 0.95 : 1 }}
          onClick={handleNextStep}
          disabled={!isValid}
          className={`
            flex-[2] py-4 rounded-full font-medium transition-all duration-300
            ${isValid
              ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {step === 0 ? '다음' : '완료'}
        </motion.button>
      </div>

      {/* 진행 상태 */}
      <div className="flex justify-center gap-2 mt-6">
        {[0, 1].map((index) => (
          <div
            key={index}
            className={`
              h-1.5 rounded-full transition-all duration-300
              ${index === step ? 'w-8 bg-purple-400' : 'w-2 bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  );
}

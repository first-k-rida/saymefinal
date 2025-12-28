'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const LEVELS = ['상', '중', '하'];

export default function LifeChangeQuestion({ answers, onNext }) {
  const [selections, setSelections] = useState({
    life: answers.lifeChange || null,
    social: answers.socialChange || null,
    inner: answers.innerChange || null
  });

  const questions = [
    { key: 'life', label: '2025년의 내 삶의 변화는 어느정도였나요?' },
    { key: 'social', label: '2025년 나의 외적인 사회적 변화는 어느정도였나요?' },
    { key: 'inner', label: '2025년 나의 내면의 변화는 어느정도였나요?' }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleSelect = (level) => {
    const currentKey = questions[currentQuestion].key;
    const newSelections = { ...selections, [currentKey]: level };
    setSelections(newSelections);

    // 다음 질문으로 자동 이동
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // 마지막 질문 완료 후 다음 단계로
        setTimeout(() => {
          onNext({
            lifeChange: newSelections.life,
            socialChange: newSelections.social,
            innerChange: newSelections.inner
          });
        }, 500);
      }
    }, 400);
  };

  const currentQ = questions[currentQuestion];
  const currentSelection = selections[currentQ.key];

  return (
    <div className="py-12 px-6">
      {/* 질문 제목 */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-12 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {currentQ.label}
        </h2>
        <p className="text-sm text-gray-400">
          {currentQuestion + 1} / {questions.length}
        </p>
      </motion.div>

      {/* 선택지 */}
      <div className="flex flex-col gap-4 mb-8">
        {LEVELS.map((level, index) => {
          const isSelected = currentSelection === level;
          const colors = [
            'from-pink-300 to-pink-400',
            'from-purple-300 to-purple-400',
            'from-blue-300 to-blue-400'
          ];

          return (
            <motion.button
              key={level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(level)}
              className={`
                relative overflow-hidden
                py-6 px-8 rounded-2xl
                bg-gradient-to-r ${colors[index]}
                text-white text-xl font-medium
                shadow-lg transition-all duration-300
                ${isSelected ? 'ring-4 ring-purple-500 ring-offset-2 scale-105' : ''}
              `}
            >
              {level}
              {isSelected && (
                <motion.div
                  layoutId="selected-indicator"
                  className="absolute inset-0 bg-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 진행 상태 점 */}
      <div className="flex justify-center gap-2 mt-8">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`
              h-2 rounded-full transition-all duration-300
              ${index === currentQuestion ? 'w-8 bg-purple-400' : 'w-2 bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  );
}

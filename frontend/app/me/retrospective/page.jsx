'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 단계별 컴포넌트
import WelcomeScreen from './components/WelcomeScreen';
import LifeChangeQuestion from './components/LifeChangeQuestion';
import ReasonQuestion from './components/ReasonQuestion';
import CountdownTransition from './components/CountdownTransition';
import PeopleQuestion from './components/PeopleQuestion';
import EventQuestion from './components/EventQuestion';
import NewBehaviorQuestion from './components/NewBehaviorQuestion';
import BestWordsQuestion from './components/BestWordsQuestion';
import CompletionScreen from './components/CompletionScreen';

export default function Retrospective2025() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    lifeChange: null,
    socialChange: null,
    innerChange: null,
    reason: '',
    firstHalfPeople: '',
    secondHalfPeople: '',
    firstHalfEvent: {
      what: '',
      why: '',
      expectation: '',
      emotion: ''
    },
    secondHalfEvent: {
      what: '',
      why: '',
      expectation: '',
      emotion: ''
    },
    newBehavior: '',
    newBehaviorReason: '',
    bestWords: '',
    bestWordsWhoAmI: ''
  });

  const [showCountdown, setShowCountdown] = useState(false);

  const steps = [
    { component: WelcomeScreen, name: 'welcome' },
    { component: LifeChangeQuestion, name: 'lifeChange' },
    { component: ReasonQuestion, name: 'reason' },
    { component: CountdownTransition, name: 'countdown1' },
    { component: PeopleQuestion, name: 'people' },
    { component: EventQuestion, name: 'event' },
    { component: CountdownTransition, name: 'countdown2' },
    { component: NewBehaviorQuestion, name: 'behavior' },
    { component: BestWordsQuestion, name: 'words' },
    { component: CompletionScreen, name: 'completion' }
  ];

  const handleNext = async (data) => {
    const newAnswers = { ...answers, ...data };
    setAnswers(newAnswers);
    
    // API로 저장
    try {
      // TODO: 실제 userId는 Cognito 인증에서 가져오기
      const userId = 'user-cognito-sub-id'; // 임시 값
      
      await saveRetrospective(userId, newAnswers);
      console.log('✅ 저장 성공!');
    } catch (error) {
      console.error('❌ 저장 실패:', error);
      // 에러가 나도 진행은 계속 (UX 고려)
    }
    
    // 다음 단계로
    if (currentStep === 2 || currentStep === 5) {
      setShowCountdown(true);
      setTimeout(() => {
        setShowCountdown(false);
        setCurrentStep(prev => prev + 1);
      }, 6000); // 5초 카운트 + 1초 전환
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentComponent = steps[currentStep]?.component;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      {/* 파스텔 입자 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 right-20 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl animate-float-delay-1" />
        <div className="absolute bottom-1/4 left-1/4 w-36 h-36 bg-blue-200/20 rounded-full blur-3xl animate-float-delay-2" />
        <div className="absolute bottom-20 right-1/4 w-44 h-44 bg-pink-200/15 rounded-full blur-3xl animate-float" />
      </div>

      {/* 모바일 컨테이너 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {CurrentComponent && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <CurrentComponent
                  answers={answers}
                  onNext={handleNext}
                  onBack={handleBack}
                  currentStep={currentStep}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 진행 상태 표시 (선택사항) */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex gap-2">
            {steps.slice(1, -1).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index < currentStep - 1 ? 'w-8 bg-purple-400' : 'w-2 bg-purple-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
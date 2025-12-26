'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginSuccessPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // localStorage에서 사용자 정보 가져오기
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }

    // 3초 후 자동 이동
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/fortune');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-10 h-10 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              로그인 성공!
            </h1>
            <p className="text-gray-600">
              환영합니다, {userEmail || '사용자'}님
            </p>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              자기성찰 여정이 시작됩니다
            </p>
            <p className="text-sm text-gray-500">
              {countdown}초 후 자동으로 이동합니다...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push('/fortune')}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            바로 시작하기 →
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            다음 단계
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/fortune')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              오늘의 운세
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => router.push('/service-intro')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              서비스 안내
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== DEBUG START ===');
    console.log('Email value:', email);
    console.log('Email length:', email.length);
    
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const requestBody = { email };
    console.log('Request body:', requestBody);
    console.log('Request body JSON:', JSON.stringify(requestBody));

    try {
      const response = await fetch('https://h1l7cj53v9.execute-api.ap-northeast-2.amazonaws.com/dev/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        setMessage('비밀번호 재설정 코드가 이메일로 전송되었습니다.');
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setError(data.error || '비밀번호 재설정 요청 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="py-6 px-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Sayme
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">비밀번호 찾기</h1>
            <p className="text-gray-600">가입하신 이메일 주소를 입력해주세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="example@email.com"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '전송 중...' : '인증 코드 받기'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              로그인으로 돌아가기
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>안내:</strong> 인증 코드는 24시간 동안 유효합니다. 스팸 메일함도 확인해주세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
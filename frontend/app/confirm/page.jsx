'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/signup');
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://h1l7cj53v9.execute-api.ap-northeast-2.amazonaws.com/dev/auth/confirm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            code: code
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '인증에 실패했습니다.');
      }

      alert('이메일 인증이 완료되었습니다! 로그인해주세요.');
      router.push('/login');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="py-6 px-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-indigo-600">Sayme</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">이메일 인증</h1>
            <p className="text-gray-600 mb-4">
              아래 이메일로 인증 코드를 발송했습니다
            </p>
            <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg inline-block">
              {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                인증 코드 (6자리)
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
                disabled={loading}
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                이메일로 받은 6자리 숫자를 입력하세요
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '인증 중...' : '인증하기'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              인증 코드를 받지 못하셨나요?
            </p>
            <button
              onClick={() => alert('인증 코드가 재발송되었습니다.')}
              disabled={resending}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold disabled:text-gray-400"
            >
              {resending ? '발송 중...' : '인증 코드 재발송'}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 안내:</strong> 인증 코드는 24시간 동안 유효합니다.
            스팸 메일함도 확인해주세요.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    } else {
      router.push('/forgot-password');
    }
  }, [searchParams, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validatePassword = () => {
    if (!formData.code || !formData.newPassword || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }

    if (formData.newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return false;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/.test(formData.newPassword)) {
      setError('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://h1l7cj53v9.execute-api.ap-northeast-2.amazonaws.com/dev/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('비밀번호가 성공적으로 변경되었습니다!');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || '비밀번호 재설정 중 오류가 발생했습니다.');
      }
    } catch (err) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">비밀번호 재설정</h1>
            <p className="text-gray-600">이메일로 받은 인증 코드를 입력해주세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                인증 코드 (6자리)
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="123456"
                maxLength={6}
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="8자 이상, 대소문자+숫자+특수문자"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="비밀번호를 다시 입력하세요"
                disabled={loading}
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
              {loading ? '재설정 중...' : '비밀번호 재설정'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => router.push('/forgot-password')}
              className="block w-full text-sm text-gray-600 hover:text-gray-800"
            >
              인증 코드를 받지 못하셨나요?
            </button>
            <button
              onClick={() => router.push('/login')}
              className="block w-full text-sm text-indigo-600 hover:text-indigo-700"
            >
              로그인으로 돌아가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
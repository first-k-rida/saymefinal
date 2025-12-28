'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!accessToken) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('https://h1l7cj53v9.execute-api.ap-northeast-2.amazonaws.com/dev/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
      } else {
        setError('사용자 정보를 불러올 수 없습니다.');
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          router.push('/login');
        }
      }
    } catch (err) {
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userEmail');
    }
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="py-6 px-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Sayme
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">내 정보</h1>
          
          {user && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">이메일</div>
                <div className="col-span-2 text-gray-900">{user.email}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">이름</div>
                <div className="col-span-2 text-gray-900">{user.name || '-'}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">닉네임</div>
                <div className="col-span-2 text-gray-900">{user.nickname || '-'}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">이메일 인증</div>
                <div className="col-span-2">
                  {user.emailVerified ? (
                    <span className="text-green-600">✅ 인증됨</span>
                  ) : (
                    <span className="text-red-600">❌ 미인증</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">생년월일</div>
                <div className="col-span-2 text-gray-900">{user.birthDate || '-'}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">출생 국가</div>
                <div className="col-span-2 text-gray-900">{user.birthCountry || '-'}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">출생 도시</div>
                <div className="col-span-2 text-gray-900">{user.birthCity || '-'}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">마지막 로그인</div>
                <div className="col-span-2 text-gray-900">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('ko-KR') : '-'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">사전 설문</div>
                <div className="col-span-2">
                  {user.preSurveyCompleted ? (
                    <span className="text-green-600">✅ 완료</span>
                  ) : (
                    <span className="text-gray-600">❌ 미완료</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <div className="font-semibold text-gray-700">할인권</div>
                <div className="col-span-2 text-gray-900">{user.discountCount || 0}개</div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3">
                <div className="font-semibold text-gray-700">리마인더</div>
                <div className="col-span-2 text-gray-900">{user.reminderTime || '-'}</div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => router.push('/fortune')}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              오늘의 운세
            </button>
            
            <button
              onClick={handleLogout}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              로그아웃
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ℹ️ <strong>읽기 전용 페이지입니다.</strong> 정보 수정 기능은 추후 추가될 예정입니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="py-4 px-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Sayme</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              로그인
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              시작하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
            월간 자기성찰 챌린지
          </span>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          10일의 질문으로<br />
          <span className="text-indigo-600">한 달을 결산하다</span>
        </h2>

        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          맞춤형 질문과 기록하는 프리미엄 자기성찰 경험.<br />
          나를 이해하고, 성장하며, 감사를 발견하는 시간.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => router.push('/signup')}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg text-lg"
          >
            지금 시작하기 →
          </button>
          <button
            onClick={() => router.push('/fortune')}
            className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors text-lg"
          >
            오늘의 운세 보기
          </button>
        </div>

        <p className="text-sm text-gray-500">
          정시 완주 시 <span className="font-semibold text-indigo-600">10만원 전액 환급</span>
        </p>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-20 bg-white rounded-3xl shadow-xl mb-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-16">
          어떻게 진행되나요?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              15분 개인 상담
            </h4>
            <p className="text-gray-600 leading-relaxed">
              당신의 고민과 관심사를 반영한<br />
              맞춤형 질문을 설계합니다
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              10일간의 챌린지
            </h4>
            <p className="text-gray-600 leading-relaxed">
              매일 하나씩 열리는 질문에<br />
              텍스트 또는 음성으로 답합니다
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              월말 결산 리포트
            </h4>
            <p className="text-gray-600 leading-relaxed">
              당신의 성장과 변화를 담은<br />
              PDF 결산 리포트를 받습니다
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-16">
          특별한 경험
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">✨</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              완전 개인화된 질문
            </h4>
            <p className="text-gray-600 leading-relaxed">
              획일적인 질문이 아닌, 15분 상담을 통해 당신의 상황과 고민에 꼭 맞는 질문을 설계합니다.
              나만을 위한 특별한 자기성찰 시간입니다.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">💰</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              10만원 전액 환급
            </h4>
            <p className="text-gray-600 leading-relaxed">
              10일 중 7개 이상 정시에 완료하면 참가비 10만원을 전액 환급해드립니다.
              다음 달 50% 할인 혜택도 받으세요.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🎙️</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              텍스트 & 음성 입력
            </h4>
            <p className="text-gray-600 leading-relaxed">
              글 쓰기가 어려우신가요? 음성으로 편하게 답해주세요.
              STT 기술로 자동 변환되어 저장됩니다.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">📄</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              프리미엄 결산 리포트
            </h4>
            <p className="text-gray-600 leading-relaxed">
              10일간의 답변을 분석하여 성장 포인트와 하이라이트를 담은
              아름다운 PDF 리포트로 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">
            이번 달 챌린지 시작하기
          </h3>
          <p className="text-indigo-100 mb-8 text-lg">
            12월 1-10일 참여 신청 • 10-20일 챌린지 진행
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="text-5xl font-bold mb-2">200,000원</div>
            <p className="text-indigo-100 text-lg mb-4">
              1개월 챌린지 참가비
            </p>
            <div className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold">
              정시 완주 시 10만원 환급 = 실질 10만원
            </div>
          </div>

          <button
            onClick={() => router.push('/signup')}
            className="w-full sm:w-auto px-12 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg text-lg"
          >
            지금 시작하기 →
          </button>

          <p className="text-indigo-100 text-sm mt-6">
            입금 후 15분 상담 예약 • 상담 완료 후 챌린지 시작
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          지금 시작하는<br className="sm:hidden" /> 나만의 성찰 시간
        </h3>
        <p className="text-xl text-gray-600 mb-10">
          오늘의 운세를 먼저 확인해보세요
        </p>
        <button
          onClick={() => router.push('/fortune')}
          className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg text-lg"
        >
          오늘의 운세 보기 →
        </button>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="text-xl font-bold text-indigo-600 mb-2">Sayme</h4>
              <p className="text-sm text-gray-600">
                월간 자기성찰 챌린지 플랫폼
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">
                © 2024 Sayme. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                spirit-lab.me
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
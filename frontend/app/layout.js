import '../styles/globals.css'  // 전역 CSS 임포트

export const metadata = {
  title: 'Sayme - 월간 자기성찰 챌린지',
  description: '10일의 질문으로 한 달을 결산하는 프리미엄 자기성찰 서비스',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
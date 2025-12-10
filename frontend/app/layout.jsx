// app/layout.jsx

export const metadata = {
  title: "Sayme",
  description: "Monthly self reflection challenge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

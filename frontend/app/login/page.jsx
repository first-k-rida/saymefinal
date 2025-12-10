"use client";

const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI;

// 필요한 scope 들
const SCOPE = "openid email profile";
const RESPONSE_TYPE = "code";

function buildAuthUrl() {
  const url = new URL(`${COGNITO_DOMAIN}/oauth2/authorize`);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", RESPONSE_TYPE);
  url.searchParams.set("scope", SCOPE);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  return url.toString();
}

export default function LoginPage() {
  const handleLogin = () => {
    // Cognito Hosted UI로 이동
    window.location.href = buildAuthUrl();
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 24 }}>Sayme 로그인</h1>
      <button
        onClick={handleLogin}
        style={{
          padding: "12px 24px",
          borderRadius: 8,
          border: "1px solid #333",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Cognito로 로그인
      </button>
    </main>
  );
}

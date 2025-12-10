"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginSuccessPage() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const c = searchParams.get("code");
    if (c) {
      setCode(c);
    }
  }, [searchParams]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        padding: 24,
      }}
    >
      <h1 style={{ marginBottom: 16 }}>로그인 성공 (임시 화면)</h1>

      {code ? (
        <>
          <p style={{ marginBottom: 8 }}>Authorization Code:</p>
          <code
            style={{
              padding: 12,
              background: "#f5f5f5",
              borderRadius: 8,
              maxWidth: 600,
              wordBreak: "break-all",
            }}
          >
            {code}
          </code>
          <p style={{ marginTop: 16, fontSize: 14, color: "#555" }}>
            이 코드는 나중에 백엔드에서 토큰으로 교환할 예정입니다.
          </p>
        </>
      ) : (
        <p>URL에 code 파라미터가 없습니다.</p>
      )}
    </main>
  );
}

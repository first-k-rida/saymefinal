"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: 나중에 Cognito 로그인 로직 추가
    // 지금은 그냥 "로그인 성공" 페이지로만 이동
    router.push("/login/success");
  };

  return (
    <main style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "16px" }}>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: 8 }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: 8 }}
          required
        />

        <button type="submit">로그인</button>
      </form>
    </main>
  );
}

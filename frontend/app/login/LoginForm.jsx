"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("로그인 요청", { email, password });

    // 이후 Cognito 연동 코드 auth.js로 이동 예정
  };

  return (
    <form
      className="bg-white shadow-lg p-8 rounded-lg w-96 space-y-4"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl font-semibold">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded"
      >
        로그인
      </button>
    </form>
  );
}

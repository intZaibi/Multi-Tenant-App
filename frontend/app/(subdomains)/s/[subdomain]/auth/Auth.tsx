"use client";
import LoginForm from "@/components/Login";
import RegisterForm from "@/components/Register";
import { useState } from "react";

export default function AuthPage() {
  const [page, setPage] = useState("login");

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      {page === "login" ? <LoginForm setPage={setPage} /> : <RegisterForm setPage={setPage} />}
    </div>
  );
}
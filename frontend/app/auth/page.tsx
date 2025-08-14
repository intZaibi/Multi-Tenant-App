"use client";
import LoginForm from "@/components/Login";
import React, { useState } from "react";
import RegisterForm from "@/components/Register";

export default function AuthPage() {
  const [page, setPage] = useState("login");

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      {page === "login" ? (
        <LoginForm page={page} setPage={setPage} />
      ) : (
        <RegisterForm page={page} setPage={setPage} />
      )}
    </div>
  );
}

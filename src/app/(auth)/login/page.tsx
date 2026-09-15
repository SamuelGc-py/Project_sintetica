"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.28)] sm:p-8">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Bienvenido de nuevo</p>
          <h1 className="text-3xl font-extrabold text-slate-950">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-slate-600">Ingresa para continuar con la gestión de tu cancha.</p>
        </div>
        <form className="grid gap-5" onSubmit={(event) => event.preventDefault()}>
          <Input label="Correo electrónico" name="email" type="email" autoComplete="email" required />
          <div className="relative">
            <Input label="Contraseña" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword((value) => !value)}
              className="group absolute right-3 top-9 rounded-md p-1 text-slate-500 transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
                {showPassword ? <path d="M3 3l18 18M10.6 10.6a2 2 0 102.8 2.8M9.9 4.2A10.8 10.8 0 0121 12a11.7 11.7 0 01-3.1 4.7M6.2 6.2A11.7 11.7 0 003 12a11.7 11.7 0 003.1 4.7 10.8 10.8 0 0010.8 2.9" /> : <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" /><circle cx="12" cy="12" r="2.5" /></>}
              </svg>
            </button>
          </div>
          <div className="-mt-1 flex justify-end"><Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-900" href="/forgot-password">¿Olvidaste tu contraseña?</Link></div>
          <Button type="submit" className="h-12 w-full bg-emerald-700 font-semibold hover:bg-emerald-800">Entrar</Button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600">¿Aún no tienes cuenta? <Link className="font-bold text-emerald-700 hover:text-emerald-900" href="/register">Crear una cuenta</Link></p>
      </section>
    </main>
  );
}

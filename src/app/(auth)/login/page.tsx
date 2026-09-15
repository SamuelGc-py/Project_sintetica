"use client";

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
              <svg aria-hidden="true" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                {showPassword ? <><path d="M3 3l22 18" /><path d="M11.2 10.4a3 3 0 004.2 4.2" /><path d="M8.1 6.3C5.5 7.5 3.5 9.6 2.2 12c1.9 3.7 5.7 6.5 10.8 6.5 1.8 0 3.4-.4 4.8-1" /><path d="M19.1 15.8c1.5-1 2.7-2.3 3.7-3.8-.8-1.5-1.9-2.8-3.2-3.8" /></> : <><path d="M2.2 12s4-6.4 11.8-6.4S25.8 12 25.8 12s-4 6.4-11.8 6.4S2.2 12 2.2 12z" /><circle cx="14" cy="12" r="3" /><path d="M5.1 7.8l-1.3-1.5M9 5.9l-.5-1.8M14 5.5V3.6M19 5.9l.5-1.8M22.9 7.8l1.3-1.5" /></>}
              </svg>
            </button>
          </div>
          <Button type="submit" className="h-12 w-full bg-emerald-700 font-semibold hover:bg-emerald-800">Entrar</Button>
          <div className="flex items-center justify-between text-sm">
            <a href="/forgot-password" className="font-medium text-emerald-700 transition-colors hover:text-emerald-800">Recuperar contraseña</a>
            <a href="/register" className="font-medium text-emerald-700 transition-colors hover:text-emerald-800">Crear cuenta</a>
          </div>
        </form>
      </section>
    </main>
  );
}

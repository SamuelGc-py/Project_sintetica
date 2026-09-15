"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-emerald-500/30" /><div className="absolute bottom-20 right-12 h-32 w-32 border-r-2 border-t-2 border-emerald-500/50" /><div className="relative text-sm font-bold tracking-[0.24em] text-emerald-400">CANCHA PRO / 01</div><div className="relative max-w-md"><p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Acceso seguro</p><h1 className="text-5xl leading-[0.98] text-white xl:text-6xl">Vuelve a<br />la cancha.</h1><p className="mt-8 max-w-sm text-base leading-7 text-slate-400">Recupera el acceso a tu cuenta con un enlace seguro enviado a tu correo.</p></div><p className="relative text-sm text-slate-500">Administración simple para espacios deportivos.</p></section>
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10"><div className="w-full max-w-md"><div className="mb-10 lg:hidden"><span className="text-sm font-bold tracking-[0.2em] text-emerald-700">CANCHA PRO</span></div><div className="mb-8"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Recuperar acceso</p><h2 className="text-3xl text-slate-950">Recuperar contraseña</h2><p className="mt-2 text-sm text-slate-600">Introduce tu correo y te enviaremos un enlace para crear una nueva contraseña.</p></div>{sent ? <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-900">Si existe una cuenta con ese correo, recibirás un enlace para recuperar tu contraseña.</div> : <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><Input label="Correo electrónico" name="email" type="email" autoComplete="email" required /><Button type="submit" className="h-12 w-full bg-emerald-700 font-semibold hover:bg-emerald-800">Enviar enlace para recuperar contraseña</Button></form>}<Link className="mt-8 block text-center text-sm font-semibold text-emerald-700 hover:text-emerald-900" href="/login">Volver al inicio de sesión</Link></div></section>
    </main>
  );
}

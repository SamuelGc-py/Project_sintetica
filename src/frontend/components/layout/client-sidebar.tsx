"use client";

import Link from "next/link";
import { useState } from "react";

const clientLinks = [
  { href: "/dashboard/reservations", label: "Reservas" },
  { href: "/dashboard/courts", label: "Canchas disponibles" },
  { href: "/dashboard/tournaments", label: "Torneos" }
];

function UserIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <nav aria-label="Navegación principal" className="flex flex-col gap-1">
        {clientLinks.map((link) => (
          <Link
            key={link.href}
            className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 hover:text-emerald-700"
            href={link.href}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link
        className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 hover:text-emerald-700"
        href="/dashboard/settings"
        onClick={onNavigate}
      >
        Ajustes
      </Link>
    </div>
  );
}

export function ClientSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-emerald-800 px-4 text-white md:px-8">
        <button
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          className="rounded-lg p-2 transition-colors hover:bg-emerald-700 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <div className="flex items-center gap-3 md:order-2">
          <div className="relative">
            <button
              aria-expanded={userMenuOpen}
              aria-haspopup="menu"
              aria-label="Abrir menú de usuario"
              className="rounded-full p-2 transition-colors hover:bg-emerald-700"
              onClick={() => setUserMenuOpen((open) => !open)}
              type="button"
            >
              <UserIcon />
            </button>
            {userMenuOpen ? (
              <div className="absolute right-0 top-12 w-48 rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-lg" role="menu">
                <p className="px-3 py-2 font-semibold text-slate-900">Hola, usuario</p>
                <Link className="block rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-emerald-700" href="/dashboard" role="menuitem">Ayuda</Link>
                <button className="block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-100 hover:text-emerald-700" onClick={() => setUserMenuOpen(false)} role="menuitem" type="button">Cerrar sesión</button>
              </div>
            ) : null}
          </div>
        </div>
        <Link className="order-2 text-lg font-extrabold tracking-tight text-white md:order-3" href="/dashboard">
          Project Synthetic
        </Link>
      </header>

      <aside className="fixed right-0 top-16 hidden h-[calc(100vh-4rem)] w-72 border-l border-slate-200 bg-white p-5 md:block">
        <NavigationLinks />
      </aside>

      {mobileOpen ? (
        <>
          <button
            aria-label="Cerrar menú"
            className="fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            type="button"
          />
          <aside className="fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-[min(18rem,85vw)] bg-white p-5 shadow-xl md:hidden">
            <NavigationLinks onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      ) : null}
    </>
  );
}

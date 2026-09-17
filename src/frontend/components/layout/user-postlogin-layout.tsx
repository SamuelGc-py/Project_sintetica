"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Grid,
  Trophy,
  Settings,
  Menu,
  X,
  HelpCircle,
  LogOut,
  ChevronDown,
  Sparkles
} from "lucide-react";

type UserPostLoginLayoutProps = {
  children?: React.ReactNode;
  userName?: string;
  userEmail?: string;
};

export function UserPostLoginLayout({
  children,
  userName = "Carlos Perez",
  userEmail = "carlos@cancha-pro.com"
}: UserPostLoginLayoutProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topNavLinks = [
    { href: "/reservas", label: "Reservas", icon: Calendar },
    { href: "/dashboard/courts", label: "Canchas disponibles", icon: Grid },
    { href: "/dashboard/tournaments", label: "Torneos", icon: Trophy }
  ];

  const bottomNavLinks = [
    { href: "#ajustes", label: "Ajustes", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* 1. HEADER (Banner Superior) */}
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-[#0f382c] px-4 shadow-md sm:px-6">
        
        {/* Left Side: Avatar Button + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-emerald-900/60 focus:outline-none lg:hidden"
            aria-label="Abrir menu mobile"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Avatar Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="group flex items-center gap-2 rounded-full p-1 transition hover:bg-emerald-900/60 focus:outline-none"
            >
              {/* 3D Modern Avatar Icon Badge */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 p-[2px] shadow-lg transition-transform duration-200 group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0f382c] font-bold text-white text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                {/* Online Status Dot */}
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0f382c]" />
              </div>
              <ChevronDown className={`h-4 w-4 text-emerald-200 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu Flotante */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-12 z-50 w-60 rounded-2xl border border-slate-100 bg-white p-2 text-sm font-medium text-slate-700 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="font-semibold text-slate-900">Hola, {userName}</p>
                  <p className="text-xs text-slate-500 font-normal truncate mt-0.5">{userEmail}</p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      alert("Centro de Ayuda y Soporte disponible 24/7");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
                  >
                    <HelpCircle className="h-4 w-4 text-slate-500" />
                    Ayuda
                  </button>
                  <Link
                    href="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    Cerrar sesión
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Logo & Project Name */}
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-montserrat text-lg font-bold tracking-tight text-white sm:text-xl">
            Project Synthetic
          </span>
        </Link>
      </header>

      {/* 2. SIDEBAR (Fijado a la Derecha - Desktop) */}
      <aside className="fixed top-16 right-0 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col justify-between border-l border-slate-200 bg-white p-4 lg:flex">
        {/* Top Group */}
        <div className="grid gap-1">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Navegacion
          </p>
          {topNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-emerald-700"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-slate-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Bottom Group */}
        <div className="border-t border-slate-100 pt-3">
          {bottomNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-emerald-700"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-slate-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* 3. MENU MOBILE (Hamburguesa con Backdrop Translúcido) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay Backdrop Translúcido Obligatorio */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sheet Content */}
          <div className="fixed top-0 right-0 z-50 flex h-full w-72 flex-col justify-between bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="font-montserrat font-bold text-slate-900">Project Synthetic</span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Top Links */}
              <div className="mt-6 grid gap-2">
                {topNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 hover:text-emerald-700"
                    >
                      <Icon className="h-5 w-5 text-slate-500" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Bottom Links */}
            <div className="border-t border-slate-100 pt-4">
              {bottomNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 hover:text-emerald-700"
                  >
                    <Icon className="h-5 w-5 text-slate-500" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. AREA DE CONTENIDO (Espacio Central Izquierdo) */}
      <main className="pt-16 min-h-screen bg-slate-50 p-6 md:p-8 lg:mr-64">
        {children ?? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
              <Grid className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-slate-700">
              Selecciona una opcion del menu.
            </p>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
              Usa el panel lateral para navegar entre Reservas, Canchas disponibles, Torneos o Ajustes.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

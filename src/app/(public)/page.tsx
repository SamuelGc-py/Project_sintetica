import { ButtonLink } from "@/frontend/components/ui/button";
import { MainLayout } from "@/frontend/components/layout/main-layout";

const footerLinks = [
  { href: "#beneficios", label: "Beneficios del sistema" },
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/privacidad", label: "Políticas de privacidad" }
];

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: "ig" },
  { href: "https://facebook.com", label: "Facebook", icon: "f" },
  { href: "https://x.com", label: "X", icon: "x" }
];

export default function HomePage() {
  return (
    <MainLayout>
      <section className="w-full bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            SaaS para Canchas Sintéticas
          </p>
          <h1 className="bg-gradient-to-r from-emerald-800 to-green-500 bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-6xl">
            Cancha Pro
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Plataforma web full-stack conectada a base de datos PostgreSQL para administrar
            reservas en línea, anticipos, torneos, planes y reportes financieros desde un solo lugar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/reservas">Reservar cancha en línea</ButtonLink>
            <ButtonLink href="/admin" variant="secondary">
              Panel Administrador
            </ButtonLink>
          </div>
        </div>
      </section>

      <footer className="w-full bg-slate-900 px-4 py-12 text-slate-300 md:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <p className="text-xl font-bold text-white">Cancha Pro</p>
            <p className="mt-4 max-w-xs text-sm leading-6">
              La plataforma SaaS para administrar reservas y operaciones de canchas sintéticas.
            </p>
          </div>

          <div>
            <h2 className="bg-gradient-to-r from-emerald-800 to-green-500 bg-clip-text font-extrabold text-transparent">Enlaces</h2>
            <nav className="mt-4 flex flex-col gap-3 text-sm" aria-label="Enlaces del footer">
              {footerLinks.map((link) => (
                <a key={link.href} className="transition-colors hover:text-white" href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="bg-gradient-to-r from-emerald-800 to-green-500 bg-clip-text font-extrabold text-transparent">Síguenos</h2>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-sm font-semibold text-slate-300 transition-colors hover:border-white hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="bg-gradient-to-r from-emerald-800 to-green-500 bg-clip-text font-extrabold text-transparent">Soporte</h2>
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Escríbenos en WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}

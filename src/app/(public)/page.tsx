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
      <section className="w-full border-b border-slate-200 bg-slate-50 px-4 py-16 md:px-8 md:py-24">
        <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1fr)_360px] md:gap-20">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              <span className="h-1 w-10 bg-emerald-600" aria-hidden="true" />
              SaaS para canchas sintéticas
            </div>
            <h1 className="max-w-2xl text-5xl font-extrabold leading-[0.98] tracking-[-0.04em] text-emerald-700 md:text-7xl">
              Cancha Pro
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Cancha Pro centraliza reservas, anticipos y torneos para que tu equipo administre cada cancha con claridad y ritmo.
            </p>
          </div>

          <div className="relative overflow-hidden bg-slate-950 p-7 text-white shadow-[12px_12px_0_0_theme(colors.emerald.600)]">
            <div className="absolute right-0 top-0 h-24 w-24 border-b border-l border-emerald-500/40" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Cancha Pro / 01</p>
            <p className="mt-16 max-w-[14rem] text-3xl font-extrabold leading-tight tracking-[-0.03em]">
              Menos agenda. Más cancha.
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Todo listo para el próximo partido
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full bg-slate-900 px-4 py-8 text-slate-300 md:px-12 md:py-10">
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

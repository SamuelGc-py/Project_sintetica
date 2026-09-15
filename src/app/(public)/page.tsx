import { MainLayout } from "@/frontend/components/layout/main-layout";

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: "instagram" },
  { href: "https://facebook.com", label: "Facebook", icon: "facebook" },
  { href: "https://x.com", label: "X", icon: "x" },
  { href: "https://youtube.com", label: "YouTube", icon: "youtube" }
];

const footerLinks = [
  "Beneficios del sistema",
  "Términos y condiciones",
  "Políticas de privacidad"
];

export default function HomePage() {
  return (
    <MainLayout>
      <section className="w-full border-b border-slate-200 bg-slate-50 px-4 py-10 sm:px-6 md:px-8 md:py-12 lg:px-8 lg:py-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 sm:gap-12 md:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] md:gap-12 lg:gap-20">
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

      <footer className="w-full border-t border-slate-800 bg-slate-900 px-6 py-8 text-slate-300 md:px-16 md:py-10">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-3 md:gap-16">
          <div>
            <h2 className="font-extrabold text-white">Enlaces</h2>
            <nav className="mt-4 flex flex-col gap-2" aria-label="Enlaces del footer">
              {footerLinks.map((link) => (
                <a key={link} href="#" className="text-sm text-slate-300 transition-colors hover:text-white">
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="font-extrabold text-white">Síguenos</h2>
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
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {social.icon === "instagram" && (
                      <>
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                      </>
                    )}
                    {social.icon === "facebook" && <path d="M14 8h2V4.5a10 10 0 0 0-3-.5c-3 0-5 1.8-5 5.2V12H5v4h3v8h4v-8h3.2l.8-4H12V9.5c0-1 .3-1.5 1.5-1.5H14Z" fill="currentColor" stroke="none" />}
                    {social.icon === "x" && <path d="m5 4 14 16M19 4 5 20" />}
                    {social.icon === "youtube" && (
                      <>
                        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8Z" />
                        <path d="m10 15 5-3-5-3v6Z" fill="currentColor" stroke="none" />
                      </>
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-extrabold text-white">Soporte</h2>
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noreferrer"
              aria-label="Escríbenos en WhatsApp"
              className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
                <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7a11.8 11.8 0 0 0 5.4 1.3h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.3-6.1-3.5-8.3Zm-8.4 18.1h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 1 1 8.5 4.7Zm5.4-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.6-3.2-.3-.5.3-.5.8-1.6.1-.2.1-.4 0-.6l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.4 5.4 4.8 2 .9 2.8 1 3.8.8.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.2-.3-.3-.6-.4Z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}

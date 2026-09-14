import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cancha Pro",
  description: "SaaS para administrar canchas sinteticas de futbol en Colombia."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

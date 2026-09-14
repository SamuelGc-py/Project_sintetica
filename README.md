# Cancha Pro

Base SaaS para administrar canchas sinteticas de futbol en Colombia.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Servicios preparados para auth, pagos y WhatsApp

## Comandos

```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

Para crear las tablas en PostgreSQL despues de configurar `DATABASE_URL`:

```bash
npm run db:push
```

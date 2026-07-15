# No Pain No Gain ft. Sofi

App personal (mobile-first, PWA) para registrar entrenamientos, asistencia
al gym e hidratación. Next.js + Supabase, tema oscuro con acento magenta.

## Desarrollo local

```bash
npm install
npm run dev
```

Necesita un `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

El esquema de la base de datos está en `supabase/schema.sql`.

## Deploy

Pensado para Vercel (plan gratuito), con las mismas variables de entorno
configuradas ahí.

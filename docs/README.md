# LearningsAI Team

Een teamversie van de persoonlijke AI-leerlog tool. Stelt een klein team in staat om AI-sessies te loggen, learnings te delen en een gezamenlijke prompt-bibliotheek op te bouwen.

## Snel starten

```bash
# 1. Afhankelijkheden installeren
npm install

# 2. Omgevingsvariabelen instellen
cp .env.example .env
# Vul VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY in

# 3. Supabase opzetten
# Volg docs/SUPABASE_SETUP.md

# 4. Type-check uitvoeren
npm run type-check

# 5. Dev server starten
npm run dev
```

## Documentatie

| Document | Beschrijving |
|---|---|
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Stap-voor-stap Supabase configuratie |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Architectuurprincipes en data flow |
| [DATA_MODEL.md](./DATA_MODEL.md) | Alle entiteiten, velden en relaties |

## Fasering

| Fase | Inhoud | Status |
|---|---|---|
| A | Projectstructuur, datamodel, Supabase setup, services | Klaar |
| B | Auth UI, sessie-overzicht en -formulier | In ontwikkeling |
| C | Prompt-bibliotheek, statistieken | Gepland |

## Tech stack

- **React 18** + **TypeScript** (strict)
- **Vite** als build tool
- **Tailwind CSS** voor styling
- **Zustand** voor state management
- **Supabase** (PostgreSQL + Auth)
- **Zod** voor validatie
- **React Hook Form** voor formulieren
- **Netlify** voor deployment

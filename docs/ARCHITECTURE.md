# Architectuur — LearningsAI Team

## Overzicht

LearningsAI Team is een React SPA (Single Page Application) die Supabase als volledige backend gebruikt. Er is geen eigen server — alle logica loopt via de Supabase client in de browser.

```
Browser (React SPA)
  └── Supabase Client (@supabase/supabase-js)
        ├── PostgreSQL (data)
        └── Auth (gebruikersaccounts)
```

## Architectuurprincipes

### Feature-based structuur

Code is georganiseerd per domein (auth, sessions, prompts) in plaats van per type (components, services, stores). Elke feature bevat alles wat nodig is: service, store, schema, utils en (later) UI.

### Data flow

```
UI component
  → Zustand store (useSessionStore, usePromptStore)
    → Service (sessionService, promptService)
      → Supabase client
        → PostgreSQL database
```

Stores beheren loading- en error-state. Services zijn puur asynchroon en kennen geen state. UI communiceert alleen met stores, nooit direct met services.

### Supabase als backend

- **Database**: PostgreSQL via `@supabase/supabase-js`. Queries worden gebouwd met de Supabase Query Builder.
- **Auth**: Supabase Auth met email/password. De `onAuthStateChange` listener in `authStore` zorgt dat de app altijd in sync is met de auth-status.
- **RLS (Row Level Security)**: Beveiliging zit in de database, niet in de frontend. Alle ingelogde gebruikers kunnen elkaars sessies en prompts lezen, maar kunnen alleen hun eigen records aanpassen of verwijderen.

### Auth flow

```
App start
  → authStore.initialize()
    → getCurrentUser() — herstel sessie uit localStorage
    → onAuthStateChange() — luistert naar login/logout events

Gebruiker logt in
  → authStore.signIn(email, password)
    → authService.signIn()
      → supabase.auth.signInWithPassword()
        → onAuthStateChange vuurt → store update
```

### camelCase ↔ snake_case mapping

TypeScript interfaces gebruiken camelCase (`taskDescription`). De database gebruikt snake_case (`task_description`). De mapping gebeurt in de service-laag via `rowToSession()` en `rowToPrompt()` functies — nergens anders.

## Deployment

De app wordt gedeployed op Netlify. `netlify.toml` configureert de build en een catch-all redirect zodat React Router correct werkt voor alle routes.

Omgevingsvariabelen worden ingesteld in de Netlify dashboard onder **Site settings → Environment variables**.

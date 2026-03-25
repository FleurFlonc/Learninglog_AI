# Supabase Setup — LearningsAI Team

## Stap 1: Supabase account aanmaken

Ga naar [supabase.com](https://supabase.com) en maak een gratis account aan.

## Stap 2: Nieuw project aanmaken

1. Klik op **New project**
2. Kies een naam, wachtwoord en regio (bijv. `eu-central-1` voor Europa)
3. Wacht tot het project is aangemaakt (~1 minuut)

## Stap 3: SQL uitvoeren in de SQL Editor

Ga naar **SQL Editor** in het Supabase dashboard en voer de onderstaande SQL uit in volgorde.

### 3a. Tabellen aanmaken

```sql
-- Sessies tabel
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  user_display_name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  task_description text not null,
  status text not null check (status in ('success', 'partial', 'failed')),
  lesson_learned text not null,
  what_went_wrong text,
  resolution text,
  reflection_notes text,
  ai_tools text[],
  task_type text,
  problem_category text,
  resolution_type text,
  learning_value integer check (learning_value between 1 and 5),
  frustration_level integer check (frustration_level between 1 and 5),
  confidence_after integer check (confidence_after between 1 and 5),
  duration_minutes integer,
  prompt_id uuid,
  is_favorite boolean default false,
  tags text[]
);

-- Prompts tabel
create table prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  user_display_name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  title text not null,
  ai_tools text[] not null,
  task_type text,
  goal_summary text not null,
  goal_full text,
  system_prompt_summary text,
  system_prompt_full text,
  user_prompt_summary text not null,
  user_prompt_full text,
  output_summary text,
  output_full text,
  prompt_rating integer check (prompt_rating between 1 and 5),
  session_id uuid references sessions(id) on delete set null,
  is_favorite boolean default false,
  tags text[]
);
```

### 3b. Row Level Security (RLS) inschakelen

```sql
-- Sessions RLS
alter table sessions enable row level security;

create policy "Teamleden kunnen alle sessies lezen"
  on sessions for select
  to authenticated
  using (true);

create policy "Gebruiker kan eigen sessies aanmaken"
  on sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Gebruiker kan eigen sessies bewerken"
  on sessions for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Gebruiker kan eigen sessies verwijderen"
  on sessions for delete
  to authenticated
  using (auth.uid() = user_id);

-- Prompts RLS
alter table prompts enable row level security;

create policy "Teamleden kunnen alle prompts lezen"
  on prompts for select
  to authenticated
  using (true);

create policy "Gebruiker kan eigen prompts aanmaken"
  on prompts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Gebruiker kan eigen prompts bewerken"
  on prompts for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Gebruiker kan eigen prompts verwijderen"
  on prompts for delete
  to authenticated
  using (auth.uid() = user_id);
```

### 3c. Updated_at trigger

```sql
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sessions_updated_at
  before update on sessions
  for each row execute function update_updated_at();

create trigger prompts_updated_at
  before update on prompts
  for each row execute function update_updated_at();
```

## Stap 4: API sleutels ophalen

1. Ga naar **Project Settings → API**
2. Kopieer de **Project URL** en de **anon public** key

## Stap 5: .env bestand aanmaken

Kopieer `.env.example` naar `.env` en vul je sleutels in:

```
VITE_SUPABASE_URL=https://jouw-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=jouw-anon-key-hier
```

> **Let op:** commit `.env` nooit naar Git. Het staat al in `.gitignore`.

## Stap 6: Authenticatie instellen

In het Supabase dashboard onder **Authentication → Providers**:

- Email/password is standaard ingeschakeld
- Voor testgebruikers: schakel **Confirm email** tijdelijk uit onder Authentication → Settings (handig tijdens development)

## Stap 7: Testgebruiker aanmaken

Ga naar **Authentication → Users** en klik **Invite user** of **Add user** om handmatig een testaccount aan te maken.

---

## Verificatie

Na het uitvoeren van alle SQL kun je controleren via **Table Editor** of de tabellen `sessions` en `prompts` correct zijn aangemaakt met alle kolommen.

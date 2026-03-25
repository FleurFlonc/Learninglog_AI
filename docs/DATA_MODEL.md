# Datamodel — LearningsAI Team

## Entiteiten

### TeamUser

Vertegenwoordigt een ingelogd teamlid. Wordt afgeleid van Supabase Auth — er is geen aparte users-tabel.

| Veld | Type | Beschrijving |
|---|---|---|
| id | string (UUID) | Supabase Auth UUID |
| email | string | E-mailadres |
| displayName | string | Weergavenaam in de app (opgeslagen in `user_metadata`) |
| createdAt | string | ISO timestamp aanmaakmomemt |

### LearningSession

Een gelogde AI-werksessie.

| Veld | Type | Verplicht | Beschrijving |
|---|---|---|---|
| id | UUID | ja | Primaire sleutel |
| userId | UUID | ja | Verwijzing naar auth.users |
| userDisplayName | string | ja | Weergavenaam op aanmaakmoment |
| createdAt | string | ja | Aanmaaktijdstip |
| updatedAt | string | ja | Laatste wijziging |
| taskDescription | string | ja | Wat wilde je bereiken? (3-500 tekens) |
| status | SessionStatus | ja | success / partial / failed |
| lessonLearned | string | ja | Wat leerde je? (5-1000 tekens) |
| whatWentWrong | string | nee | Wat ging er mis? |
| resolution | string | nee | Hoe heb je het opgelost? |
| reflectionNotes | string | nee | Vrije reflectie |
| aiTools | AIToolType[] | nee | Gebruikte tools |
| taskType | TaskType | nee | Type taak |
| problemCategory | ProblemCategory | nee | Categorie van het probleem |
| resolutionType | ResolutionType | nee | Type oplossing |
| learningValue | 1-5 | nee | Hoe waardevol was de les? |
| frustrationLevel | 1-5 | nee | Hoe frustrerend was de sessie? |
| confidenceAfter | 1-5 | nee | Hoe zeker voel je je daarna? |
| durationMinutes | integer | nee | Duur in minuten |
| promptId | UUID | nee | Gekoppelde PromptEntry |
| isFavorite | boolean | nee | Gemarkeerd als favoriet |
| tags | string[] | nee | Labels |

### PromptEntry

Een vastgelegde prompt met context en beoordeling.

| Veld | Type | Verplicht | Beschrijving |
|---|---|---|---|
| id | UUID | ja | Primaire sleutel |
| userId | UUID | ja | Eigenaar |
| userDisplayName | string | ja | Weergavenaam op aanmaakmoment |
| title | string | ja | Beschrijvende titel (3-100 tekens) |
| aiTools | AIToolType[] | ja | Minimaal 1 tool |
| taskType | TaskType | nee | Type taak |
| goalSummary | string | ja | Doel in max 200 tekens |
| goalFull | string | nee | Uitgebreide doelomschrijving |
| systemPromptSummary | string | nee | Kern van de systeemprompt |
| systemPromptFull | string | nee | Volledige systeemprompt |
| userPromptSummary | string | ja | Kernvraag (5-500 tekens) |
| userPromptFull | string | nee | Volledige gebruikersprompt |
| outputSummary | string | nee | Resultaat in het kort |
| outputFull | string | nee | Volledige AI-output |
| promptRating | 1-5 | nee | Hoe goed werkte de prompt? |
| sessionId | UUID | nee | Gekoppelde LearningSession |
| isFavorite | boolean | nee | Gemarkeerd als favoriet |
| tags | string[] | nee | Labels |

## Enums

| Enum | Waarden |
|---|---|
| SessionStatus | success, partial, failed |
| AIToolType | chatgpt, claude, cursor, gemini, copilot, other |
| TaskType | debugging, prompting, writing, research, automation, ideation, ontwikkelen, other |
| ProblemCategory | prompting, technical, context, output_quality, workflow, unknown |
| ResolutionType | reprompt, more_context, changed_tool, manual_fix, code_fix, research, other |
| ThemeMode | system, light, dark |

## Relaties

- `sessions.prompt_id` → `prompts.id` (optioneel, geen foreign key constraint — losjes gekoppeld)
- `prompts.session_id` → `sessions.id` (foreign key met `on delete set null`)
- Beide tabellen verwijzen naar `auth.users` via `user_id` met `on delete cascade`

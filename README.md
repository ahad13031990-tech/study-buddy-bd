# StudyBuddy BD

StudyBuddy is a responsive study workspace for solving questions, tutoring, quizzes, and reviewing saved work.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local`. `AI_API_KEY` is optional in development; without it, text solving, chat, and quiz generation use an explicit development fallback. Image analysis intentionally returns a configuration message until a vision-capable provider is wired.

`AI_API_BASE_URL` and `AI_MODEL` let the server-side provider abstraction target another OpenAI-compatible service. Secrets are never read by client code.

## Functional MVP

- `POST /api/solve` validates a question and returns answer, explanation, Bangla explanation, key concept, and common mistake.
- `POST /api/chat` powers tutor and follow-up conversation.
- `POST /api/quiz` generates quiz questions and supports answer, next, submit, score, and review-ready state.
- `lib/storage/questions.ts` owns browser history persistence for the MVP.
- Dashboard statistics and recent activity are derived from saved browser data.

## Supabase-ready architecture

`lib/models.ts` defines contracts for profiles, questions, conversations, messages, quiz attempts, and subscriptions. Production migration should add Supabase Auth, server-side ownership checks, RLS policies, and move question/quiz persistence from `lib/storage/questions.ts` into authenticated server actions or route handlers.

Required Supabase variables are included in `.env.example`, but authentication is intentionally not claimed as active until Supabase is connected.

## Future integrations

A Chrome extension can call the same `/api/solve` endpoint through an authenticated backend proxy. Add origin checks, request-size limits, per-user rate limits, and server-side validation before exposing it cross-origin. Stripe or another payment provider should be connected behind a server-side checkout route and webhook before enabling the Plus purchase flow.

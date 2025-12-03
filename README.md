# Agentic Retail - Next.js

AI-powered shopping assistant built with Next.js, Supabase, and Claude.

**Status:** 🟢 Active Development - Phase 0 (Memory System)
**Feature Parity:** ~76%
**Last Updated:** December 3, 2024

📊 [View Full Project Status](docs/PROJECT-STATUS.md) | 📖 [Sprint 3 Complete](docs/SPRINT-3-COMPLETE.md) | 🗺️ [Enhanced Roadmap](docs/ROADMAP-ENHANCED.md)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Google OAuth in Authentication > Providers (optional)

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # Claude streaming endpoint
│   │   └── auth/          # Auth callback
│   ├── chat/              # Main chat interface
│   ├── login/             # Auth pages
│   └── layout.tsx         # Root layout
├── components/            # React components
├── hooks/                 # Custom hooks
├── lib/
│   ├── catalog/           # Product catalog
│   └── supabase/          # Supabase clients
└── types/                 # TypeScript types
```

## Database Schema

### Core Tables
- **profiles**: User profile with household & preferences
- **shopping_lists**: Saved shopping lists
- **orders**: Order history
- **missions**: Shopping session tracking
- **chat_sessions**: Chat history

### Memory System Tables (Migration 001)
- **customer_preferences**: Dietary, brand, favorite, allergy preferences
- **shopping_patterns**: Time, frequency, category patterns
- **interaction_history**: Questions, views, swaps, feature usage
- **memory_insights**: High-level personas, goals, constraints

See `supabase/schema.sql` for base schema and `supabase/migrations/001_memory_system.sql` for memory tables.

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

```bash
vercel
```

## Migration from Prototype

This is the production version of Agentic Retail. The prototype (`agentic-retail-local`) used:
- Inline React with Babel CDN
- localStorage for persistence
- Express server proxy

This version adds:
- Proper build system with TypeScript
- PostgreSQL database
- User authentication
- Server-side rendering
- API routes for secure Claude access

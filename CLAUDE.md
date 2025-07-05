# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Suicide Kings Car Club** website - a community platform for 1961-1969 Lincoln Continental enthusiasts. The codebase is a production-ready Next.js application with a comprehensive admin panel and member management system.

## Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Common Tasks
```bash
# No test commands configured - consider adding a testing framework
# TypeScript checking: tsc --noEmit
# Format with Prettier: npx prettier --write .
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript (strict mode)
- **UI**: React 19 + shadcn/ui components
- **Styling**: Tailwind CSS with custom theme
- **Authentication**: NextAuth.js
- **Database**: Multiple adapters supported (PostgreSQL, MySQL, SQLite)
- **Payments**: PayPal and Stripe integration ready

### Directory Structure
- `/app` - Next.js App Router pages and API routes
  - Public routes: about, cars, chapters, contact, events, forum, gallery, membership, store
  - Member routes: /member/dashboard, /member/cars
  - Admin routes: /admin/* (fully implemented admin panel)
  - API routes: /api/* (auth, club management, payments, etc.)
- `/components` - Reusable React components
  - `/ui` - 40+ shadcn/ui components
  - Feature-specific components organized by function
- `/lib` - Core utilities and business logic
  - Database schemas and connections
  - Authentication, payments, email services
  - AI integrations (Anthropic, OpenAI)
  - Image generation and optimization

### Key Features
1. **Public Website**: Chapter info, events, forums, gallery, membership applications
2. **Member Area**: Dashboard, car management, profile
3. **Admin Panel**: Complete management system for members, events, store, content, finances
4. **E-commerce**: Store with order management
5. **Community**: Forums with moderation
6. **Real-time**: WebSocket support for live features

### Important Configuration
- **Path Aliases**: Use `@/*` for imports from root
- **Environment Variables**: Required for auth, database, payments, email, AI services
- **Build Settings**: ESLint/TypeScript errors ignored (fix for production)
- **Images**: Currently unoptimized (enable Next.js image optimization for production)

### Development Notes
- No testing framework configured - add Jest/Vitest for production
- Forms use React Hook Form + Zod validation
- Dark mode support via Tailwind CSS
- PWA support with service worker
- Deployment system with versioning in `/lib/deployment`

### Admin Implementation
The admin section is fully implemented with:
- Statistics dashboard
- Member and application management
- Event creation and management
- Store and order processing
- Forum moderation tools
- Content management
- Financial tracking and reports
- Maps and route planning
- System settings

When working on admin features, check `/app/admin` for existing patterns and `/components/admin` for reusable components.
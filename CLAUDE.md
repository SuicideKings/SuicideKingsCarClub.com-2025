# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Note: Port 3000 may show an old website, use different port if needed)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a **Next.js 15 App Router** application for the Suicide Kings Car Club website with multi-chapter management capabilities.

### Key Technologies
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** + **Shadcn/UI** for styling
- **Drizzle ORM** with PostgreSQL (supports multiple providers: Supabase, Neon, PlanetScale, Vercel Postgres)
- **NextAuth.js** for admin authentication + custom JWT system for member authentication
- **Progressive Web App (PWA)** with service worker

### Database Schema
The application uses a comprehensive schema with these main tables:
- `admin_users` - Admin authentication and management
- `clubs` - Car club chapter information
- `members` - Member profiles and authentication
- `events` - Event management system
- `gallery` - Image gallery management
- `custom_pages` - CMS-like page management

### Authentication System
**Dual authentication model:**
- **Admin Auth**: NextAuth.js with credentials provider and bcrypt password hashing
- **Member Auth**: Custom JWT-based system with role-based access control

### Route Structure
- `/admin/*` - Admin panel (protected by middleware)
- `/member/*` - Member dashboard (JWT protected)
- `/chapters/*` - Public chapter pages
- `/api/*` - API routes for data management
- `/(auth)/*` - Authentication routes

### Component Organization
- `components/ui/` - Shadcn/UI base components
- `components/admin/` - Admin-specific components
- `components/member/` - Member-specific components
- `components/mobile/` - Mobile-optimized components
- `lib/db/` - Database configuration and schema
- `lib/ai/` - AI integration services

### Environment Configuration
The application supports multiple database providers through environment variables with fallback logic. Key env vars include database connections, AI service keys, and payment provider configurations.

### Build Configuration
- Next.js config has lenient build settings (ESLint and TypeScript errors disabled in build)
- Image optimization disabled for broader deployment compatibility
- Automatic syncing with v0.dev deployments

### Payment Integration
- PayPal integration for membership payments
- Stripe support as alternative payment method

### AI Features
- Multiple AI providers supported (OpenAI, Anthropic, DeepSeek)
- Image generation capabilities
- AI-powered content recommendations

### Image Management
- Multiple storage providers (AWS S3, Vercel Blob, Supabase)
- Image optimization and compression
- Gallery management system

## Development Notes
- No testing framework is currently configured
- The project uses v0.dev for continuous deployment
- Build configuration prioritizes deployment success over strict error checking
- PWA features include offline functionality and push notification support
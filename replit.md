# SSA Enterprise Platform

## Overview

This is an enterprise-grade SaaS platform built for portfolio management, investments, grants lifecycle management, and organizational administration. The application follows a monorepo structure with a React frontend and Express backend, using PostgreSQL for data persistence. It implements multi-tenant architecture with organizations, teams, role-based access control (RBAC), and includes features like client portals, newsletters, and admin diagnostics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and interactions
- **Build Tool**: Vite with hot module replacement

The frontend lives in `/client/src` with path aliases configured:
- `@/*` maps to `./client/src/*`
- `@shared/*` maps to `./shared/*`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Pattern**: RESTful JSON APIs under `/api/*` prefix
- **Build**: esbuild bundles server for production as CommonJS

The server entry point is `/server/index.ts` with routes defined in `/server/routes.ts`.

### Data Storage
- **Database**: PostgreSQL via `pg` driver
- **ORM**: Drizzle ORM with Zod schema validation
- **Schema Location**: `/shared/schema.ts` (shared between client/server)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command

Key database tables:
- `organizations` - Multi-tenant support
- `users` - User accounts with RBAC roles
- `teams` / `team_members` - Team management
- `portfolio`, `investments`, `grants` - Core business entities
- `communications`, `audit_logs` - System tracking

### Authentication & Authorization
- **RBAC Roles**: super_admin, admin, team_member, client, partner, subscriber
- **Session Support**: connect-pg-simple for PostgreSQL session storage
- **2FA Ready**: Schema includes two-factor authentication fields
- **Middleware**: Role-checking middleware pattern in routes

### Build & Development
- `npm run dev` - Development with Vite HMR and tsx
- `npm run build` - Production build (Vite for client, esbuild for server)
- `npm run db:push` - Push schema changes to database

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and queries

### UI Framework
- **Radix UI**: Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-built component configurations in `/client/src/components/ui/`

### Key Libraries
- **TanStack React Query**: API data fetching and caching
- **Zod**: Runtime schema validation (shared between client/server)
- **Framer Motion**: Animation library
- **date-fns**: Date formatting utilities
- **Lucide React**: Icon library

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development banner
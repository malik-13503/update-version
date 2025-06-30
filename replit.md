# Overview

This is a full-stack web application built as a marketing landing page for "Done For You Pros," a service company. The application features a video section, game preview, and registration form with a PostgreSQL database backend. It's designed as a lead generation tool with gamification elements to encourage user engagement.

## System Architecture

The application follows a monorepo structure with separate client and server directories:

- **Frontend**: React with TypeScript using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for development and production
- **Routing**: Wouter for lightweight client-side routing  
- **Styling**: Tailwind CSS with custom brand colors and shadcn/ui component library
- **Forms**: React Hook Form with Zod schema validation
- **HTTP Client**: Custom fetch wrapper with TanStack Query for caching

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Built-in with connect-pg-simple
- **API Structure**: RESTful endpoints with proper error handling

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Registrations Table**: Lead capture (id, name, phone, email, videoWatched, createdAt)
- **Migration System**: Drizzle Kit for schema migrations

## Data Flow

1. **User Journey**: Home page → Video watching → Form unlock → Registration → Database storage
2. **Video Tracking**: Progress monitoring unlocks registration form at 80% completion
3. **Lead Capture**: Form validation → Email uniqueness check → Database insertion
4. **Statistics**: Real-time registration count for social proof

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives for shadcn/ui
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server and optimized builds
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundler for server builds

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

### Hosting Requirements
- Node.js environment supporting ESM modules
- PostgreSQL database (Neon serverless recommended)
- Static file serving capability for frontend assets

## Changelog

- June 30, 2025. Initial setup
- June 30, 2025. Updated color scheme to use specific brand colors (#2C5CDC and #F76D46)
- June 30, 2025. Added Montserrat font throughout the application
- June 30, 2025. Updated form design with gradient border container
- June 30, 2025. Updated footer to match reference design with light background
- June 30, 2025. Added user's video file to video section

## User Preferences

Preferred communication style: Simple, everyday language.
Brand colors: #2C5CDC (blue) and #F76D46 (orange)
Font: Montserrat for all text elements
Form design: Gradient border container with white background interior
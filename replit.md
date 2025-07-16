# D4U Pros Scratch & Win Game Platform

## Overview

This is a comprehensive interactive scratch-off lottery game platform built with React and Express.js. The system features video-gated registration, dual scratch card games, winner notifications, and an admin dashboard. The application combines modern web technologies with gamification elements to create an engaging user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript for type safety
- **Session Management**: Express session middleware with PostgreSQL storage
- **Email Service**: Resend API for transactional emails
- **Database**: PostgreSQL with Drizzle ORM

### Database Schema
- **Users Table**: Admin authentication (username, password, role)
- **Registrations Table**: User submissions (name, phone, email, video_watched)
- **Settings Table**: Configurable system settings

## Key Components

### Game System
- **Interactive Scratch Cards**: HTML5 Canvas-based scratch mechanics with touch/mouse support
- **Two-Card System**: Sequential unlocking with security validation
- **Prize Logic**: Configurable win conditions and prize distribution
- **Winner Notifications**: Animated celebration popups and email confirmations

### Video Integration
- **HTML5 Video Player**: Custom controls with progress tracking
- **Completion Gating**: 80% watch requirement before form access
- **Progress Persistence**: Video state maintained across sessions

### Admin Dashboard
- **Authentication**: Session-based login system
- **User Management**: View, search, filter, and delete registrations
- **Analytics**: Registration trends and engagement metrics
- **Settings**: Video requirements and duplicate checking toggles
- **Email Testing**: Winner notification system validation

### Security Features
- **Session Management**: Secure admin authentication
- **Form Validation**: Client and server-side input validation
- **Duplicate Prevention**: Email-based registration checking
- **Game Security**: Registration validation before game access

## Data Flow

1. **User Registration Flow**:
   - User watches video (80% completion required)
   - Form becomes available for completion
   - Server validates and stores registration
   - User redirected to game with session data

2. **Game Flow**:
   - Security check for valid registration
   - First scratch card presented
   - Second card unlocked after first completion
   - Winner status determined and notifications sent

3. **Admin Flow**:
   - Admin login with session creation
   - Dashboard displays user data and analytics
   - Settings management for system configuration
   - Email testing and user management actions

## External Dependencies

### Email Service
- **Resend API**: Transactional email delivery
- **Winner Templates**: HTML email templates for prize notifications
- **Configuration**: Environment-based API key management

### Database
- **PostgreSQL**: Primary data storage
- **Drizzle ORM**: Type-safe database queries
- **Connection Pooling**: Neon serverless connection handling

### UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built component library

## Deployment Strategy

### Railway Platform
- **One-Click Deploy**: GitHub repository integration
- **PostgreSQL Service**: Automatically provisioned database
- **Environment Variables**: Secure configuration management
- **Build Process**: Automatic dependency installation and compilation

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-generated)
- `RESEND_API_KEY`: Email service authentication
- `NODE_ENV`: Production environment flag

### Build Process
1. Install dependencies via npm
2. Client build using Vite
3. Server compilation with esbuild
4. Database migrations via Drizzle
5. Default admin user creation

The application follows a monorepo structure with shared TypeScript schemas, separate client and server directories, and comprehensive build tooling for production deployment.
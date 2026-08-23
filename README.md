# Your SaaS Starter Kit

A production-ready monorepo template built with Turborepo, featuring an Astro marketing site, a React dashboard, an Elysia API, and shared packages. Perfect for building scalable full-stack SaaS applications with modern tooling.

## Used By

- [leviathanwar.com](https://leviathanwar.com/)

## 🚀 Quick Start

```bash
npx create-your-saas-boilerplate
```

Get started in seconds with our interactive CLI tool! It will scaffold the entire monorepo with your custom configuration.

## ✨ Features

- 🚀 **Modern Stack**: React 19, Elysia, Astro, TypeScript, and Bun
- 🏗️ **Monorepo**: Turborepo for efficient builds and caching
- 🌐 **Landing + Dashboard split**: an Astro marketing site at the root domain, a React dashboard SPA at an app subdomain, sharing an origin with the API
- 🔐 **Authentication**: Better Auth with email/password and OAuth providers
- 🎨 **UI Components**: shadcn/ui with Tailwind CSS and dark mode
- 📊 **Tracking pixels**: optional Meta Pixel + Google tag on the landing site, each independently env-gated
- 📱 **Responsive**: Mobile-first design with modern UX patterns
- 🗄️ **Database**: Drizzle ORM with PostgreSQL and migrations
- 🤖 **AI Ready**: Optional OpenAI integration
- 📧 **Email**: Optional Resend integration for transactional emails
- 🔧 **Developer Experience**: Biome linting (no ESLint), pre-commit hooks, and type safety
- 🐳 **Deployment Ready**: a single Dockerfile builds and serves all three apps

## Structure

```
project/
├── apps/
│   ├── landing/              # Astro marketing site
│   ├── web/                  # React dashboard SPA
│   └── api/                  # Elysia API server
├── packages/
│   ├── database/             # Database schema and migrations
│   ├── shared/                # Shared types and utilities
│   └── config/                 # Environment configuration
├── Dockerfile                # Single-image build for all 3 apps
├── turbo.json                # Turborepo configuration
└── package.json               # Root package.json
```

## Getting Started

### Quick Start with CLI (Recommended)

The fastest way to get started is using our CLI tool:

```bash
npx create-your-saas-boilerplate
```

This will:
- Prompt you for a project name and organization name
- Download and configure the template
- Set up your monorepo with custom package names
- Optionally install dependencies

**Alternative package managers:**
```bash
# Using npm
npm create your-saas-boilerplate

# Using bun
bunx create-your-saas-boilerplate
```

After creation:
```bash
cd your-project-name
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/landing/.env.example apps/landing/.env
# Edit with your database URL and secrets
bun run dev
```

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- PostgreSQL database

### Manual Installation (Alternative)

If you prefer to clone the repository directly:

```bash
# Clone the repository
git clone https://github.com/JuanPabloGilA/your-saas-starterkit.git
cd your-saas-starterkit

# Install dependencies
bun install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/landing/.env.example apps/landing/.env
# Edit with your database URL and other secrets
```

### Development

```bash
# Start all apps in development mode
bun run dev

# Start specific app
bun run dev --filter=@your-saas-starterkit/landing
bun run dev --filter=@your-saas-starterkit/web
bun run dev --filter=@your-saas-starterkit/api

# Build all apps
bun run build

# Run linting
bun run lint

# Type checking
bun run type-check
```

### Database

```bash
# Generate migrations
bun run db:generate

# Push schema changes
bun run db:push

# Run migrations
bun run db:migrate
```

## Apps

### Landing (`apps/landing`)
- Astro static site, served at the root domain (e.g. `domain.com`)
- Zero client-side JS by default — sections are plain `.astro` components
- Optional Meta Pixel + Google tag, each independently env-gated
- Links to the dashboard (`/login`, `/register`) are absolute cross-domain URLs

### Dashboard (`apps/web`)
- React 19 with Vite for fast development
- TanStack Router for type-safe routing, auth + app screens only
- Tailwind CSS for utility-first styling
- Radix UI components for accessibility
- Better Auth for authentication
- shadcn/ui component library
- Dark/light theme support
- Talks to the API via a fully-typed Eden Treaty client

### API (`apps/api`)
- Elysia framework for high-performance APIs, served under `/api` on the dashboard's domain
- Better Auth for secure authentication, mounted as an Elysia plugin
- Drizzle ORM with PostgreSQL
- AI integration with OpenAI (optional)
- Email functionality with Resend (optional)
- Type-safe API routes, consumed via Eden Treaty from the dashboard

## Packages

### Database (`packages/database`)
- Drizzle schema definitions
- Database migrations
- Connection utilities

### Shared (`packages/shared`)
- TypeScript types
- Zod validation schemas
- Shared utilities

### Config (`packages/config`)
- Environment variable validation
- Configuration utilities

## Scripts

- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps for production
- `bun run lint` - Lint all packages with Biome
- `bun run lint:fix` - Fix linting issues automatically
- `bun run format` - Format code with Biome
- `bun run type-check` - Type check all packages
- `bun run clean` - Clean all build artifacts

## Tech Stack

- **Monorepo**: Turborepo for fast, cached builds
- **Runtime**: Bun for lightning-fast package management
- **Landing**: Astro, astro-icon
- **Dashboard**: React 19, Vite, TanStack Router, Tailwind CSS, shadcn/ui, Eden Treaty
- **Backend**: Elysia, Better Auth
- **Database**: PostgreSQL, Drizzle ORM
- **AI**: OpenAI SDK (optional)
- **Email**: Resend (optional)
- **Type Safety**: TypeScript, Zod
- **Linting**: Biome for fast linting and formatting (no ESLint)
- **Git Hooks**: Husky for pre-commit formatting

## Customization

### Setting up your project

**If using the CLI (recommended):**
The CLI automatically handles package naming and setup. You only need to:

1. **Environment variables**: Copy each app's `.env.example` (`apps/api`, `apps/web`, `apps/landing`) to `.env` and configure your settings
2. **Database**: Set up your PostgreSQL database and update the connection string
3. **Authentication**: Configure Better Auth providers in `apps/api/lib/auth.ts`
4. **Optional services**: Set up OpenAI and Resend if you need AI or email functionality

**If manually cloning:**
1. **Update package names**: Change `@your-saas-starterkit` in all `package.json` files to your organization name
2. **Environment variables**: Copy each app's `.env.example` (`apps/api`, `apps/web`, `apps/landing`) to `.env` and configure your settings
3. **Database**: Set up your PostgreSQL database and update the connection string
4. **Authentication**: Configure Better Auth providers in `apps/api/lib/auth.ts`
5. **Optional services**: Set up OpenAI and Resend if you need AI or email functionality

### Development workflow

1. Make changes in the appropriate app or package
2. Run `bun run type-check` to ensure type safety
3. Run `bun run lint` to check code quality
4. Test your changes with `bun run dev`
5. Code is automatically formatted on commit via pre-commit hooks

## Deployment

```bash
docker build -t your-saas-starterkit .
```

The `Dockerfile` builds the landing site and dashboard as static output, compiles the API into a standalone Bun binary, and runs pending migrations on boot. At runtime, the binary dispatches on the incoming `Host` header: `/api/*` goes to the Elysia app, `Host: $DASHBOARD_HOST` serves the dashboard's static files (with SPA fallback), and anything else serves the landing site (real 404s). This lets one container/port serve both your root domain and your app subdomain — point both at the same deployment and set `DASHBOARD_HOST` accordingly. Any platform that runs a Dockerfile works (Coolify, Railway, Fly, a plain VPS); Nixpacks is intentionally not used since it lags official Bun releases.

## CLI Tool

This template can be scaffolded using our CLI tool: [create-your-saas-boilerplate](https://github.com/JuanPabloGilA/create-your-saas-boilerplate)

```bash
npx create-your-saas-boilerplate
```

The CLI provides:
- Interactive prompts for project configuration
- Automatic package namespace replacement
- Optional dependency installation
- Beautiful terminal UI with progress indicators

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License - feel free to use this template for your projects!
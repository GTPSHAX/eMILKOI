# Copilot Instructions for eMILKOI

## Project Overview
This is a modern Next.js 15 project using the App Router architecture with TypeScript, Tailwind CSS v4, and React 19. The project uses Turbopack for faster development builds.

## Architecture & Structure

### Next.js App Router
- Uses the `src/app/` directory structure (not pages)
- Root layout in `src/app/layout.tsx` handles global HTML structure and font loading
- Main page component in `src/app/page.tsx`
- TypeScript path mapping: `@/*` resolves to `./src/*`

### Styling System
- **Tailwind CSS v4** with inline theme configuration in `globals.css`
- Uses CSS custom properties for theming: `--background`, `--foreground`, `--font-geist-sans`, `--font-geist-mono`
- Dark mode handled via `prefers-color-scheme` media query
- PostCSS configured with `@tailwindcss/postcss` plugin

### Typography
- Primary font: Geist Sans (`--font-geist-sans`)
- Monospace font: Geist Mono (`--font-geist-mono`) 
- Fonts loaded via `next/font/google` in layout with CSS variables

## Development Workflows

### Build & Development
- **Development**: `npm run dev` (uses Turbopack for faster builds)
- **Production build**: `npm run build` (also uses Turbopack)
- **Start production**: `npm run start`
- **Linting**: `npm run lint` (ESLint with Next.js TypeScript config)

### Code Quality
- ESLint configured with `next/core-web-vitals` and `next/typescript` extends
- Uses modern flat config format (`eslint.config.mjs`)
- GitHub Actions workflow runs linting on push/PR to main/develop branches

## Key Conventions

### Component Patterns
- Use TypeScript with strict mode enabled
- Functional components with typed props using `Readonly<>` pattern
- Image optimization via `next/image` component with explicit width/height
- Semantic HTML with accessibility attributes (`aria-hidden`, `alt` text)

### Styling Patterns
- Utility-first Tailwind approach with responsive prefixes (`sm:`, `md:`)
- Dark mode classes: `dark:` prefix for dark theme variants
- Custom CSS properties for semantic color tokens (`bg-foreground`, `text-background`)
- Grid layouts for page structure (`grid-rows-[20px_1fr_20px]`)

### File Organization
- Keep pages in `src/app/` with `page.tsx` files
- Global styles in `src/app/globals.css`
- Static assets in `public/` directory (SVG icons, etc.)
- TypeScript configs use `bundler` module resolution

## External Dependencies
- React 19.1.0 with corresponding @types packages
- Next.js 15.5.4 with TypeScript support
- Tailwind CSS v4 with PostCSS integration
- ESLint with Next.js configurations

## Common Patterns
- Use `export default function` for page/layout components
- Import order: Next.js modules → fonts → styles → components
- Responsive design with mobile-first approach using Tailwind breakpoints
- Semantic color system using CSS custom properties rather than hardcoded values
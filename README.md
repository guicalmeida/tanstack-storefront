# TanStack Storefront

A modern e-commerce storefront migrated from Next.js to the TanStack ecosystem. Originally created by [Vendure](https://vendure.io) and [Vercel](https://vercel.com), this version explores TanStack Start, Router, and Form.

## About

This is a learning experiment - a way to contribute back to the community and explore TanStack's capabilities. The original Vendure x Next.js Commerce template has been refactored to use TanStack's suite of tools.

**⚠️ Disclaimer**: As a learning project, it has potential flaws, especially around authentication where I have limited experience. Use it, contribute to it, but be mindful of production considerations.

## Technical Gains

### TanStack Start

- **End-to-End Type Safety**: 100% inferred TypeScript support from server to client
- **Server Functions**: Clean `createServerFn`, `createServerOnlyFn`, `createClientOnlyFn`, and `createIsomorphicFn` instead of directives like "use server"
- **Isomorphic SSR Model**: Server and client code sharing with excellent streaming capabilities

### TanStack Router

- **100% Inferred TypeScript**: Auto-completed paths, params, and search params with full type inference
- **Type-Safe Navigation**: Navigate with confidence knowing your routes exist at compile time
- **Search Param State Management**: First-class URL state management that works like a proper state manager

### Developer Experience

- **TanStack DevTools**: Incredible debugging experience for routing and forms
- **File-based Routing**: Intuitive and predictable
- **Hot Reloading**: Fast feedback loop with Vite

## Limitations & Trade-offs

- **No Server Components**: Unlike Next.js, no React Server Components support yet
- **New & Changing**: TanStack Start is stable but will evolve significantly
- **Limited LLM Knowledge**: Being new means less AI assistance and more manual doc reading
- **Image Handling**: Dropped Next.js Image component for [@unpic/react](https://unpic.pics) - less optimization out of the box
- **Smaller Ecosystem**: Fewer examples and community resources compared to Next.js

## Tech Stack

- **TanStack Start**: Full-stack React framework
- **TanStack Router**: Type-safe routing
- **TanStack Form**: Form state management
- **Tailwind CSS**: Styling
- **Radix UI + shadcn/ui**: Component primitives
- **GraphQL + gql.tada**: Type-safe API layer
- **Biome**: Linting and formatting
- **Vitest**: Testing

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Vendure API endpoint

# Start development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
VENDURE_SHOP_API_ENDPOINT="https://demo.vendure.io/shop-api"
VITE_COMPANY_NAME="My Company"
VITE_TWITTER_CREATOR="@example-twitter"
VITE_TWITTER_SITE="https://tanstack.com/"
VITE_SITE_NAME="Tanstack Commerce"
SESSION_SECRET=this-is-a-secure-32-chars-phrase
NODE_ENV=development
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run serve    # Preview production build
npm run test     # Run tests
npm run lint     # Lint with Biome
npm run format   # Format with Biome
```

## Project Structure

```
src/
├── routes/           # File-based routing
├── components/       # UI components
│   ├── custom/      # App-specific components
│   └── ui/          # shadcn/ui components
├── lib/             # Utilities and API
└── styles/          # Global styles
```

## Adding Components

```bash
# Add shadcn/ui components
pnpx shadcn@latest add button
pnpx shadcn@latest add dialog
```

## Contributing

Contributions welcome! This is a learning project, so don't hesitate to suggest improvements or point out issues.

## Acknowledgments

- **Vendure & Vercel**: Original storefront implementation
- **TanStack Team**: Amazing tools that make this possible

## License

MIT - see [LICENSE](LICENSE) file for details.

---

Built by [Guilherme de Almeida](https://github.com/guicalmeida) as a learning experiment with TanStack.

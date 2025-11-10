# Claude.md - Technical Documentation

## Project Overview

This is a TanStack-based e-commerce storefront, migrated from the original Next.js implementation by Vendure and Vercel. The project serves as both a functional storefront and a learning experiment with TanStack's ecosystem.

## Architecture

### Framework Stack

- **TanStack Start**: Full-stack React framework with SSR capabilities
- **TanStack Router**: File-based routing with type-safe navigation
- **TanStack Form**: Headless form state management
- **Vite**: Build tool and development server

### Core Technologies

- **TypeScript**: Language and type system
- **GraphQL**: API layer via Vendure backend
- **gql.tada**: Type-safe GraphQL client
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library

## File Structure

```
src/
├── routes/                 # File-based routing
│   ├── __root.tsx         # Root layout component
│   ├── _default/          # Default layout group
│   │   ├── index.tsx      # Home page
│   │   ├── search.tsx     # Search results
│   │   └── product/       # Product pages
├── components/
│   ├── custom/            # Application components
│   │   ├── layout/        # Header, footer, navigation
│   │   ├── product/       # Product display components
│   │   ├── cart/          # Shopping cart components
│   │   └── search/        # Search functionality
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── vendure/           # Vendure API integration
│   │   ├── queries/       # GraphQL queries
│   │   ├── fragments/     # GraphQL fragments
│   │   └── client.ts      # GraphQL client setup
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Zod schemas
├── env/                   # Environment validation
└── styles/                # Global CSS
```

## Routing System

### File-Based Routes

- Routes are defined as files in `src/routes/`
- Dynamic routes use bracket notation: `[productId].tsx`
- Layout groups use underscore prefix: `_default/`

### Route Features

- Type-safe parameters and search params
- Built-in data loaders
- Automatic code splitting
- Prefetching capabilities

### Example Route Structure

```typescript
// src/routes/_default/product/$productSlug.tsx
export const Route = createFileRoute("/_default/product/$productSlug")({
  loader: ({ params }) => getProduct(params.productSlug),
  component: ProductPage,
});
```

## Data Flow

### GraphQL Integration

- Vendure GraphQL API as backend
- Type generation via gql.tada
- Fragments for reusable query parts
- Server-side data fetching in route loaders

### State Management

- URL state via TanStack Router search params
- Form state via TanStack Form
- Server state via route loaders
- Component state via React hooks

### Example Data Fetching

```typescript
// Route loader
loader: async ({ params }) => {
  const product = await vendureClient.request(ProductQuery, {
    slug: params.productSlug,
  });
  return { product };
};
```

## Form Management

### TanStack Form Implementation

- Headless form components
- Type-safe field validation
- Granular reactivity
- Custom validation schemas with Zod

### Form Pattern

```typescript
const form = useForm({
  defaultValues: { email: "", password: "" },
  onSubmit: async ({ value }) => {
    await authenticate(value);
  },
  validators: {
    onChange: LoginSchema,
  },
});
```

## Styling Architecture

### Tailwind CSS Setup

- Tailwind CSS v4
- Custom design tokens
- Responsive design patterns
- Dark/light theme support

### Component Styling

- Utility-first approach
- Component variants via CVA (Class Variance Authority)
- Consistent spacing and typography scales

## Development Workflow

### Environment Setup

```bash
# Required environment variables
VITE_VENDURE_API_ENDPOINT=https://your-vendure-api.com/shop-api
VITE_SITE_NAME=TanStack Storefront
VITE_COMPANY_NAME=Your Company
```

### Development Commands

```bash
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run serve    # Preview production build
npm run test     # Run Vitest tests
npm run lint     # Biome linting
npm run format   # Biome formatting
```

### Adding Components

```bash
# Add shadcn/ui components
pnpx shadcn@latest add button
pnpx shadcn@latest add dialog
```

## API Integration

### Vendure Backend

- Headless commerce platform
- GraphQL API
- Product catalog management
- Order processing
- User authentication

### GraphQL Client Setup

```typescript
// lib/vendure/client.ts
import { GraphQLClient } from "graphql-request";

export const vendureClient = new GraphQLClient(
  process.env.VITE_VENDURE_API_ENDPOINT!,
);
```

## Build System

### Vite Configuration

- TypeScript compilation
- Hot module replacement
- Asset optimization
- Environment variable handling

### Production Build

- Server-side rendering
- Static asset generation
- Route-based code splitting
- Optimized bundle output

## Testing Strategy

### Vitest Setup

- Unit testing for utilities
- Component testing with React Testing Library
- Integration testing for API calls
- E2E testing capabilities

## Performance Considerations

### SSR Implementation

- Full-document server rendering
- Streaming capabilities
- Hydration optimization
- SEO-friendly output

### Client-Side Optimizations

- Route prefetching
- Image optimization via @unpic/react
- Code splitting
- Bundle size monitoring

## Known Limitations

### Technical Constraints

- No React Server Components support
- Limited ecosystem compared to Next.js
- Newer technology with evolving APIs
- Reduced AI/LLM assistance due to novelty

### Development Considerations

- Manual documentation reading required
- Potential breaking changes in future versions
- Smaller community and fewer examples
- Learning curve for TanStack ecosystem

## Deployment

### Build Output

- Server functions for API routes
- Static assets for client-side code
- SSR-ready application bundle

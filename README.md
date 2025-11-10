# TanStack Storefront

A complete, production-ready e-commerce storefront template built with the TanStack ecosystem. Features full authentication, user registration with email verification, shopping cart management, and checkout flow.

## Features

- **Complete Authentication System**: User registration, email verification, login/logout
- **Shopping Cart**: Full cart management with persistent state
- **Checkout Flow**: Complete order processing
- **Type-Safe API Layer**: End-to-end TypeScript with GraphQL
- **Modern UI**: Responsive design with Tailwind CSS and Radix UI
- **Server-Side Rendering**: Fast initial page loads with streaming support

## Why TanStack?

### TanStack Start

- **End-to-End Type Safety**: 100% inferred TypeScript support from server to client
- **Server Functions**: Clean `createServerFn`, `createServerOnlyFn`, `createClientOnlyFn`, and `createIsomorphicFn` primitives
- **Isomorphic SSR Model**: Seamless code sharing between server and client with excellent streaming capabilities

### TanStack Router

- **100% Inferred TypeScript**: Auto-completed paths, params, and search params with full type inference
- **Type-Safe Navigation**: Compile-time route validation
- **Search Param State Management**: First-class URL state management

### Developer Experience

- **TanStack DevTools**: Powerful debugging tools for routing and forms
- **File-based Routing**: Intuitive and predictable route structure
- **Hot Module Replacement**: Fast feedback loop with Vite

## Tech Stack

- **TanStack Start**: Full-stack React framework
- **TanStack Router**: Type-safe routing
- **TanStack Form**: Form state management
- **Tailwind CSS**: Utility-first styling
- **Radix UI + shadcn/ui**: Accessible component primitives
- **GraphQL + gql.tada**: Type-safe API queries
- **Biome**: Fast linting and formatting

## Getting Started

This template is configured for deployment on Netlify, but can be adapted for other platforms.

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your storefront.

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
VITE_PARENT_ID="1"
VITE_WEBSITE_URL="http://localhost:3000"
```

**Important**: Generate a secure `SESSION_SECRET` for production deployments.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run serve    # Preview production build locally
npm run test     # Run test suite
npm run lint     # Lint code with Biome
npm run format   # Format code with Biome
```

## Project Structure

```
src/
├── routes/           # File-based routing
├── components/       # UI components
│   ├── custom/      # App-specific components
│   └── ui/          # shadcn/ui components
├── lib/             # Utilities and API client
└── styles/          # Global styles
```

## Adding Components

This template uses shadcn/ui for component primitives:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

## Deployment

### Netlify

This template includes Netlify configuration. Simply connect your repository to Netlify and deploy.

### Other Platforms

TanStack Start supports multiple deployment targets. See the [official deployment documentation](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for other platforms.

## Customization

- **Styling**: Modify `src/styles/globals.css` and Tailwind configuration
- **Components**: Customize components in `src/components/custom/`
- **API Client**: Extend GraphQL queries in `src/lib/vendure/`
- **Routes**: Add or modify routes in `src/routes/`

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Credits

Built upon queries and UI patterns from the [original Vendure and Vercel storefront](https://github.com/vendure-ecommerce/vercel-commerce/) implementations.

## License

MIT - see [LICENSE](LICENSE) file for details.

---

Built by [Guilherme de Almeida](https://github.com/guicalmeida)

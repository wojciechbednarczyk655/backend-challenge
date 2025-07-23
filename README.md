# Ounass Backend Challenge

## API Usage

- All endpoints are documented in Swagger UI: http://localhost:3000/api-docs
- Example endpoints:
  - POST /auth/register — Register a new user
  - POST /auth/login — Login and receive JWT
  - GET /auth/users — List all users (JWT required)
  - GET /health — Health check (status, uptime, version)

## Environment Variables

- See `.env.example` for all required and optional variables
- Main variables: JWT_SECRET, AUTH_MONGO_URI, AUTH_PORT, GATEWAY_PORT, APP_VERSION

## Setup Instructions

1. Install dependencies: `pnpm install` or `npm install`
2. Copy `.env.example` to `.env` and fill in values as needed
3. Start all services (local): `pnpm start:all` or `npm run start:all`
4. For Docker: `docker-compose up --build`

## Scripts & Developer Workflow

- `pnpm start:all` / `npm run start:all` — Start both gateway and authentication
- `pnpm dev` / `npm run dev` — Start both in watch mode
- `pnpm test` / `npm test` — Run all tests
- `pnpm lint` / `npm run lint` — Lint all code
- `pnpm format` / `npm run format` — Format codebase
- `docker-compose up --build` — Start all services with Docker

## Security & Best Practices

- CORS is enabled by default in NestJS; configure as needed in `main.ts`
- Use strong secrets for JWT and environment variables
- Set up HTTPS and security headers for production
- Use Docker and Compose for consistent deployments
- Health checks and rate limiting are enabled by default

## Developer Experience

- All scripts work from the root
- Rate limiting, health checks, and logging are enabled by default
- All endpoints are discoverable in Swagger
- Codebase is modular, maintainable, and production-ready

## Contributing & Support

- Please open issues or pull requests for bugs, improvements, or questions
- For urgent issues, contact the maintainer directly

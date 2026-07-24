# ShopSmart 🛒

AI-powered e-commerce platform built with Java microservices,
Spring Security JWT, and Claude AI integration.

## Architecture
- **API Gateway** — Single entry point, JWT validation, routing
- **Auth Service** — Register, login, JWT token management
- **Product Service** — Product catalog, categories, inventory
- **Order Service** — Cart, checkout, order management
- **AI Service** — Product recommendations, description generation

## Tech Stack
Java 17 · Spring Boot 3 · Spring Cloud Gateway · Spring Security ·
JWT · PostgreSQL · React 18 · Docker · Claude AI API

## Services
| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 8080 | Routes all requests |
| Auth Service | 8081 | Authentication & Authorization |
| Product Service | 8082 | Product management |
| Order Service | 8083 | Orders & Cart |
| AI Service | 8084 | AI features |
| React Frontend | 5173 | User interface |
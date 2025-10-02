# Mediametrics Service Booking API

A REST API for booking services within a company. Built with Node.js, TypeScript, Express, PostgreSQL, and Prisma ORM.

---

## Quick Start

```bash
git clone https://github.com/Artur-Badalyan/mediametrics.git
cd mediametrics
cp .env.example .env
docker-compose up --build
```

- The server will be available at [http://localhost:4000](http://localhost:4000)
---

## Migrations & Seed

```bash
npx prisma migrate dev --name init
npm run seed
```

---

## Main ENV variables

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for JWT

---

## Endpoints

| Method | URL         | Description              | Roles       |
|--------|-------------|--------------------------|-------------|
| POST   | /auth/login | Login and get JWT        | All         |
| GET    | /users/me   | Get current user profile | All (JWT)   |
| POST   | /companies  | Create a company         | ADMIN       |
| POST   | /services   | Create a service         | ADMIN/STAFF |
| POST   | /bookings   | Create a booking         | All (JWT)   |
| GET    | /bookings   | List company bookings    | ADMIN/STAFF |


---

## Swagger

API documentation is available at: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## Docker

Quick start:
```bash
docker-compose up --build
```

---

## Authors

- [Artur Badalyan](https://github.com/Artur-Badalyan)
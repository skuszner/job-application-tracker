# Job Application Tracker

A full-stack web application that helps users track job applications, statuses, and notes.

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite

**Backend**

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication

**Testing**

- Node.js
- Supertest
- Vitest

**Deployment**

- Render

## Features

- User registration and login
- JWT-based authentication
- Create, update, and delete job applications
- Track application status (Applied, Interview, Offer, Rejected)
- Filter jobs by status

## Architecture

- RESTful API
- JWT-protected routes
- Relational data model

## Running Locally

1. Clone the repository
2. Change to the backend directory: `cd backend`
3. Install backend dependencies: `npm install`
4. Set up Prisma and PostgreSQL database and configure environment variables
5. Run database migrations: `npx prisma migrate dev`
6. Generate Prisma client: `npx prisma generate`
7. Start the backend: `npm run dev`
8. Change to the frontend directory: `cd ../frontend`
9. Install frontend dependencies: `npm install`
10. Configure environment variables
11. Start the frontend: `npm run dev`

## Live Demo

- Frontend: https://job-application-tracker-iree.onrender.com
- Backend API: https://job-application-tracker-backend-ju54.onrender.com

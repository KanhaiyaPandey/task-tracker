# Task Tracker

A full-stack task management app built with a **React Native (Expo)** mobile client and an **Express + TypeScript** backend, managed as a **pnpm monorepo** with **Turborepo**.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting EXPO_PUBLIC_API_URL](#getting-expo_public_api_url)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Reference](#api-reference)
- [Architecture Overview](#architecture-overview)

---

## Project Structure

```
task-tracker/                   ← monorepo root
├── apps/
│   ├── mobile/                 ← Expo React Native app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   └── TaskForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── navigation/
│   │   │   │   └── AppNavigator.tsx
│   │   │   ├── screens/
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   ├── LandingScreen.tsx
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   └── services/
│   │   │       └── api.ts
│   │   ├── App.tsx
│   │   ├── app.json
│   │   └── package.json
│   │
│   └── server/                 ← Express TypeScript API
│       ├── src/
│       │   ├── controllers/
│       │   │   ├── authController.ts
│       │   │   └── task.controller.ts
│       │   ├── middleware/
│       │   │   └── authMiddleware.ts
│       │   ├── models/
│       │   │   ├── User.ts
│       │   │   └── task.model.ts
│       │   ├── routes/
│       │   │   ├── authRoutes.ts
│       │   │   └── task.routes.ts
│       │   ├── app.ts
│       │   └── server.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                   ← shared packages (future use)
├── .env                        ← root env (read by server)
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native, Expo SDK 54, TypeScript |
| Navigation | React Navigation (Native Stack) |
| Server state | TanStack Query v5 |
| HTTP client | Axios |
| Auth storage | AsyncStorage |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Monorepo | pnpm workspaces, Turborepo |

---

## Prerequisites

Make sure the following are installed before you begin.

| Tool | Version | Install |
|---|---|---|
| Node.js | >= 20.19.0 | https://nodejs.org |
| pnpm | >= 9.0.0 | `npm install -g pnpm` |
| MongoDB | any recent | https://www.mongodb.com/try/download/community |
| Expo CLI | latest | bundled via `npx expo` |
| Expo Go app | latest | iOS App Store / Google Play |

---

## Environment Variables

### Backend — root `.env`

Create a `.env` file at the **monorepo root** (copy from `.env.example`):

```bash
cp .env.example .env
```

```env
# .env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/task-tracker
JWT_SECRET=your-super-secret-key-change-this
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the Express server listens on | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/task-tracker` |
| `JWT_SECRET` | Secret used to sign JWT tokens — **change this** | — |

### Mobile — `apps/mobile/.env`

Create a `.env` file inside `apps/mobile/`:

```bash
touch apps/mobile/.env
```

```env
# apps/mobile/.env
EXPO_PUBLIC_API_URL=http://<YOUR_MACHINE_IP>:4000/api
```

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Full URL of the backend API. Required when running on a physical device. |

> **Simulator / emulator only:** If you are only using an iOS Simulator or Android Emulator on the same machine as the server, you can omit this variable — the app auto-detects the host.

---

## Getting EXPO_PUBLIC_API_URL

The mobile app needs to reach your backend over the network. `localhost` only works on the same machine, so you must use your **local network IP address** when running on a physical phone.

### macOS

Open **Terminal** and run:

```bash
ipconfig getifaddr en0
```

If that returns nothing (e.g. you are on Wi-Fi via a different interface), try:

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Look for an address starting with `192.168.x.x` or `10.x.x.x`. Then set:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.42:4000/api
```

### Windows

Open **Command Prompt** or **PowerShell** and run:

```cmd
ipconfig
```

Find the **IPv4 Address** under your active network adapter (usually "Wireless LAN adapter Wi-Fi" or "Ethernet adapter"). It will look like `192.168.1.42`. Then set:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.42:4000/api
```

### Linux

Open a terminal and run:

```bash
ip addr show
# or
hostname -I
```

Find the IP under your active interface (`wlan0`, `eth0`, `enp3s0`, etc.) — it will look like `192.168.1.42`. Then set:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.42:4000/api
```

### Android Emulator (any OS)

Android emulators map `10.0.2.2` to the host machine's `localhost`. The app handles this automatically, so no env variable is needed for emulator usage.

### Important notes

- Your phone and your development machine **must be on the same Wi-Fi network**.
- If you have a firewall, allow inbound connections on port `4000`.
- The IP can change when you reconnect to Wi-Fi — re-check if the app stops connecting.

---

## Installation

Install all dependencies from the monorepo root:

```bash
pnpm install
```

This installs dependencies for all workspaces (`apps/server`, `apps/mobile`) in one step.

---

## Running the Project

### 1. Start MongoDB

Make sure MongoDB is running locally:

```bash
# macOS / Linux (if installed as a service)
brew services start mongodb-community
# or run directly
mongod --dbpath /usr/local/var/mongodb

# Windows (if installed as a service)
net start MongoDB
```

### 2. Start everything (recommended)

From the monorepo root, run both server and mobile in parallel via Turborepo:

```bash
pnpm dev
```

### 3. Start individually

**Backend only:**

```bash
cd apps/server
pnpm dev
# Server starts at http://localhost:4000
```

**Mobile only:**

```bash
cd apps/mobile
pnpm dev
# Expo DevTools opens — scan QR code with Expo Go on your phone
```

### 4. Open the app

- **Physical device:** Install [Expo Go](https://expo.dev/go), scan the QR code shown in the terminal.
- **iOS Simulator:** Press `i` in the Expo terminal.
- **Android Emulator:** Press `a` in the Expo terminal.

---

## API Reference

Base URL: `http://localhost:4000/api`

### Auth

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/auth/register` | `{ name, email, password }` | Create a new account |
| `POST` | `/auth/login` | `{ email, password }` | Login, returns `{ token }` |

### Tasks

All task routes expect an `Authorization: Bearer <token>` header.

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `GET` | `/tasks` | — | Get all tasks, newest first |
| `POST` | `/tasks` | `{ title, description? }` | Create a task |
| `PATCH` | `/tasks/:id` | `{ title?, description?, completed? }` | Update a task |
| `DELETE` | `/tasks/:id` | — | Delete a task, returns `{ message }` |

### Health check

```
GET /health  →  { "ok": true }
```

---

## Architecture Overview

### Monorepo layout

The repo uses **pnpm workspaces** so packages can share `node_modules` and **Turborepo** to run `dev`, `build`, and `lint` tasks across apps in the correct order with caching.

### Mobile app

```
App.tsx
  └── AppNavigator          ← NavigationContainer + QueryClientProvider
        ├── useAuth          ← reads AsyncStorage token on startup
        │     ↓ token?
        ├── Home             ← authenticated
        └── Landing → Login / Register   ← unauthenticated

services/api.ts
  ├── Axios instance         ← baseURL auto-detected (env > dev host > localhost)
  ├── Request interceptor    ← attaches Bearer token from AsyncStorage
  └── API functions          ← loginRequest, registerRequest, fetchTasks, …

HomeScreen
  ├── useQuery(['tasks'])    ← TanStack Query fetches + caches task list
  ├── useMutation (create)   ← POST /tasks → invalidate ['tasks']
  ├── useMutation (toggle)   ← PATCH /tasks/:id → invalidate ['tasks']
  └── useMutation (delete)   ← DELETE /tasks/:id → invalidate ['tasks']
```

### Backend server

```
server.ts          ← connects MongoDB, starts Express
app.ts             ← registers middleware + mounts routes
  ├── /api/auth    ← authRoutes (register, login)
  └── /api/tasks   ← taskRoutes (CRUD)

controllers/
  ├── authController.ts   ← bcrypt hash, JWT sign/verify
  └── task.controller.ts  ← Mongoose queries, ID validation

models/
  ├── User.ts             ← email + passwordHash
  └── task.model.ts       ← title, description, completed, timestamps
```

### Authentication flow

1. User registers → password hashed with bcrypt → stored in MongoDB.
2. User logs in → bcrypt compare → JWT signed with `JWT_SECRET` (7-day expiry) → returned to client.
3. Client saves token in **AsyncStorage**.
4. Every Axios request attaches `Authorization: Bearer <token>` via an interceptor.
5. On app restart, `useAuth` reads AsyncStorage — if a token exists, the app opens directly on the Home screen.
6. Logout clears the token from AsyncStorage and resets navigation to the Landing screen.

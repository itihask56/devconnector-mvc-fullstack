# 🚀 DevConnector – Fullstack MVC Developer Social App

A LinkedIn-style social app built with **Node.js**, **MongoDB**, **Redis**, **Docker**, and fully tested with **Jest & Playwright**.

![banner](https://your-image-link-if-any.com) <!-- Optional project banner -->

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Docker Setup](#docker-setup)
- [Deployment Guide](#deployment-guide)
- [License](#license)

---

## ✨ Features

- 👤 User registration/login with JWT auth
- 🔐 Redis-based token blacklisting (logout)
- 🧑‍💻 Developer profile creation (bio, skills, GitHub)
- 📝 Create, delete, and interact with posts
- 💬 Comment and like functionality
- 🧪 Fully tested: API + E2E UI
- 🐳 Dockerized frontend & backend
- ☁️ Deployable to AWS EC2 with Mongo Atlas + Redis

---

## 🧱 Tech Stack

| Layer        | Tech Used                             |
|-------------|----------------------------------------|
| Frontend     | HTML, CSS, JavaScript                 |
| Backend      | Node.js, Express.js                   |
| Database     | MongoDB, Mongoose                     |
| Auth         | JWT, bcrypt, Redis                    |
| Validation   | validator npm package                 |
| Testing      | Jest, Supertest (API), Playwright (E2E)|
| Containerization | Docker, Docker Compose            |
| Hosting      | AWS EC2 (app), Mongo Atlas (DB), S3 (assets optional) |

---

## 📁 Project Structure (MVC + Dockerized)

<details> <summary>📁 <strong>Click to view full Project Structure</strong></summary>
<br>

```bash
 devconnector/
├── backend/                     # Node.js backend (MVC)
│   ├── config/                  # MongoDB, Redis setup
│   ├── controllers/             # Request handling logic
│   ├── routes/                  # Route definitions
│   ├── models/                  # Mongoose schemas
│   ├── middleware/              # Auth, error handlers
│   ├── utils/                   # JWT helpers, validators
│   ├── tests/                   # Jest + Supertest test files
│   ├── app.js                   # Express app configuration
│   └── server.js                # Main backend entry point
│
├── frontend/                    # Static frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   └── assets/
│       ├── css/
│       └── js/
│
├── docker/                      # Docker configurations
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── playwright.config.js         # Playwright E2E test config
├── .env                         # Environment variables
└── README.md                    # Project documentation
```
</details>


---

## 🛠️ Getting Started

### Prerequisites
- Node.js, Docker, MongoDB (or Atlas)
- Redis
- Git

### Clone the Repo

```bash
git clone https://github.com/your-username/devconnector-mvc-fullstack.git
cd devconnector-mvc-fullstack
```

### Install Dependencies
```bash
cd backend
npm install
```

## Environment Variables
### Create a .env in backend/:

```bash
PORT=5000
MONGO_URI=mongodb://mongo:27017/devconnector
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://redis:6379
```

## 🔌 API Endpoints (Sample)
### Method	Route	Description

```bash
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and get token
POST	/api/auth/logout	Invalidate token
GET	/api/profile/me	Get current user's profile
POST	/api/posts	Create a new post
POST	/api/posts/:id/comment	Comment on a post
```


## 🧪 Testing
### ✅ Run Jest + Supertest (Unit/API)
```
bash
 
cd backend
npm run test
```
### 🎭 Run Playwright (E2E UI)
```
bash
 
npx playwright install
npx playwright test
```
- Tests login, post, and profile flows.


## 🐳 Docker Setup
### Build and Run All Services
```bash
 
docker-compose up --build
```
- Frontend → http://localhost:3000
- Backend API → http://localhost:5000




## 🌐 Deployment Guide (AWS EC2)
### Launch an EC2 Ubuntu instance

- Install Docker & Git
- Clone this repo
```bash
Run: docker-compose up -d
```

### Attach Elastic IP

- Setup Nginx (optional for domain + HTTPS)

- Use MongoDB Atlas & Redis (Upstash or EC2)

## 🪪 License
- MIT License © 2025 Itihash Verma
- Feel free to fork, clone, contribute, or build on top of it.

## 📢 Feedback & Contributions
- PRs welcome. Suggestions? Open an issue

## 👋 Made with ☕ and 🚀 by Itihash Verma
 
### ✅ Final Tips:
- Replace `your-username` with your actual GitHub username
- Add a project banner if you can (Canva works great)
- Commit this as:
```bash
git add README.md
git commit -m "📖 Added complete README documentation"
git push origin main
```

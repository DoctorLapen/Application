# Events Project

## Overview

This project is a full-stack application built with the following technologies:

**Backend**

* NestJS

**Frontend**

* React (Vite)

**Database**

* PostgreSQL (Supabase instance)

**ORM**

* TypeORM

**Infrastructure**

* Docker & Docker Compose

**API Documentation**

* Swagger

Supabase is used as a hosted **PostgreSQL** instance and is connected to the backend via **TypeORM**.

---

# 🚀 Quick Start

## Requirements

Make sure the following tools are installed:

* Docker
* Docker Compose
* Git

---

## Run the Project

Clone the repository:

```bash
git clone <your-repository-url>
cd <project-folder>
```

Start the application:

```bash
docker-compose up --build
```

Run in background:

```bash
docker-compose up -d
```

Stop containers:

```bash
docker-compose down
```

---

# 🌐 Access the Application

After starting the containers the application will be available at:

### Frontend

```
http://localhost
```

### Backend API

```
http://localhost:3000
```

### Swagger API Documentation

```
http://localhost:3000/api
```

The Swagger page allows you to explore and test all available API endpoints.

---

# 📂 Project Structure

```
backend/              NestJS API
frontend/             React Vite application
docker-compose.yml    Docker configuration
README.md
```

---

# 🗄 Database

The project uses **Supabase PostgreSQL** as a hosted database instance.

Connection is handled through **TypeORM** inside the NestJS backend.

---

# ⚙️ Environment Variables

## Backend

Backend environment variables are located in:

```
backend/.env
```

Example configuration:

```env
DB_TYPE=postgres       
DATABASE_URL=postgresql://postgres.cmumfeehusscdsslsbin:zDXKdI0mPKV4zrXG@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
DB_SSL=true            
DB_SYNCHRONIZE=false  
DB_AUTOLOAD_ENTITIES=true 
JWT_SECRET=your_jwt_secret
```

---

## Frontend

Frontend environment variables are located in:

```
frontend/.env
```

Example configuration:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_PORT=5173
```

These variables are automatically loaded using **Docker Compose**.

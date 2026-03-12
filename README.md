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

The backend connects to a Supabase-hosted PostgreSQL instance via **TypeORM**.

---

> ⚠️ **Security Notice**
>
> Normally, sensitive information such as database credentials, JWT secrets, and `.env` files should **not be committed to a public repository**.
>
> In this project, these files are included **only for the purpose of the test assignment**, to allow the application to be quickly launched and tested using **Docker** without additional configuration.
>
> In a real production environment, these values would be managed using secure environment variables and secret management tools.

---

# 🚀 Quick Start

## Requirements

Ensure the following tools are installed:

* Docker
* Docker Compose
* Git

---

## Run the Project

Clone the repository:

```bash
git clone https://github.com/DoctorLapen/Application.git
cd Application
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

After starting the containers, the application will be available at:

### Frontend

```text
http://localhost
```

### Backend API

```text
http://localhost:3000
```

### Swagger API Documentation

```text
http://localhost:3000/api
```

Swagger provides an interactive interface to explore and test all backend endpoints.

---

# 📂 Project Structure

```text
backend/              NestJS API
frontend/             React Vite application
docker-compose.yml    Docker configuration
README.md
```

---

# 🗄 Database

The project uses **Supabase PostgreSQL** as a hosted database instance.

The backend connects to the database using **TypeORM**.

Supabase is used only as a **PostgreSQL provider**, while all database access and entity management are handled inside the backend.

---

# ⚙️ Environment Variables

## Backend

Backend environment variables are located in:

```text
backend/.env
```

Example configuration:

```env
DB_TYPE=postgres
DATABASE_URL=postgresql://postgres.cmumfeehusscdsslsbin:zDXKdI0mPKV4zrXG@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
DB_SSL=true
DB_SYNCHRONIZE=false
DB_AUTOLOAD_ENTITIES=true
JWT_SECRET=6bb4b30e32c96c19e0be6b91bc07bcb7b35cdf9113ebdfa4699d42ab20cef84f
```

---

## Frontend

Frontend environment variables are located in:

```text
frontend/.env
```

Example configuration:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_PORT=5173
```

These variables are automatically loaded using **Docker Compose**.

---

# 🛠 Technologies Used

## Backend

* NestJS
* TypeORM
* PostgreSQL (Supabase)

## Frontend

* React
* Vite
* TypeScript
* React Router
* Redux Toolkit
* Tailwind CSS

## Infrastructure

* Docker
* Docker Compose
* Swagger

# Quiz-IT

Full-stack quiz platform built with modern technologies, focusing on performance, scalability, and clean architecture.

🌐 Live: https://quiz-it.online  
💻 Source: https://github.com/AskoldTheFirst/quiz-it

---

## 🚀 Overview

Quiz-IT is a production-ready web application that allows users to take quizzes across different technology domains, track performance, and view statistics.

The system is designed with a strong focus on:
- Clean architecture
- Performance optimization
- Scalable backend design
- Responsive and efficient frontend

---

## 🧱 Architecture

### Backend
- ASP.NET Core (.NET 10)
- RESTful API
- JWT authentication
- Entity Framework Core
- SQL Server

### Frontend
- React + TypeScript
- Redux for state management
- Material UI

### Infrastructure
- Azure App Service (API)
- Azure Static Web Apps (Frontend)
- Azure SQL Database
- CI/CD pipelines (GitHub / Azure)

---

## ⚙️ Key Features

- User authentication (JWT-based)
- Quiz engine with multiple topics
- Real-time test flow
- Score calculation and statistics
- Persistent user progress
- Responsive UI

---

## ⚡ Performance & Design Decisions

- Optimized database queries to reduce latency
- Minimized unnecessary React re-renders
- Used async workflows and cancellation tokens
- Designed lightweight DTO-based API responses
- Implemented caching strategies for frequently accessed data

---

## 🧠 What I focused on

This project was built to demonstrate:

- System architecture design
- High-performance backend development
- Clean separation of concerns (DAL / BLL / API)
- Real-world full-stack integration
- Cloud deployment (Azure)

---

## 📦 Tech Stack

**Backend**
- C#, .NET 10, ASP.NET Core
- EF Core, SQL Server

**Frontend**
- React, TypeScript, Redux, Material UI

**DevOps / Cloud**
- Azure (App Service, Static Web Apps, SQL)
- CI/CD pipelines

---

## 🛠️ Running locally

```bash
# backend
cd backend
dotnet run

# frontend
cd frontend
npm install
npm run dev
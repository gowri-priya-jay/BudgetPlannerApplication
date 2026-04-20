# Budget Planner Application

A full‑stack personal finance management system built with **React (Vite)**, **Spring Boot**, **JWT Authentication**, and **MySQL**.  
The project is fully containerized using **Docker Compose** for easy local development and deployment.

---

## 🚀 Features

### **Frontend (React + Vite)**
- Modern, fast React app using Vite
- Clean UI with dashboard, charts, and grouped planners
- Login & Register pages with JWT authentication
- Protected routes and role‑based access
- Expense tracking, goal planning, and activity reports
- Client‑side filtering, sorting, and premium UI components

### **Backend (Spring Boot)**
- JWT‑based authentication & authorization
- Secure login and registration endpoints
- REST APIs for expenses, goals, activities, and reports
- CORS configured for local and Docker environments
- MySQL integration with JPA/Hibernate

### **Database (MySQL)**
- Runs inside Docker
- Persistent volume storage
- Supports importing `.sql` dumps

### **Docker**
- One‑command startup using Docker Compose
- Backend, frontend, and MySQL run as separate services
- Hot‑reload support for frontend

---

## 🗂️ Project Structure

```
BudgetPlannerApplication/
│
├── backend/               # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/              # React + Vite application
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml     # Multi-container setup
└── README.md
```

---

## 🛠️ Running the Project (Docker)

### **1. Build backend JAR**
```
cd backend
mvn clean package -DskipTests
```

### **2. Start all services**
From the root folder:

```
docker compose up --build -d
```

### **3. Access the app**
- Frontend → http://localhost:3000  
- Backend → http://localhost:9090  
- MySQL → localhost:3306 (inside Docker network)

---

## 🗄️ Importing Database Data

Place your `.sql` file in the project root and run:

```
docker exec -i financetracker-mysql mysql -u root -proot financetracker < finances.sql
```

---

## 🔐 Authentication Flow

- User logs in → backend returns JWT
- Frontend stores token securely
- All protected API calls include `Authorization: Bearer <token>`
- Spring Security validates token via `JwtFilter`

---

## 📦 Environment Variables

### **Backend**
Located in `application.properties` or Docker env:

```
spring.datasource.url=jdbc:mysql://db:3306/financetracker
spring.datasource.username=root
spring.datasource.password=root
jwt.secret=your-secret-key
```

### **Frontend**
Create `.env`:

```
VITE_API_URL=http://localhost:9090
```

---

## 🧪 Future Enhancements

- Budget forecasting with charts
- Multi‑currency support
- Export reports as PDF
- Mobile‑friendly UI
- Dark mode

---

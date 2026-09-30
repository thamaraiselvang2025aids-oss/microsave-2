# MicroSave
MicroSave is a modern, lightweight microfinance and savings management application. Built with a robust Spring Boot backend and a stunning, responsive Dark Glassmorphism frontend UI.

## Features
- **Member Management:** Add, edit, and search for members seamlessly. 
- **Quick Profile Search:** Instantly look up members right from the dashboard to see an aggregated profile (total savings, outstanding loans, and repayment deadlines).
- **Savings Tracking:** Record and monitor member savings contributions dynamically.
- **Loan Management:** Issue loans, set repayment deadlines, and track loan statuses in real-time.
- **Repayment Processing:** Log repayments that automatically update outstanding loan balances and loan statuses (Paid, Pending, Overdue, Due Soon).
- **Dynamic Dashboard:** A rich, real-time analytics dashboard presenting available balances and quick insights.
- **Dark Glassmorphism UI:** A highly polished, aesthetic user interface prioritizing user experience and fluid animations.

## Tech Stack
- **Backend:** Java, Spring Boot, Spring Data JPA
- **Database:** H2 (In-memory, perfect for fast deployment and testing)
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+), Fetch API
- **Architecture:** RESTful API with a Single Page Application (SPA) frontend

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven (or use the provided Maven wrapper `mvnw`)

### Running the Application Locally
1. **Clone the repository:**
   ```bash
   git clone https://github.com/thamaraiselvang2025aids-oss/microsave-2.git
   cd microsave-2
   ```

2. **Run the Spring Boot app:**
   Use the Maven wrapper to build and start the server:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows, use `.\mvnw.cmd spring-boot:run`)*

3. **Access the Application:**
   Open your browser and navigate to: `http://localhost:8080`

---

## Project Structure

```text
microsave-2/
├── src/
│   ├── main/
│   │   ├── java/com/example/microsave/
│   │   │   ├── controller/      # REST API Endpoints (Member, Loan, Savings, Repayment)
│   │   │   ├── entity/          # JPA Entities mapping to DB tables
│   │   │   ├── repository/      # Spring Data JPA Interfaces
│   │   │   ├── service/         # Business Logic layer
│   │   │   └── MicrosaveApplication.java # Spring Boot Main Class
│   │   │
│   │   └── resources/
│   │       ├── static/          # Frontend SPA (Vanilla HTML/CSS/JS)
│   │       │   ├── index.html   # Main Dashboard & UI layout
│   │       │   ├── script.js    # API Fetching & DOM manipulations
│   │       │   └── style.css    # Dark Glassmorphism CSS styling
│   │       │
│   │       └── application.properties # H2 Database & Server Configurations
│   │
│   └── test/                    # JUnit and Spring Boot Tests
├── pom.xml                      # Maven Dependencies
└── README.md                    # Project Documentation
```

---

## Postman API Requests
Use the following JSON structures and endpoints to test the API via Postman. All requests should be made to `http://localhost:8080`.

### 1. Members
**Create Member (POST `/api/members`)**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "address": "123 Main St, Tech City",
  "joinDate": "2024-01-15"
}
```
**Get All Members (GET `/api/members`)**

### 2. Savings
**Create Savings Deposit (POST `/api/savings`)**
```json
{
  "member": { "id": 1 },
  "amount": 5000.0,
  "contributionDate": "2024-02-01"
}
```
**Get All Savings (GET `/api/savings`)**

### 3. Loans
**Create Loan (POST `/api/loans`)**
```json
{
  "member": { "id": 1 },
  "amount": 10000.0,
  "loanDate": "2024-02-10",
  "paymentDeadline": "2024-08-10"
}
```
**Get All Loans (GET `/api/loans`)**

### 4. Repayments
**Process Repayment (POST `/api/repayments`)**
```json
{
  "loan": { "id": 1 },
  "repaymentAmount": 2000.0,
  "repaymentDate": "2024-03-05"
}
```
**Get All Repayments (GET `/api/repayments`)**

---

## License
Open Source. Feel free to fork and customize for your own financial tracking needs!

---

## MySQL Workbench Commands
If you decide to migrate from the default in-memory H2 database to MySQL, you can use the following commands in **MySQL Workbench** to interact with your database:

```sql
CREATE DATABASE microsave;
SHOW DATABASES;
use microsave;
USE microsave;
SHOW TABLES;
SELECT * FROM loans;
select * FROM members;
select * from repayments;
select * from savings;
```

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
   Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Application Structure
- **Backend Code:** `/src/main/java/com/example/microsave/`
  - Controllers, Services, and Entities are structured cleanly for easy maintenance.
- **Frontend Code:** `/src/main/resources/static/`
  - `index.html`: The main SPA layout and modal structures.
  - `style.css`: All the glassmorphism UI styles, gradients, and responsive grids.
  - `script.js`: Frontend logic for fetching data, DOM manipulation, and dynamic dashboard calculations.

## API Endpoints
- **Members:** `GET`, `POST`, `PUT`, `DELETE` at `/api/members`
- **Savings:** `GET`, `POST`, `PUT`, `DELETE` at `/api/savings`
- **Loans:** `GET`, `POST`, `PUT`, `DELETE` at `/api/loans`
- **Repayments:** `GET`, `POST`, `PUT`, `DELETE` at `/api/repayments`

## License
Open Source. Feel free to fork and customize for your own financial tracking needs!

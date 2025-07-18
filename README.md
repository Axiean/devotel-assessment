## Devotel Assessment: Data Transformation and API Integration

This project is a backend application built with NestJS that integrates with two external APIs to fetch job offers. The data is transformed into a unified structure, stored in a MySQL database, and exposed via a RESTful API with filtering and pagination.

---

### Features

- Data Aggregation: Fetches job offers from two distinct provider APIs.

- Scalable Transformation: Uses a Strategy pattern to easily add new data providers with minimal code changes.

- Scheduled Synchronization: A cron job runs periodically to fetch and store new job offers, preventing duplicates.

- Database Storage: Stores unified job offer data in a MySQL database using TypeORM.

- RESTful API: Exposes a /job-offers endpoint to retrieve and filter job data.

- Filtering & Pagination: The API supports filtering by title, location, and salary range, along with pagination.

- Robust Error Handling: Implements a global exception filter for consistent error responses.

- Validation: Uses DTOs and the ValidationPipe to validate incoming request data.

- API Documentation: Auto-generated API documentation available via Swagger UI.

- Comprehensive Testing: Includes unit, integration, and end-to-end (e2e) tests.

---

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Axiean/devotel-assessment.git
cd devotel-assessment
```

2. Install dependencies:

```bash
npm install
```

### Environment Configuration

This project uses environment variables for configuration. You will need to create a `.env.development` file in the project root.

1. Create the environment file from the example::

```bash
cp .env.example .env.development
```

For production deployments, it is best practice to use a separate configuration file. You should create a `.env.production` file in the project root.

When you run npm run start:prod, the application will automatically load variables from this `.env.production` file. This allows you to use different, more secure database credentials and other settings for your live environment.

2. Edit the `.env.development` file:
   Open the newly created `.env.development` file and fill in your database credentials.

#.env.development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=devotel_db

3. Create the database:
   Connect to your MySQL server and run the following command to create the database:

```bash
CREATE DATABASE `devotel_db` ;
```

### Running the Application

This command starts the application in watch mode with hot-reloading enabled. The server will restart automatically when you make changes to the code.

```bash
npm run start:dev
```

The application will be running on http://localhost:3000

#### Production Mode

To build and run the application for production:

```bash
# 1. Build the project
npm run build

# 2. Start the production server
npm run start:prod
```

### Running Tests

#### All Tests

To run all unit, integration, and end-to-end tests:

```bash
npm test
```

#### End-to-End (E2E) Tests

To run only the end-to-end tests, which test the API endpoints:

```bash
npm run test:e2e
```

#### Test Coverage

To generate a test coverage report:

```bash
npm run test:cov
```

The report will be generated in the coverage directory at the project root.

---

### API Documentation (Swagger)

This project includes comprehensive, auto-generated API documentation using Swagger (OpenAPI).

Once the application is running, you can access the interactive Swagger UI at the following URL:

http://localhost:3000/api

The documentation provides details on all available endpoints, request parameters, request bodies, and response schemas. You can also use it to send test requests directly to the API.

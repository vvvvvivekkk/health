# Health Center Management System

A MEAN stack application for managing a university health center, including appointments, medical records, and user authentication.

## Features

- User authentication (students, staff, admin)
- Appointment scheduling and management
- Medical records management
- Dashboard with summary statistics
- Responsive design with Angular Material

## Tech Stack

- **MongoDB**: Database for storing users, appointments, and medical records
- **Express**: Backend API framework
- **Angular**: Frontend framework with Angular Material UI components
- **Node.js**: JavaScript runtime for the backend

## Project Structure

```
health/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── ...
│   │   ├── assets/
│   │   └── ...
│   └── ...
├── .env
├── package.json
└── render.yaml
```

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas account
- Angular CLI

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```
4. Configure environment variables:
   - Update the `.env` file with your MongoDB connection string

### Running the Application

1. Start the backend server:
   ```
   npm run server
   ```
2. Start the Angular frontend:
   ```
   cd frontend
   npm start
   ```
3. Access the application at `http://localhost:4200`

## Deployment

This project is configured for deployment on Render using the `render.yaml` file.

1. Create a Render account
2. Connect your GitHub repository
3. Set up the environment variables in Render dashboard
4. Deploy the application

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

### Medical Records
- `GET /api/records` - Get all medical records
- `POST /api/records` - Create a new medical record
- `PUT /api/records/:id` - Update a medical record
- `DELETE /api/records/:id` - Delete a medical record"# health" 

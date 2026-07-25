# Instagram Clone

An Instagram-style social media clone built as a daily-progress learning project. The project is currently in progress and the backend foundation is being developed first.

## Project Status

Work in progress.

Current progress includes:

- Backend project initialized with Node.js and Express
- MongoDB connection setup using Mongoose
- Environment variable support with dotenv
- User model created with username, email, password, and timestamps
- Basic server entry point configured

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- bcrypt
- cookie-parser

## Folder Structure

```text
Instagram/
+-- Backend/
|   +-- server.js
|   +-- package.json
|   +-- package-lock.json
|   +-- src/
|       +-- app.js
|       +-- config/
|       |   +-- database.js
|       +-- models/
|           +-- user.model.js
+-- insta.txt
+-- README.md
```

## Backend Setup

Go to the backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `Backend` folder and add:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
```

Run the backend server:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

## Upcoming Commits

Planned next updates:

- Create authentication APIs
- Add user registration
- Add user login
- Add user logout
- Add JWT or token-based authentication
- Add password hashing with bcrypt
- Add cookie-based auth flow
- Add token blacklist or logout handling
- Add OTP-based registration
- Create post APIs
- Add create post feature
- Add feed API
- Add like post feature
- Add save post feature
- Add followers and following system
- Add frontend after backend APIs are ready

## Daily Progress

This repository is updated step by step with daily commits. Each commit represents a new feature, setup task, or improvement in the Instagram clone project.

## Author

Swarup Das

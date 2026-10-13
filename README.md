# Instagram Clone - MERN Full Stack Project

A complete full-stack Instagram-style social media application built with React, Node.js, Express, MongoDB, ImageKit, and cookie-based JWT authentication.

This project includes authentication, protected routes, post upload, home feed, explore feed, likes, comments, saved posts, follow/unfollow, profile editing, followers/following lists, suggested users, and user search.

## Project Status

Completed as a full-stack learning project.

The app is split into two main parts:

- `Backend` - Express REST API, MongoDB models, authentication, image upload, social graph, posts, comments, likes, saved posts
- `Frontend` - React/Vite client, protected routing, Instagram-style UI, feed, profile, search, explore, create post, interactions

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- React Hook Form
- React Toastify
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- cors
- multer
- ImageKit
- dotenv

### Tools

- Git and GitHub
- Render deployment ready
- MongoDB Atlas
- ImageKit media storage

## Main Features

### Authentication

- User registration
- User login
- Cookie-based JWT authentication
- Protected app routes
- Protected auth routes
- Logout with backend cookie clearing
- `get-me` API for session restore after refresh

### Posts

- Create image posts
- Multiple image upload support
- Image upload through ImageKit
- Captions
- Post details API
- Current user's posts
- User profile posts

### Home Feed

- Shows posts from followed users
- Empty state for new users
- Suggested users on desktop and mobile
- Real database-backed suggestions
- Excludes current user and already-followed users

### Explore Feed

- Global post discovery
- Shows posts from all users
- Works like an image-based Reels/discovery page
- No video upload or playback

### Likes

- Like post
- Unlike post
- Prevent duplicate likes
- Show like count
- Show current user's liked state
- Open list of users who liked a post
- Navigate to liked users' profiles

### Comments

- Fetch comments by post
- Add comments
- Delete own comments
- Empty comment validation
- Comment count
- Comment author profile image and username

### Saved Posts

- Save/bookmark posts
- Unsave posts
- Persist saved posts in MongoDB
- Show saved state in feed cards
- Profile `Saved` tab for current user

### Follow System

- Follow users
- Unfollow users
- Prevent self-follow
- Prevent duplicate follows
- Followers list
- Following list
- Clickable follower/following counts
- Follow status API
- Suggested users API

### Profiles

- Own profile page
- Other users' profile pages
- Profile picture
- Username
- Display name
- Bio
- Post count
- Follower count
- Following count
- Profile posts grid
- Click grid post to open full post modal
- Edit profile for own profile only
- Update display name, bio, and profile image

### Search

- Database-backed user search
- Search by username
- Search by display name
- Case-insensitive partial matching
- Debounced frontend search
- Navigate to searched user profile

## Folder Structure

```text
Instagram/
|-- Backend/
|   |-- package.json
|   |-- package-lock.json
|   |-- server.js
|   |-- src/
|       |-- app.js
|       |-- config/
|       |   |-- database.js
|       |   |-- imagekit.js
|       |-- controllers/
|       |   |-- auth.controller.js
|       |   |-- comment.controller.js
|       |   |-- follow.controller.js
|       |   |-- post.controller.js
|       |   |-- userProfile.controller.js
|       |-- middlewares/
|       |   |-- auth.middleware.js
|       |   |-- error.middleware.js
|       |-- models/
|       |   |-- comment.model.js
|       |   |-- follow.model.js
|       |   |-- like.model.js
|       |   |-- post.model.js
|       |   |-- savedPost.model.js
|       |   |-- user.model.js
|       |-- routes/
|       |   |-- auth.route.js
|       |   |-- follow.route.js
|       |   |-- post.route.js
|       |   |-- userProfile.route.js
|       |-- services/
|       |   |-- comment.service.js
|       |   |-- follow.service.js
|       |   |-- post.service.js
|       |   |-- user.service.js
|       |   |-- userProfile.service.js
|       |-- utils/
|           |-- apiError.js
|           |-- apiResponse.js
|           |-- asyncHandler.js
|           |-- token.js
|
|-- Frontend/
|   |-- package.json
|   |-- package-lock.json
|   |-- index.html
|   |-- vite.config.js
|   |-- eslint.config.js
|   |-- src/
|       |-- main.jsx
|       |-- App.jsx
|       |-- index.css
|       |-- routes/
|       |   |-- AppRoutes.jsx
|       |-- layouts/
|       |   |-- AuthLayout.jsx
|       |   |-- MainLayout.jsx
|       |   |-- ProtectedAuthLayout.jsx
|       |   |-- ProtectedMainLayout.jsx
|       |-- features/
|           |-- AuthProvider.jsx
|           |-- auth/
|           |   |-- hooks/
|           |   |-- pages/
|           |   |-- services/
|           |-- post/
|           |   |-- components/
|           |   |-- hooks/
|           |   |-- pages/
|           |   |-- services/
|           |-- shared/
|               |-- components/
|
|-- README.md
```

## Architecture Followed

The project follows a feature-based full-stack structure.

### Backend Architecture

- `server.js` starts the server and connects MongoDB.
- `app.js` configures Express, CORS, cookies, JSON parsing, and routes.
- `routes` define API endpoints.
- `controllers` handle request/response logic.
- `services` contain main business logic and database operations.
- `models` define MongoDB/Mongoose schemas.
- `middlewares` handle authentication and errors.
- `utils` contain reusable API response, error, async handler, and JWT helpers.
- `config` contains database and ImageKit setup.

### Frontend Architecture

- `routes` define public and protected routes.
- `layouts` separate auth screens and main app screens.
- `features/auth` contains auth pages, hooks, and API services.
- `features/post` contains feed, profile, explore, search, create post, post card, hooks, and API services.
- `features/shared` contains reusable shared UI like navbar.
- `AuthProvider` manages logged-in user state globally.
- `PostContextProvider` manages post/feed state globally.

## Clone And Setup

### 1. Clone The Repository

```bash
git clone <your-repository-url>
cd Instagram
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd Frontend
npm install
```

## Environment Variables

Create `.env` inside the `Backend` folder.

### Backend `.env.example`

```env
PORT=8000
NODE_ENV=development

MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_jwt_secret_key

IMAGEKIT_URL_ENDPOINTS=your_imagekit_url_endpoint
IMAGEKIT_PUBLIC_SECRET=your_imagekit_public_key
IMAGEKIT_PRIVATE_SECRET=your_imagekit_private_key

FRONTEND_URL=http://localhost:5173
```

Create `.env` inside the `Frontend` folder.

### Frontend `.env.example`

```env
VITE_API_URL=http://localhost:8000
```

For Render deployment, use your deployed backend URL:

```env
VITE_API_URL=https://your-backend-service.onrender.com
```

And in backend Render environment:

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-site.onrender.com
```

## Run Locally

### Start Backend

```bash
cd Backend
npm run dev
```

Backend runs on:

```text
http://localhost:8000
```

### Start Frontend

```bash
cd Frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Build

### Frontend Production Build

```bash
cd Frontend
npm run build
```

### Frontend Lint

```bash
cd Frontend
npm run lint
```

### Backend Start

```bash
cd Backend
npm start
```

## API Overview

Total API endpoints: 31

Base backend URL:

```text
http://localhost:8000
```

## Auth APIs

Base route:

```text
/api/auth
```

| Method | Endpoint | Access | Work |
| --- | --- | --- | --- |
| POST | `/register` | Public | Register a new user and set auth cookie |
| POST | `/login` | Public | Login user and set auth cookie |
| GET | `/get-me` | Protected | Get current logged-in user from cookie token |
| POST | `/logout` | Protected | Clear auth cookie and logout user |

## Post, Feed, Like, Comment, Saved APIs

Base route:

```text
/api/post
```

| Method | Endpoint | Access | Work |
| --- | --- | --- | --- |
| POST | `/` | Protected | Create a new post with images and caption |
| GET | `/all-posts` | Protected | Get logged-in user's own posts |
| GET | `/feed` | Protected | Get home feed posts from followed users |
| GET | `/explore` | Protected | Get global explore/discovery posts |
| GET | `/user/:username` | Protected | Get posts of a specific user |
| GET | `/saved` | Protected | Get logged-in user's saved posts |
| GET | `/detail/:id` | Protected | Get a single post's details |
| POST | `/like/:id` | Protected | Like a post |
| POST | `/unlike/:id` | Protected | Unlike a post |
| POST | `/save/:id` | Protected | Save/bookmark a post |
| POST | `/unsave/:id` | Protected | Remove post from saved/bookmarks |
| GET | `/likes/:id` | Protected | Get users who liked a post |
| GET | `/comments/:id` | Protected | Get comments for a post |
| POST | `/comment/:id` | Protected | Add comment to a post |
| DELETE | `/comment/:commentId` | Protected | Delete own comment |

## Follow And Social APIs

Base route:

```text
/api/user
```

| Method | Endpoint | Access | Work |
| --- | --- | --- | --- |
| POST | `/follow/:username` | Protected | Follow a user |
| POST | `/unfollow/:username` | Protected | Unfollow a user |
| GET | `/followers/:username` | Protected | Get user's followers list |
| GET | `/following/:username` | Protected | Get user's following list |
| GET | `/suggested` | Protected | Get suggested users for current user |
| GET | `/follow-status/:username` | Protected | Check whether current user follows target user |
| GET | `/follow/follow-requests` | Protected | Get pending follow requests, preserved for compatibility |
| POST | `/follow/accept-request/:username` | Protected | Accept pending follow request |
| POST | `/follow/reject-request/:username` | Protected | Reject pending follow request |

## User Profile And Search APIs

Base route:

```text
/api/user
```

| Method | Endpoint | Access | Work |
| --- | --- | --- | --- |
| GET | `/search?q=query` | Protected | Search users by username or display name |
| GET | `/profile/:username` | Protected | Get public profile with counts and follow state |
| PUT | `/profile` | Protected | Update own profile name, bio, and profile image |

## Frontend Routes

| Route | Work |
| --- | --- |
| `/` | Login page |
| `/register` | Register page |
| `/app` | Home feed |
| `/app/createPost` | Create post |
| `/app/explore` | Explore/discovery feed |
| `/app/search` | User search |
| `/app/profile/:username` | Own or other user's profile |

## Deployment Notes For Render

### Backend Render Web Service

```text
Root Directory: Backend
Build Command: npm install
Start Command: npm start
```

Required backend environment variables:

```env
NODE_ENV=production
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
IMAGEKIT_URL_ENDPOINTS=your_imagekit_url_endpoint
IMAGEKIT_PUBLIC_SECRET=your_imagekit_public_key
IMAGEKIT_PRIVATE_SECRET=your_imagekit_private_key
FRONTEND_URL=https://your-frontend-site.onrender.com
```

### Frontend Render Static Site

```text
Root Directory: Frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Required frontend environment variable:

```env
VITE_API_URL=https://your-backend-service.onrender.com
```

For React Router refresh support, add rewrite:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

## Important Notes

- Do not commit real `.env` files.
- MongoDB Atlas connection string should stay private.
- ImageKit keys should stay private.
- JWT secret should be strong and private.
- In production, frontend and backend must use HTTPS URLs.
- Render free services may sleep, so the first request can be slow.

## Learning Highlights

This project helped cover:

- Full-stack app architecture
- REST API design
- MongoDB relationships
- Authentication with cookies and JWT
- Protected routing
- Image uploads
- Social features like follow, likes, comments, saved posts
- Responsive UI
- Deployment-ready environment configuration

## Author

**Swarup Das**

Full-stack development learner and builder.

Happy to connect, collaborate, and learn together.

If you like this project, feel free to star the repository and share feedback.

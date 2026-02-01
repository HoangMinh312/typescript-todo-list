# TypeScript Todo List Application

A full-featured todo list application built with TypeScript, Node.js, Express, and SQLite. Users can manage their tasks with features like reordering, archiving, and separate views for active and completed tasks.

## Features

✅ **User Authentication**
- Register and log in to your account
- Session-based authentication
- Password hashing

✅ **Task Management**
- Create tasks with titles
- Edit existing tasks
- Delete tasks
- Mark tasks as done/undone
- Reorder tasks (move up/down for priority)
- Archive all completed tasks at once
- View archived tasks separately

✅ **User Isolation**
- Each user sees only their own tasks
- Protected routes with authentication middleware

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite with better-sqlite3
- **View Engine**: EJS with express-ejs-layouts
- **Authentication**: express-session, bcrypt
- **Styling**: Tailwind CSS (via CDN)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HoangMinh312/typescript-todo-list.git
   cd typescript-todo-list
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   The database will be automatically created when you first run the application. It uses SQLite and creates a `todo.db` file in the project root.

## Running the Application

```bash
npm run dev
```
This starts the server with hot reloading on `http://localhost:3000`

## Usage

1. **Register an Account**
   - Navigate to `http://localhost:3000/register`
   - Create a new account with username and password

2. **Login**
   - Go to `http://localhost:3000/login`
   - Enter your credentials

3. **Manage Tasks**
   - **Create**: Enter task title and click "Add Task"
   - **Edit**: Click "Edit" button, modify title, and save
   - **Delete**: Click "Delete" button to remove a task
   - **Toggle Done**: Click "Mark Done" to complete or "Mark Undone" to reactivate
   - **Reorder**: Use "Up" and "Down" buttons to change task priority
   - **Archive**: Click "Archive All Completed" to move all done tasks to archive

4. **View Archive**
   - Click "View Archive" to see all archived tasks
   - Return to dashboard with "Back to Dashboard"

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

### Todos Table
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  position INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## API Routes

### Authentication
- `GET /register` - Registration page
- `POST /register` - Create new user
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `POST /logout` - End session

### Todo Management
- `GET /dashboard` - View active tasks
- `POST /tasks` - Create new task
- `POST /tasks/:id/edit` - Edit task title
- `POST /tasks/:id/delete` - Delete task
- `POST /tasks/:id/archive` - Archive a task
- `POST /tasks/:id/toggle` - Toggle completion status
- `POST /tasks/:id/move-up` - Move task up
- `POST /tasks/:id/move-down` - Move task down
- `POST /tasks/archive-completed` - Archive all completed tasks
- `GET /archive` - View archived tasks

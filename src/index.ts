import express from 'express';
import session from 'express-session';
import path from 'path';
import { login, register } from './controllers/authController';
import { isAuthenticated } from './middleware/authMiddleware';
import { Todo } from './models/todoModel';

// Routes
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (for CSS/JS)
app.use(express.static(path.join(__dirname, '../public')));


// Session management
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(authRoutes);
app.use(todoRoutes);

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
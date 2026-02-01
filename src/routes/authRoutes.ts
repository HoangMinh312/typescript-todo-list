import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

// Registration route
router.get('/register', (req, res) => res.render('register', { title: 'Register' }));
router.post('/register', register);

// Login route
router.get('/login', (req, res) => res.render('login', { title: 'Login' }));
router.post('/login', login);

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

export default router;
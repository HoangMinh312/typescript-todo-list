import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../db/setupDB';
import { User } from '../models/userModel';

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = User.findByUsername(username);
        if (existingUser) {
            return res.status(400).send("Username already exists.");
        }
        
        // Hash password and create user
        const passwordHash = await bcrypt.hash(password, 10);
        User.create(username, passwordHash);
        res.redirect('/login');
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).send("An internal server error occurred.");
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = User.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password || '')) {
        // Store user ID in session for 'User Isolation'
        req.session.userId = user.id;
        res.redirect('/dashboard');
    } else {
        res.status(401).send("Invalid credentials.");
    }
};
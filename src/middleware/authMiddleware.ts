import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.userId) {
        // User is logged in, proceed to the next function
        return next();
    }
    // User is not logged in, redirect to login page
    res.redirect('/login');
};
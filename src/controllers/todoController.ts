import { Request, Response } from 'express';
import { Todo } from '../models/todoModel';
import db from '../db/setupDB';
import { User } from '../models/userModel';

// Create a new task
export const createTask = (req: Request, res: Response) => {
    const userId = req.session.userId!;
    const { title } = req.body;

    try {
        Todo.create(userId, title);
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).send("An error occurred while creating the task.");
    }
};

// Edit a task
export const editTask = (req: Request, res: Response) => {
    let { id } = req.params;
    const { title } = req.body;
    const userId = req.session.userId!;

    // Ensure id is a string
    if (Array.isArray(id)) {
        id = id[0];
    }

    try {
        Todo.updateTitle(id, userId, title);
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).send("An error occurred while updating the task.");
    }
};

// Remove a task
export const deleteTask = (req: Request, res: Response) => {
    let { id } = req.params;
    const userId = req.session.userId!;

    // Ensure id is a string
    if (Array.isArray(id)) {
        id = id[0];
    }
    
    try {
        Todo.delete(id, userId);
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).send("An error occurred while deleting the task.");
    }
};

// Toggle task completion
export const toggleTaskCompletion = (req: Request, res: Response) => {
    let { id } = req.params;
    const userId = req.session.userId!;
    
    // Ensure id is a string
    if (Array.isArray(id)) {
        id = id[0];
    }

    try {
        Todo.toggleCompletion(id, userId);
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error toggling task completion:", err);
        res.status(500).send("An error occurred while updating the task status.");
    }
};

// Archive a task
export const archiveTask = (req: Request, res: Response) => {
    let { id } = req.params;
    const userId = req.session.userId!;

    // Ensure id is a string
    if (Array.isArray(id)) {
        id = id[0];
    }

    try {
        Todo.toggleArchive(id, userId);
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error archiving task:", err);
        res.status(500).send("An error occurred while archiving the task.");
    }
};

// Move up a task
export const moveTaskUp = (req: Request, res: Response) => {
    let { id } = req.params;
    const userId = req.session.userId!;
    
    // Ensure id is a string
    if (Array.isArray(id)) {
        id = id[0];
    }

    try {
        Todo.move(id, userId, 'up');
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error moving task up:", err);
        res.status(500).send("An error occurred while moving the task.");
    }
};

// Move down a task
export const moveTaskDown = (req: Request, res: Response) => {
    let { id } = req.params;
    const userId = req.session.userId!;
    
    // Ensure id is a string
    if (Array.isArray(id)) {
        id = id[0];
    }

    try {
        Todo.move(id, userId, 'down');
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error moving task down:", err);
        res.status(500).send("An error occurred while moving the task.");
    }
};

// Archive all completed tasks
export const archiveCompletedTasks = (req: Request, res: Response) => {
    const userId = req.session.userId!;
    
    try {
        Todo.archiveCompleted(userId);
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error archiving completed tasks:", err);
        res.status(500).send("An error occurred while archiving completed tasks.");
    }
};

// Render dashboard with tasks
export const renderDashboard = (req: Request, res: Response) => {
    try {
        const userId = req.session.userId!;
        const tasks = Todo.findAllByUser(userId, false); 
        const user = User.findById(userId);

        res.render('dashboard', { 
            tasks: tasks,
            username: user?.username || 'Unknown User'
        });
    } catch (error) {
        console.error("Dashboard rendering error:", error);
        res.status(500).send("Error loading your dashboard.");
    }
};

// Render archive page with archived tasks
export const renderArchive = (req: Request, res: Response) => {
    try {
        const userId = req.session.userId!;
        const archivedTasks = Todo.findAllByUser(userId, true); 
        const user = User.findById(userId);

        res.render('archive', { 
            tasks: archivedTasks,
            username: user?.username || 'Unknown User'
        });
    } catch (error) {
        console.error("Archive rendering error:", error);
        res.status(500).send("Error loading your archive.");
    }
};

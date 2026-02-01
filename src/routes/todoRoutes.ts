import { Router } from 'express';
import * as todoController from '../controllers/todoController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = Router();

// All routes here require authentication
router.use(isAuthenticated);

// Dashboard route
router.get('/dashboard', (req, res) => {
  res.locals.title = 'Dashboard';
  todoController.renderDashboard(req, res);
});

// Archive route
router.get('/archive', (req, res) => {
  res.locals.title = 'Archive';
  todoController.renderArchive(req, res);
});

// Task routes
router.post('/tasks', todoController.createTask);
router.post('/tasks/:id/edit', todoController.editTask);
router.post('/tasks/:id/delete', todoController.deleteTask);
router.post('/tasks/:id/toggle', todoController.toggleTaskCompletion);
router.post('/tasks/:id/archive', todoController.archiveTask);
router.post('/tasks/:id/move-up', todoController.moveTaskUp);
router.post('/tasks/:id/move-down', todoController.moveTaskDown);

// Archive all completed tasks
router.post('/tasks/archive-completed', todoController.archiveCompletedTasks);

export default router;
import db from '../db/setupDB';

export interface TodoSchema {
  id?: number;
  user_id: number;
  title: string;
  completed: boolean;
  archived: boolean;
  position: number;
}

export class Todo {
  // Requirement: Create a task with a title
  static create(userId: number, title: string): number | bigint {
    // Find the current max position to place this at the end of the list
    const maxPos: any = db.prepare('SELECT MAX(position) as pos FROM todos WHERE user_id = ?').get(userId);
    const newPos = (maxPos?.pos || 0) + 1;

    const stmt = db.prepare('INSERT INTO todos (user_id, title, position) VALUES (?, ?, ?)');
    const result = stmt.run(userId, title, newPos);
    return result.lastInsertRowid;
  }

  // Requirement: Each user sees only their own tasks
  static findAllByUser(userId: number, archived = false): TodoSchema[] {
    const stmt = db.prepare(`
      SELECT * FROM todos 
      WHERE user_id = ? AND archived = ? 
      ORDER BY position ASC
    `);
    return stmt.all(userId, archived ? 1 : 0) as TodoSchema[];
  }

  // Requirement: Archive all completed tasks at once
  static archiveCompleted(userId: number) {
    const stmt = db.prepare('UPDATE todos SET archived = 1 WHERE user_id = ? AND completed = 1');
    return stmt.run(userId);
  }

  // Archive a single task
  static toggleArchive(id: string, userId: number) {
    const getStmt = db.prepare('SELECT archived FROM todos WHERE id = ? AND user_id = ?');
    const task = getStmt.get(id, userId) as TodoSchema;
    if (task) {
      const newStatus = task.archived ? 0 : 1;
      const updateStmt = db.prepare('UPDATE todos SET archived = ? WHERE id = ? AND user_id = ?');
      return updateStmt.run(newStatus, id, userId);
    }
  }

  // Delete a task by ID
  static delete(id: string, userId: number) {
    const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
    return stmt.run(id, userId);
  }

  // Update a task's title
  static updateTitle(id: string, userId: number, title: string) {
      const stmt = db.prepare('UPDATE todos SET title = ? WHERE id = ? AND user_id = ?');
      return stmt.run(title, id, userId);
  }

  // Toggle task completion
  static toggleCompletion(id: string, userId: number) {
    const getStmt = db.prepare('SELECT completed FROM todos WHERE id = ? AND user_id = ?');
    const task = getStmt.get(id, userId) as TodoSchema;
    if (task) {
      const newStatus = task.completed ? 0 : 1;
      const updateStmt = db.prepare('UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?');
      return updateStmt.run(newStatus, id, userId);
    }
  }

  // Reorder tasks by updating their positions
  static move(id: string, userId: number, direction: 'up' | 'down') {
    const current: any = db.prepare('SELECT id, position FROM todos WHERE id = ? AND user_id = ?').get(id, userId);
    if (!current) return;

    // determine neighbor to swap with
    const query = direction === 'up'
      ? 'SELECT id, position FROM todos WHERE user_id = ? AND position < ? ORDER BY position DESC LIMIT 1'
      : 'SELECT id, position FROM todos WHERE user_id = ? AND position > ? ORDER BY position ASC LIMIT 1';

    const neighbor: any = db.prepare(query).get(userId, current.position);
    if (neighbor) {
      const transaction = db.transaction(() => {
        db.prepare('UPDATE todos SET position = ? WHERE id = ? AND user_id = ?')
          .run(neighbor.position, current.id, userId);
        db.prepare('UPDATE todos SET position = ? WHERE id = ? AND user_id = ?')
          .run(current.position, neighbor.id, userId);
      });
      transaction();
    }
  }
}
const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  createTodo,
  updateTodo,
  toggleDone,
  deleteTodo
} = require('../controllers/todoController');

// GET /api/todos - Get all todos
router.get('/todos', getAllTodos);

// POST /api/todos - Create a new todo
router.post('/todos', createTodo);

// PUT /api/todos/:id - Update a todo
router.put('/todos/:id', updateTodo);

// PATCH /api/todos/:id/done - Toggle done status
router.patch('/todos/:id/done', toggleDone);

// DELETE /api/todos/:id - Delete a todo
router.delete('/todos/:id', deleteTodo);

module.exports = router;
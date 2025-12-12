const Todo = require('../models/todoModel');

// Get all todos
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching todos', 
      error: error.message 
    });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : ''
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating todo', 
      error: error.message 
    });
  }
};

// Update a todo (title and/or description)
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      { 
        title: title.trim(), 
        description: description ? description.trim() : '' 
      },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating todo', 
      error: error.message 
    });
  }
};

// Toggle done status
const toggleDone = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }

    todo.done = !todo.done;
    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error toggling todo status', 
      error: error.message 
    });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }

    res.status(200).json({ 
      message: 'Todo deleted successfully',
      id: todo._id 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error deleting todo', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  toggleDone,
  deleteTodo
};
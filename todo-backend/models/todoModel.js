const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
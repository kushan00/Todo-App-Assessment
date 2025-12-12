import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Check, X, Plus, Loader2 } from 'lucide-react';

const API_URL =  process.env.REACT_APP_API_BASE_URL;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '' });

  // Fetch all todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create todo');
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setFormData({ title: '', description: '' });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update todo
  const handleUpdate = async (id) => {
    if (!editData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle done status
  const handleToggleDone = async (id, currentStatus) => {
    // Optimistic update
    setTodos(todos.map(todo => 
      todo._id === id ? { ...todo, done: !currentStatus } : todo
    ));

    try {
      const response = await fetch(`${API_URL}/todos/${id}/done`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle todo');
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
    } catch (err) {
      setError(err.message);
      // Revert on error
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, done: currentStatus } : todo
      ));
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    // Optimistic update
    setTodos(todos.filter(todo => todo._id !== id));

    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
    } catch (err) {
      setError(err.message);
      fetchTodos(); // Refresh on error
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditData({ title: todo.title, description: todo.description || '' });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: '', description: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          My TODO List
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Create TODO */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New TODO</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate(e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                rows="3"
              />
            </div>
            <button
              onClick={handleCreate}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add TODO
            </button>
          </div>
        </div>

        {/* TODO List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No todos yet. Create your first one above!
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`bg-white rounded-lg shadow-md p-5 transition-all duration-300 ${
                  todo.done ? 'opacity-75' : ''
                }`}
              >
                {editingId === todo._id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(todo._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => handleToggleDone(todo._id, todo.done)}
                      className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-1 ${
                          todo.done ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p
                          className={`text-sm ${
                            todo.done ? 'line-through text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {todo.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(todo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
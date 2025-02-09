// TodoCard.jsx
import React, { useState } from "react";
import axios from "axios";
import "./TodoCard.css";

export default function TodoCard({ taskList, refreshTaskLists }) {
  const [newTasks, setNewTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  // Toggle completion status for an individual task in this task list
  const handleToggleComplete = async (taskIndex, currentStatus) => {
    const updatedTasks = [...taskList.tasks];
    updatedTasks[taskIndex].completed = !currentStatus;

    try {
      // await axios.put(`http://localhost:5000/api/tasks/${taskList._id}`, {
      await axios.put(
        `https://todo-list-backend-production-72ea.up.railway.app/api/tasks/${taskList._id}`,
        {
          title: taskList.title,
          tasks: updatedTasks,
        }
      );
      refreshTaskLists();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const addTask = () => {
    setNewTasks([...newTasks, ""]); // Add empty input
  };

  const handleNewTaskChange = (index, value) => {
    const updatedNewTasks = [...newTasks];
    updatedNewTasks[index] = value;
    setNewTasks(updatedNewTasks);
  };

  const handleRemoveTask = (index) => {
    const updatedNewTasks = newTasks.filter((_, i) => i !== index);
    setNewTasks(updatedNewTasks);
  };

  const handleSaveNewTasks = async () => {
    if (newTasks.length === 0) return;

    const updatedTasks = [
      ...taskList.tasks,
      ...newTasks.map((task) => ({ task, completed: false })),
    ];

    try {
      // await axios.put(`http://localhost:5000/api/tasks/${taskList._id}`, {
      await axios.put(
        `https://todo-list-backend-production-72ea.up.railway.app/api/tasks/${taskList._id}`,
        {
          title: taskList.title,
          tasks: updatedTasks,
        }
      );
      setNewTasks([]); // Clear new tasks
      refreshTaskLists(); // Refresh task list
    } catch (error) {
      console.error("Error saving new tasks:", error);
    }
  };

  const handleDelete = async (taskIndex) => {
    const updatedTasks = taskList.tasks.filter(
      (_, index) => index !== taskIndex
    );

    try {
      // await axios.put(`http://localhost:5000/api/tasks/${taskList._id}`, {
      await axios.put(
        `https://todo-list-backend-production-72ea.up.railway.app/api/tasks/${taskList._id}`,
        {
          title: taskList.title,
          tasks: updatedTasks,
        }
      );
      refreshTaskLists();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDeleteTaskGroup = async (task_id) => {
    try {
      // await axios.delete(`http://localhost:5000/api/tasks/${task_id}`);
      await axios.delete(
        `https://todo-list-backend-production-72ea.up.railway.app/api/tasks/${task_id}`
      );
      refreshTaskLists();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleInputChange = (id, newValue) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, task: newValue } : task
      )
    );
  };

  // Edit functionality
  const handleEdit = (index, task) => {
    setEditingIndex(index);
    setEditedTask(task);
  };

  const handleSaveEdit = async (index) => {
    const updatedTasks = [...taskList.tasks];
    updatedTasks[index].task = editedTask;

    try {
      // await axios.put(`http://localhost:5000/api/tasks/${taskList._id}`, {
      await axios.put(
        `https://todo-list-backend-production-72ea.up.railway.app/api/tasks/${taskList._id}`,
        {
          title: taskList.title,
          tasks: updatedTasks,
        }
      );
      setEditingIndex(null);
      refreshTaskLists();
    } catch (error) {
      console.error("Error saving edited task:", error);
    }
  };

  return (
    <div className="TodoCard_container">
      <h3>{taskList.title}</h3>
      <ul>
        {taskList.tasks.map((item, index) => (
          <li key={index}>
            <div className="task-item">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleComplete(index, item.completed)}
              />

              {editingIndex === index ? (
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  autoFocus
                />
              ) : (
                <span
                  style={{
                    textDecoration: item.completed ? "line-through" : "none",
                  }}
                >
                  {item.task}
                </span>
              )}

              {editingIndex === index ? (
                <button onClick={() => handleSaveEdit(index)}>Save</button>
              ) : (
                <button onClick={() => handleEdit(index, item.task)}>
                  Edit
                </button>
              )}

              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {newTasks.map((task, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: "10px", margin: "5px 0" }}
        >
          <input
            type="text"
            placeholder="Enter a new task"
            value={task}
            onChange={(e) => handleNewTaskChange(index, e.target.value)}
          />
          <button onClick={() => handleRemoveTask(index)}>❌</button>
        </div>
      ))}

      <button onClick={addTask}>Add More Task</button>
      <button
        onClick={handleSaveNewTasks}
        disabled={newTasks.some((task) => task.trim() === "")}
      >
        Save New Tasks
      </button>

      <button onClick={() => handleDeleteTaskGroup(taskList._id)}>
        delete group
      </button>
    </div>
  );
}

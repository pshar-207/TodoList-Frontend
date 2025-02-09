// CreateTask.jsx
import React, { useState } from "react";
import axios from "axios";

export default function CreateTask({ userId, refreshTasks }) {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([""]);

  // Function to update a specific task input
  const handleTaskChange = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = value;
    setTasks(updatedTasks);
  };

  // Function to add more task input fields
  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  // Function to remove a task input field
  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleSaveTasks = async () => {
    try {
      // const response = await axios.post("http://localhost:5000/api/tasks", {
      const response = await axios.post(
        "https://todo-list-backend-production-72ea.up.railway.app/api/tasks",
        {
          userId,
          title,
          tasks: tasks.map((task) => ({ task })), // Convert to array of objects
        }
      );

      if (response.status === 200) {
        setTitle("");
        setTasks([""]);
        if (refreshTasks) refreshTasks();
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <div style={{ margin: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h3>Create New Task</h3>
      <input
        type="text"
        placeholder="Task Title (e.g., Today Tasks)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      {tasks.map((task, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: "10px", margin: "5px 0" }}
        >
          <input
            type="text"
            placeholder="Enter a task"
            value={task}
            onChange={(e) => handleTaskChange(index, e.target.value)}
          />
          {tasks.length > 1 && (
            <button onClick={() => removeTask(index)}>Remove</button>
          )}
        </div>
      ))}
      <br />
      <button onClick={addTask}>Add More Task</button>
      <button onClick={handleSaveTasks}>Save Task</button>
    </div>
  );
}

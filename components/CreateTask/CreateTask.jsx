import React, { useState } from "react";
import axios from "axios";
const VITE_LOCALHOST_API_URL = import.meta.env.VITE_LOCALHOST_API_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function CreateTask({ userId, taskLists, fetchTaskLists }) {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([""]);
  const [error, setError] = useState("");

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
    const emptyTask = tasks.includes("");
    if (emptyTask) {
      setError("Emplty string are not allowed!");
      return;
    } else {
      setError("");
    }
    const uniqueTasks = new Set(tasks.map((task) => task.trim()));
    if (uniqueTasks.size !== tasks.length) {
      setError("Duplicate tasks are not allowed!");
      return;
    } else {
      setError("");
    }

    const existingTaskLists = taskLists.map((tasks) => tasks.title.trim());

    const titleExist = existingTaskLists.includes(title.trim());
    if (titleExist) {
      setError("title same");
      return;
    } else {
      setError("");
    }

    try {
      const response = await axios.post(
        `${VITE_LOCALHOST_API_URL}/api/createTasks`,
        // `${VITE_API_URL}/api/createTasks`,
        {
          userId,
          title,
          tasks: tasks.map((task) => ({ task })),
        }
      );

      if (response.status === 200) {
        setTitle("");
        setTasks([""]);
        fetchTaskLists();
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
      <button onClick={addTask}>Add More Task</button>
      <button onClick={handleSaveTasks}>Save Task</button>
    </div>
  );
}

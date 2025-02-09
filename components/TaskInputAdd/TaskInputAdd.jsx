// TaskInputList.jsx
import React, { useState } from "react";

export default function TaskInputList({ onSave }) {
  const [tasks, setTasks] = useState([""]); // Manage dynamic task inputs

  // Add new task input field
  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  // Handle input change
  const handleTaskChange = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = value;
    setTasks(updatedTasks);
  };
  // Function to remove a task input field
  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Pass tasks to parent when saving
  const handleSave = () => {
    onSave(tasks); // Calls function passed from parent (CreateTask / TodoCard)
    setTasks([""]); // Reset inputs after saving
  };

  return (
    <div>
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
      <button onClick={addTask}>Add More Task</button>
      <button onClick={handleSave} disabled={tasks.length === 0}>
        Save Tasks
      </button>
    </div>
  );
}

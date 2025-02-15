import React, { useState } from "react";
import axios from "axios";
import "./TodoCard.css";
const VITE_LOCALHOST_API_URL = import.meta.env.VITE_LOCALHOST_API_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function TodoCard({ index, taskList, tasklists, setTaskLists }) {
  const [newTasks, setNewTasks] = useState([]);

  const [editingTaskIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const [error, setError] = useState("");

  // Toggle completion status for an individual task
  const handleToggleComplete = async (task) => {
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };

    let updatedTasks = taskList.tasks.map((task) => task);

    updatedTasks = updatedTasks.map((t) =>
      t.task === task.task ? updatedTask : t
    );

    if (updatedTask) {
      setTaskLists((prevLists) =>
        prevLists.map((list) =>
          list._id === taskList._id
            ? {
                ...list,
                tasks: list.tasks.map((t) =>
                  t.task === task.task ? updatedTask : t
                ),
              }
            : list
        )
      );
    }

    try {
      await axios.put(
        `${VITE_LOCALHOST_API_URL}/api/updateTask/${taskList._id}`,
        // `${VITE_API_URL}/api/updateTask/${taskList._id}`,
        {
          title: taskList.title,
          tasks: updatedTasks,
        }
      );
    } catch (error) {
      console.error("Error saving new tasks:", error);
    }
  };

  const handleDeleteTask = async (item) => {
    if (!item) return;

    let newtasklists = [...tasklists];

    const newtasksList = taskList.tasks.filter(
      (list) => list.task !== item.task
    );

    newtasklists[index].tasks = newtasksList;

    setTaskLists(newtasklists);

    try {
      await axios.delete(
        `${VITE_LOCALHOST_API_URL}/api/deleteTask/${item.task}/${taskList._id}`
        // `${VITE_API_URL}/api/deleteTask/${item.task}/${taskList._id}`
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDeleteTaskGroup = async (task_id) => {
    if (!task_id) return;
    const newtaskslist = tasklists.filter((list) => {
      return list._id !== task_id;
    });

    setTaskLists(newtaskslist);

    try {
      await axios.delete(
        `${VITE_LOCALHOST_API_URL}/api/deleteTaskGroup/${task_id}`
        // `${VITE_API_URL}/api/deleteTaskGroup/${task_id}`
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const addTask = () => {
    setNewTasks([...newTasks, ""]);
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

    const existingTasks = new Set(taskList.tasks.map((t) => t.task.trim()));

    const newTasksFormatted = newTasks.map((task) => task.trim());

    const hasDuplicateInNewTasks =
      new Set(newTasksFormatted).size !== newTasksFormatted.length;

    // Check if any new task is already in the existing list
    const hasDuplicate = newTasksFormatted.some((task) =>
      existingTasks.has(task)
    );

    if (hasDuplicate || hasDuplicateInNewTasks) {
      setError("Duplicate tasks are not allowed!");
      return;
    }

    setError("");

    const updatedTasks = [
      ...taskList.tasks,
      ...newTasks.map((task) => ({ task, completed: false })),
    ];

    setNewTasks([]);

    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list._id === taskList._id ? { ...list, tasks: updatedTasks } : list
      )
    );

    try {
      await axios.put(
        `${VITE_LOCALHOST_API_URL}/api/updateTask/${taskList._id}`,
        // `${VITE_API_URL}/api/updateTask/${taskList._id}`,
        {
          title: taskList.title,
          tasks: updatedTasks,
        }
      );
    } catch (error) {
      console.error("Error saving new tasks:", error);
    }
  };

  const handleSaveTitle = async () => {
    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list._id === taskList._id ? { ...list, title: editedTitle } : list
      )
    );

    setEditingTitleIndex(null);

    try {
      await axios.put(
        `${VITE_LOCALHOST_API_URL}/api/updateTask/${taskList._id}`,
        // `${VITE_API_URL}/api/updateTask/${taskList._id}`,
        {
          title: editedTitle,
          tasks: taskList.tasks,
        }
      );
    } catch (error) {
      console.error("Error saving edited Title:", error);
    }
  };

  // Edit functionality
  const handleEdit = (index, task) => {
    setEditingIndex(index);
    setEditedTask(task);
  };
  // Edit functionality
  const handleEditTitle = (id, title) => {
    setEditingTitleIndex(id);
    setEditedTitle(title);
  };

  const handleSaveEdit = async (index) => {
    const updatedTasks = [...taskList.tasks];
    updatedTasks[index].task = editedTask;

    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list._id === taskList._id ? { ...list, tasks: updatedTasks } : list
      )
    );

    setEditingIndex(null);

    try {
      await axios.put(
        `${VITE_LOCALHOST_API_URL}/api/updateTask/${taskList._id}`,
        // `${VITE_API_URL}/api/updateTask/${taskList._id}`,
        {
          title: taskList.title,
          tasks: updatedTasks,
        }
      );
    } catch (error) {
      console.error("Error saving edited task:", error);
    }
  };

  return (
    <div className="TodoCard_container">
      {editingTitleIndex === taskList._id ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          autoFocus
        />
      ) : (
        <h3>{taskList.title}</h3>
      )}

      {editingTitleIndex === taskList._id ? (
        <button onClick={handleSaveTitle}>Save</button>
      ) : (
        <button onClick={() => handleEditTitle(taskList._id, taskList.title)}>
          Edit Title
        </button>
      )}

      <ul>
        {taskList.tasks.map((item, index) => (
          <li key={index}>
            <div className="task-item">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleComplete(item)}
              />
              {editingTaskIndex === index ? (
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

              {editingTaskIndex === index ? (
                <button onClick={() => handleSaveEdit(index)}>Save</button>
              ) : (
                <button onClick={() => handleEdit(index, item.task)}>
                  Edit
                </button>
              )}

              <button onClick={() => handleDeleteTask(item)}>Delete</button>
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
      {error && <p style={{ color: "red" }}>{error}</p>}
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

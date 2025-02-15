import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
const VITE_LOCALHOST_API_URL = import.meta.env.VITE_LOCALHOST_API_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

import Home from "../components/Home/Home";
import UserDetails from "../components/UserDetails/UserDetails";
import TodoCard from "../components/TodoCard/TodoCard";
import CreateTask from "../components/CreateTask/CreateTask";

const App = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [taskLists, setTaskLists] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Function to fetch task lists for the logged-in user
  const fetchTaskLists = async () => {
    try {
      const response = await axios.get(
        // `${VITE_LOCALHOST_API_URL}/api/getAllTasks?userId=${user._id}`
        `${VITE_API_URL}/api/getAllTasks?userId=${user._id}`
      );
      setTaskLists(response.data.tasks);
    } catch (error) {
      console.error("Error fetching task lists:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTaskLists();
    }
  }, [user]);

  return (
    <>
      <nav style={{ padding: 10, display: "flex", gap: 10 }}>
        {user && (
          <button onClick={() => setShowUserDetails(!showUserDetails)}>
            User Details
          </button>
        )}
      </nav>

      {!user && <Home setUser={setUser} />}
      {user && showUserDetails && <UserDetails user={user} setUser={setUser} />}

      {user &&
        taskLists.map((list, index) => (
          <TodoCard
            key={list._id}
            index={index}
            taskList={list}
            tasklists={taskLists}
            setTaskLists={setTaskLists}
          />
        ))}

      {user && (
        <button onClick={() => setShowCreateTask(!showCreateTask)}>+</button>
      )}
      {showCreateTask && user && (
        <CreateTask
          userId={user._id}
          taskLists={taskLists}
          fetchTaskLists={fetchTaskLists}
        />
      )}
    </>
  );
};

export default App;

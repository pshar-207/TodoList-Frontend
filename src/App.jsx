import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "../components/Home/Home";
import UserDetails from "../components/UserDetails/UserDetails";
import TodoCard from "../components/TodoCard/TodoCard";
import CreateTask from "../components/CreateTask/CreateTask";

const App = () => {
  // const [user, setUser] = useState(
  //   JSON.parse(localStorage.getItem("user")) || null
  // );
  const [user, setUser] = useState(null);
  // const [message, setMessage] = useState("");
  const [taskLists, setTaskLists] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/")
  //     .then((response) => setMessage(response.data))
  //     .catch((error) => console.log(error));
  // }, []);

  useEffect(() => {
    // Save user data in localStorage when user state changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    console.log(user);
  }, [user]);

  // Function to fetch task lists for the logged-in user
  const fetchTaskLists = async () => {
    try {
      const response = await axios.get(
        // `http://localhost:5000/api/tasks?userId=${user._id}`
        // `https://todo-list-backend-0wey.onrender.com/api/tasks?userId=${user._id}`
        `https://todo-list-backend-production-72ea.up.railway.app/api/tasks?userId=${user._id}`
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

      {/* <div>
        <h1>MongoDB + React + Express</h1>
        <p>{message}</p>
      </div> */}
      {/* Render one TodoCard per task list */}
      {user &&
        taskLists.map((list) => (
          <TodoCard
            key={list._id}
            taskList={list}
            refreshTaskLists={fetchTaskLists}
          />
        ))}
      {/* Toggle CreateTask with the '+' button */}
      {user && (
        <button onClick={() => setShowCreateTask(!showCreateTask)}>+</button>
      )}
      {showCreateTask && user && (
        <CreateTask userId={user._id} refreshTasks={fetchTaskLists} />
      )}
    </>
  );
};

export default App;

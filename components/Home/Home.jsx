import React from "react";
import { signInWithGoogle } from "../../src/firebase";

import axios from "axios";

const Home = ({ setUser }) => {
  const handleLogin = async () => {
    const firebaseUser = await signInWithGoogle();
    if (firebaseUser) {
      try {
        // Post to your backend to either create or find the user
        const response = await axios.post(
          "https://todo-list-backend-production-72ea.up.railway.app/api/users",
          // "https://todo-list-backend-0wey.onrender.com/api/users",
          // "http://localhost:5000/api/users",
          {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
          }
        );
        // Use the MongoDB user document returned from the backend
        const mongoUser = response.data.user;
        setUser(mongoUser); // now mongoUser._id is the ObjectId from MongoDB
      } catch (error) {
        console.error("Error saving user:", error);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to the App</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Home;

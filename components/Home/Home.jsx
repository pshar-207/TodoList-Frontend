import React from "react";
import { signInWithGoogle } from "../../src/firebase";
import axios from "axios";

const Home = ({ setUser }) => {
  const handleLogin = async () => {
    const firebaseUser = await signInWithGoogle();
    if (firebaseUser) {
      try {
        const response = await axios.post(
          "https://todo-list-backend-production-72ea.up.railway.app/api/users",
          {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
          }
        );
        const mongoUser = response.data.user;

        setUser(mongoUser);
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

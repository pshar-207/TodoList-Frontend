import React from "react";
import { signInWithGoogle } from "../../src/firebase";
import axios from "axios";
const VITE_LOCALHOST_API_URL = import.meta.env.VITE_LOCALHOST_API_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Home = ({ setUser }) => {
  const handleLogin = async () => {
    const firebaseUser = await signInWithGoogle();
    if (firebaseUser) {
      try {
        const response = await axios.post(
          `${VITE_LOCALHOST_API_URL}/api/createUser`,
          // `${VITE_API_URL}/api/createUser`,
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
      <h2>Welcome to the Todo App</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Home;

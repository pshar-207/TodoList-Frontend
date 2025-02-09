import React from "react";
import { signInWithGoogle, logOut } from "./firebase";
import "./Header.css";

const Login = ({ setUser }) => {
  const handleLogin = async () => {
    const user = await signInWithGoogle();
    setUser(user);
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign in with Google</button>
      <button onClick={logOut}>Log out</button>
    </div>
  );
};

export default Login;

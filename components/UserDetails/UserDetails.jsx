import React from "react";
import { logOut } from "../../src/firebase";

const UserDetails = ({ user, setUser }) => {
  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>User Details</h2>
      <img
        src={user.photo}
        alt="User Avatar"
        width="100px"
        style={{ borderRadius: "50%" }}
      />

      <h3>{user.displayName}</h3>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </div>
  );
};

export default UserDetails;

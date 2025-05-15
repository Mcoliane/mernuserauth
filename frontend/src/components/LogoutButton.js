import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      // Optional: Redirect after logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
      <button onClick={handleLogout} className="w-full text-left">
        Log Out
      </button>
  );
}

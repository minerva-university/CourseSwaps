import React from "react";
import { useAuth } from "../contexts/AuthProvider";

export default function Home() {
  const { user } = useAuth();
  return (
    <div>
      {user && (
        <div>
          <img src={user.picture} alt="User's Picture" />
          <h3>{user.name}</h3>
        </div>
      )}
    </div>
  );
}

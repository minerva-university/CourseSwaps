import React from "react";
import { useUser } from "../contexts/UserContext";

export default function Home() {
  const { user } = useUser();
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

import React from "react";

export default function Home({user}) {
  return <div>{user && (
    <div>
      <img src={user.picture} alt="User's Picture" /> 
      <h3>{user.name}</h3>
    </div>
  )}</div>;
}

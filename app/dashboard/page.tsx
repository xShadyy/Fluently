'use client';

import { useEffect, useState } from "react";
import UserCard from "../components/UserCard/UserCard"; 
import MultipleChoiceGame from "../components/MultipleChoiceGame/MultipleChoiceGame";

export default function Dashboard() {
  const [mcResult, setMcResult] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        setError(data.error || "Failed to fetch user data");
      }
    };
    fetchUser();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <UserCard user={user} />
    </div>
  );
}

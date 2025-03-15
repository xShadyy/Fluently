"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  avatar?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function refreshUser() {
    try {
      const res = await fetch("/api/user", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

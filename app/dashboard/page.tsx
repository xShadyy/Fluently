"use client";

import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Button, Group, Box } from "@mantine/core";
import DashRoot from "../components/ui/DashboardContent/DashboardContent";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [visible, { toggle }] = useDisclosure(false);

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

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!user) {
    return;
  }
  <Box pos="relative">
    <LoadingOverlay
      visible={visible}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
    />
  </Box>;

  return (    
    <DashRoot />
  );
}

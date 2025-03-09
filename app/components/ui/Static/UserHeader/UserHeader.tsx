"use client";

import { useEffect, useState } from "react";
import UserCard from "../../UserCard/UserCard";
import { Container, Group, Image, Text } from "@mantine/core";
import classes from "./UserHeader.module.css";

export default function DashboardHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  }, []);

  return (
    <Container size="100%" className={classes.container}>
      <Group className={classes.header}>
          <Image
            src="/images/fluently-clean-wh.png"
            alt="Fluently Logo"
            width={35}
            height={35}
          />

        <Group gap="md" mt="sm">
          
            {user ? (
              <UserCard user={user} />
            ) : (
              <Text size="sm" color="dimmed">
                Not logged in
              </Text>
            )}

        </Group>
      </Group>
    </Container>
  );
}

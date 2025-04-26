"use client";

import { Group, Stack, Text, Avatar, Menu, Loader } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
function getInitials(name: string): string {
  if (!name) {
    return "";
  }
  const names = name.trim().split(" ");
  if (names.length === 1) {
    return names[0].slice(0, 2).toUpperCase();
  }
  return names
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function UserCard() {
  const { data: session, status, update: updateSession } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const fetchUserInfo = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/auth/user-info?userId=${session.user.id}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error("Failed to fetch user info");
      }

      const data = await response.json();

      if (data.username) {
        setUsername(data.username);
      }
      if (data.email) {
        setEmail(data.email);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchUserInfo();
    }
  }, [session, status]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <Group gap="sm" mb="1.5rem">
      <Stack gap={0} align="flex-end">
        <Text size="lg" c="whitesmoke" fw={500}>
          Welcome back {username}
        </Text>
        <Text size="md" c="rgb(251, 207, 232)">
          {email}
        </Text>
      </Stack>

      <Menu
        transitionProps={{ transition: "rotate-right", duration: 150 }}
        trigger="click"
        position="bottom"
        offset={1}
        withArrow
        arrowPosition="center"
      >
        <div>
          <Menu.Target>
            <Avatar
              size="lg"
              radius="xl"
              color="gray"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
            >
              {getInitials(username)}
            </Avatar>
          </Menu.Target>
        </div>
      </Menu>
    </Group>
  );
}

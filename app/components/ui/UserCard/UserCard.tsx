"use client";

import { Group, Stack, Text, Avatar, Menu } from "@mantine/core";

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

  export default function UserCard({
    user,
  }: {
    user: { username: string; email: string; createdAt: string };
  }) {

  return (
    <Group gap="sm" mb="1.5rem">
      <Stack gap={0} align="flex-end">
        <Text size="lg" c="whitesmoke" fw={500}>
          Welcome back {user.username}
        </Text>
        <Text size="md" c="rgb(251, 207, 232)">
          {user.email}
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
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            >
              {getInitials(user.username)}
            </Avatar>
          </Menu.Target>
        </div>
      </Menu>
    </Group>
  );
}

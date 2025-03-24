"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Text,
  Loader,
  Stack,
  TextInput,
  Button,
  Notification,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import styles from "./UserProfileData.module.css";
import { uiClick } from "@/app/utils/sound";

type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  avatar?: string;
};

export default function UserProfileData() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
        setNewUsername(data.user.username);
      } catch (error) {
        console.error(error);
        setError("Failed to load user data.");
      }
    }
    fetchUser();
  }, []);

  const handleUsernameUpdate = async () => {
    if (!user || newUsername.trim() === "" || newUsername === user.username)
      return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername.trim() }),
      });

      if (!res.ok) throw new Error("Failed to update username");

      const data = await res.json();
      setUser(data.user);
      setIsEditing(false);
      setSuccess("Username updated successfully!");
    } catch (error) {
      console.error(error);
      setError("Error updating username.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader size="lg" className={styles.loader} />;

  return (
    <Card
      className={styles.profile}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <Stack align="center">
        <Avatar
          size="xl"
          radius="xl"
          src={
            user.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
          }
          className={styles.avatar}
        />

        {isEditing ? (
          <>
            <TextInput
              size="sm"
              value={newUsername}
              onChange={(e) => setNewUsername(e.currentTarget.value)}
              placeholder="Enter new username"
              styles={{
                input: {
                  borderColor: "black",
                  "&:focus": {
                    borderColor: "black",
                  },
                },
              }}
            />

            {(error || success) && (
              <Notification
                color={error ? "red" : "green"}
                onClose={() => {
                  setError(null);
                  setSuccess(null);
                }}
                mt="sm"
              >
                {error || success}
              </Notification>
            )}

            <Group justify="space-between" mt="sm">
                <Button
                onClick={() => {
                  handleUsernameUpdate();
                  uiClick.play();
                }}
                disabled={
                  loading ||
                  newUsername.trim() === "" ||
                  newUsername === user.username
                }
                style={{
                  backgroundColor:
                  loading ||
                  newUsername.trim() === "" ||
                  newUsername === user.username
                    ? "gray"
                    : "white",
                  color:
                  loading ||
                  newUsername.trim() === "" ||
                  newUsername === user.username
                    ? "darkgray"
                    : "black",
                }}
                >
                {loading ? "Saving..." : "Save"}
                </Button>

                <Button
                onClick={() => {
                  setIsEditing(false);
                  uiClick.play();
                }}
                disabled={loading}
                style={{
                  backgroundColor: "rgb(251, 207, 232)",
                  color: "black",
                }}
                >
                Cancel
                </Button>
            </Group>
          </>
        ) : (
          <>
            <Group justify="space-between" align="center">
              <Text size="xl" fw={700} c="white">
                Username: {user.username}
              </Text>
                <ActionIcon
                variant="default"
                size="md"
                onClick={() => {
                  setIsEditing(true);
                  uiClick.play();
                }}
                aria-label="Edit Username"
                >
                <IconPencil size={23} />
                </ActionIcon>
            </Group>

            {(error || success) && (
              <Notification
                color={error ? "red" : "green"}
                onClose={() => {
                  setError(null);
                  setSuccess(null);
                  uiClick.play();
                }}
                mt="sm"
              >
                {error || success}
              </Notification>
            )}
          </>
        )}

        <Text size="xl" color="dimmed" className={styles.email}>
          E-mail: {user.email}
        </Text>
        <Text size="xl" c="rgb(248, 249, 250)" className={styles.description}>
          {user.username} has been a{" "}
          <span style={{ color: "rgb(251, 207, 232)", fontWeight: "500" }}>
            Fluently
          </span>{" "}
          member since {new Date(user.createdAt).toLocaleDateString()}.
        </Text>
      </Stack>
    </Card>
  );
}

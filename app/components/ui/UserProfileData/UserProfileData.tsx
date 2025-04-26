"use client";

import {
  Button,
  Container,
  Group,
  Image,
  List,
  Text,
  ThemeIcon,
  Title,
  Loader,
  TextInput,
  ActionIcon,
  Avatar,
  Center,
} from "@mantine/core";
import {
  IconCalendar,
  IconUser,
  IconAt,
  IconPencil,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./UserProfileData.module.css";
import { uiClick } from "@/utils/sound";
import image from "../../../../public/images/image.svg";
import React from "react";
export default function UserProfileData() {
  const { data: session, status, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        setNewUsername(data.username);
        setOriginalUsername(data.username);
      }
      if (data.createdAt) {
        setCreatedAt(data.createdAt);
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

  const handleUsernameUpdate = async () => {
    if (status !== "authenticated" || !session?.user?.id) {
      setError("You must be logged in to update your username");
      return;
    }

    if (newUsername.trim() === "" || newUsername === originalUsername) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: newUsername.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update username");
      }

      await updateSession();
      await fetchUserInfo();

      setIsEditing(false);
      setSuccess("Username updated successfully!");
    } catch (error: any) {
      console.error("Error updating username:", error);
      setError(error.message || "Error updating username.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading")
    return <Loader size="lg" className={styles.loader} />;
  if (status !== "authenticated" || !session?.user) {
    return <Text>Please sign in to view your profile.</Text>;
  }

  const isDisabled =
    loading || newUsername.trim() === "" || newUsername === originalUsername;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container size="md">
        <div className={styles.inner}>
          <div className={styles.content}>
            <Title className={styles.title} ta="center">
              Your <span className={styles.highlight}>fluently</span> user
              informations:
            </Title>

            <Group align="center" mt="md">
              <Avatar
                size="xl"
                radius="xl"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${newUsername}`}
                className={styles.avatar}
              />
            </Group>

            <Center>
              <List mt={30} spacing="sm" size="sm">
                <List.Item
                  icon={
                    <ThemeIcon variant="filled" color="black">
                      <IconUser size={16} style={{ color: "white" }} />
                    </ThemeIcon>
                  }
                >
                  <Group align="center">
                    {isEditing ? (
                      <TextInput
                        size="sm"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.currentTarget.value)}
                        placeholder="Enter new username"
                        styles={{
                          input: {
                            borderColor: "black",
                            "&:focus": { borderColor: "black" },
                          },
                        }}
                      />
                    ) : (
                      <Text size="xl" ta="center">
                        Username: {newUsername}
                      </Text>
                    )}
                    {!isEditing && (
                      <ActionIcon
                        variant="default"
                        size="md"
                        onClick={() => {
                          setIsEditing(true);
                          uiClick.play();
                        }}
                        aria-label="Edit Username"
                      >
                        <IconPencil size={20} />
                      </ActionIcon>
                    )}
                  </Group>
                </List.Item>

                <List.Item
                  icon={
                    <ThemeIcon variant="filled" color="black">
                      <IconAt size={16} style={{ color: "white" }} />
                    </ThemeIcon>
                  }
                >
                  <Text size="xl" ta="center">
                    Email: {session.user.email}
                  </Text>
                </List.Item>

                <List.Item
                  icon={
                    <ThemeIcon variant="filled" color="black">
                      <IconCalendar size={16} style={{ color: "white" }} />
                    </ThemeIcon>
                  }
                >
                  <Text size="xl" ta="center">
                    Member since:{" "}
                    {createdAt
                      ? new Date(createdAt).toLocaleDateString()
                      : "Loading..."}
                  </Text>
                </List.Item>
              </List>
            </Center>

            <Center>
              {isEditing && (
                <Group mt={30} align="center">
                  <Button
                    onClick={() => {
                      handleUsernameUpdate();
                      uiClick.play();
                    }}
                    disabled={isDisabled}
                    radius="xl"
                    size="md"
                    style={{
                      backgroundColor: isDisabled
                        ? "#ccc"
                        : "rgb(251, 207, 232)",
                      color: isDisabled ? "#666" : "black",
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    variant="default"
                    onClick={() => {
                      setIsEditing(false);
                      uiClick.play();
                    }}
                    disabled={loading}
                    radius="xl"
                    size="md"
                  >
                    Cancel
                  </Button>
                </Group>
              )}
            </Center>

            {(error || success) && (
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <Text color={error ? "red" : "green"}>{error || success}</Text>
              </div>
            )}
          </div>

          <Image src={image.src} className={styles.image} />
        </div>
      </Container>
    </motion.div>
  );
}

import { IconCalendar, IconUser } from "@tabler/icons-react";
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
import image from "../../../../public/images/image.svg";
import { IconPencil } from "@tabler/icons-react";
import styles from "./UserProfileData.module.css";
import { uiClick } from "@/app/utils/sound";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

  const isDisabled =
    loading || newUsername.trim() === "" || newUsername === user.username;

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
              Your <span className={styles.highlight}>fluently</span> user <br /> informations:
            </Title>

            <Group align="center" mt="md">
              <Avatar
                size="xl"
                radius="xl"
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                }
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
                        Username: {user.username}
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
                      <IconCalendar size={16} style={{ color: "white" }} />
                    </ThemeIcon>
                  }
                >
                  <Text size="xl" ta="center">
                    Member since: {new Date(user.createdAt).toLocaleDateString()}
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
                      backgroundColor: isDisabled ? "#ccc" : "rgb(251, 207, 232)",
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

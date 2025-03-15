"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserCard from "../UserCard/UserCard";
import { Button, Container, Group, Image, Text } from "@mantine/core";
import classes from "./UserHeader.module.css";

export default function UserHeader({ disableAnimation = false }: { disableAnimation?: boolean }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const MotionLink = motion.create(Link);

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
        <motion.div
          {...(!disableAnimation && { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4, duration: 0.5 } })}
        >
          <Image
            src="/images/fluently-clean-wh.png"
            alt="Fluently Logo"
            width={35}
            height={35}
          />
        </motion.div>

        <Group gap="md" mt="sm">
          <motion.div
            {...(!disableAnimation && { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4, duration: 0.5 } })}
          >
            {user ? (
              <UserCard user={user} />
            ) : (
              <Text size="sm" color="dimmed">
                Not logged in
              </Text>
            )}
          </motion.div>
        </Group>
      </Group>
    </Container>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UserCard from "../UserCard/UserCard";
import { Button, Container, Group, Image, Text, Loader } from "@mantine/core";
import classes from "./UserHeader.module.css";
import React from "react";
import { useSession } from "next-auth/react";

export default function UserHeader({
  disableAnimation = false,
}: {
  disableAnimation?: boolean;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const MotionLink = motion.create(Link);

  return (
    <Container size="100%" className={classes.container}>
      <Group className={classes.header}>
        <motion.div
          {...(!disableAnimation && {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.4, duration: 0.5 },
          })}
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
            {...(!disableAnimation && {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.4, duration: 0.5 },
            })}
          >
            {status === "loading" ? (
              <Loader />
            ) : session?.user ? (
              <UserCard />
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

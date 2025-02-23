"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Button, Container, Group, Image, Text } from "@mantine/core";
import classes from "./Header.module.css";

export default function Header() {
  const router = useRouter();

  const MotionLink = motion.create(Link);

  return (
    <Container size="100%" className={classes.container}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div>
          <Image
            src="/images/fluently-clean-wh.png"
            alt="Fluently Logo"
            w={150}
            h={100}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Group gap="xl">
          <span className={classes.dot} />
          <Text size="md">
            Made by{" "}
            <a
              href="https://github.com/xShadyy"
              style={{ color: "rgb(251, 207, 232)", textDecoration: "none" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              @xShadyy
            </a>
          </Text>
        </Group>
      </motion.div>
      <Group gap="md">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.a
            href="https://www.instagram.com/g80.shadyy/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconBrandInstagram size={32} color="white" />
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.a
            href="https://www.linkedin.com/in/tymoteusz-netter/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconBrandLinkedin size={32} color="white" />
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.a
            href="https://github.com/xShadyy"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconBrandGithub size={32} color="white" />
          </motion.a>
        </motion.div>
      </Group>
    </Container>
  );
}

"use client";

import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Container, Group, Image, rem, Text, Anchor } from "@mantine/core";
import classes from "./UserHeader.module.css";

export default function Header() {
  return (
    <Container size="100%" className={classes.container}>
      <Group className={classes.header}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Image
            src="/images/fluently-clean-wh.png"
            alt="Fluently Logo"
            width={35}
            height={35}
          />
        </motion.div>

        <Group className={classes.centerSection}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Group gap="xl" align="center">
              <span className={classes.dot} />
              <Text size="md" c="white">
                Made by{" "}
                <Anchor
                  href="https://github.com/xShadyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  c="rgb(251, 207, 232)"
                  td="none"
                >
                  @xShadyy
                </Anchor>
              </Text>
            </Group>
          </motion.div>
        </Group>

        <Group gap="md">
          {[
            {
              icon: IconBrandInstagram,
              href: "https://www.instagram.com/g80.shadyy/",
            },
            {
              icon: IconBrandLinkedin,
              href: "https://www.linkedin.com/in/tymoteusz-netter/",
            },
            {
              icon: IconBrandGithub,
              href: "https://github.com/xShadyy",
            },
          ].map((social, index) => (
            <motion.a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <social.icon size={32} color="white" />
            </motion.a>
          ))}
        </Group>
      </Group>
    </Container>
  );
}

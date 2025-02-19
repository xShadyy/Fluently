"use client";
import { Button, Container, Group, Image, Text } from "@mantine/core";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const navItems = ["Features", "Pricing", "About"];

  const MotionLink = motion.create(Link);

  return (
      <Container size="100%" className={classes.container}>
        <MotionLink
          href="/"
          className={classes.logo}
        >
          <div>
            <Image src="/images/fluently-clean-wh.png" alt="Fluently Logo" w={150} h={100}/>
          </div>
        </MotionLink>

        <Group gap="xl">
          {navItems.map((text, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <MotionLink
                href={`/${text.toLowerCase()}`}
                className={classes.navLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {text === "Features" && <span className={classes.dot} />}
                <Text size="md" component="span">
                  {text}
                </Text>
              </MotionLink>
            </motion.div>
          ))}
        </Group>

        <Group gap="md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <MotionLink
              href="/login"
              className={classes.navLink}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Text size="lg">Login</Text>
            </MotionLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                href="/signup"
                variant="filled"
                color="gray.9"
              >
                <Text size="lg">SignUp</Text>
              </Button>
            </motion.div>
          </motion.div>
        </Group>
      </Container>
  );
}

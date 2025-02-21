"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Container,
  Group,
  Center,
  Image,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import classes from "./loginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      if (keepLoggedIn) {
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; Secure; HttpOnly`;
      } else {
        localStorage.setItem("token", data.token);
      }
      router.push("/dashboard");
    } else {
      setError(data.error || "Invalid email or password");
    }
  };

  return (
    <div className={classes.wrapper}>
      <Container size="100%" className={classes.header}>
        <motion.a href="/" className={classes.logo}>
          <div>
            <Image
              src="/images/fluently-clean-wh.png"
              alt="Fluently Logo"
              w={150}
              h={100}
            />
          </div>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Group gap="xl">
            <span className={classes.dot} />
            <Text size="md" color="white">
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

      <div className={classes.content}>
        <motion.h1
          className={classes.heading}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Save <span className={classes.highlight}>100+</span> hours of studying
        </motion.h1>

        <motion.p
          className={classes.subheading}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Join our platform and accelerate your learning journey
          <br></br>
          while using innovative tools and solutions helping you grow
        </motion.p>

        <motion.div
          className={classes.contactCard}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className={classes.avatar}>
            <Image
              src="/images/avatar.jpg"
              alt="Tom Bruce"
              width={60}
              height={60}
            />
          </div>
          <div className={classes.contactInfo}>
            <div className={classes.contactName}>Tymoteusz Netter</div>
            <div className={classes.contactTitle}>Founder @ <span className={classes.highlight}>Fluently</span> </div>
          </div>
          <motion.a
            href="https://github.com/xShadyy"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconBrandGithub size={24} color="white" />
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Paper w={400} h={500} className={classes.form} radius={10} p={40}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Text color="red" ta="center" mb="md">
                  {error}
                </Text>
              </motion.div>
            )}

            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              styles={{
                input: {
                  backgroundColor: "#030303",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                },
                label: { color: "white" },
              }}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              styles={{
                input: {
                  backgroundColor: "#030303",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                },
                label: { color: "white" },
              }}
            />

            <Checkbox
              label="Keep me logged in"
              mt="xl"
              size="md"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.currentTarget.checked)}
              styles={{
                input: {
                  backgroundColor: keepLoggedIn ? "#030303" : undefined,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                },
                label: { color: "white" },
              }}
            />
            <Center>
              <Button
                w="250px"
                h="50px"
                mt="xl"
                size="md"
                onClick={handleLogin}
                variant="gradient"
                gradient={{ from: "purple", to: "pink" }}
                styles={{
                  root: {
                    backgroundColor: keepLoggedIn ? "#030303" : undefined,
                  },
                }}
              >
                Login
              </Button>
            </Center>

            <Text ta="center" mt="md" c="white">
              Don&apos;t have an account?{" "}
              <Anchor<"a">
                href="/register"
                fw={700}
                style={{ color: "rgb(251, 207, 232)" }}
              >
                Register
              </Anchor>
            </Text>
          </Paper>
        </motion.div>
      </div>
    </div>
  );
}

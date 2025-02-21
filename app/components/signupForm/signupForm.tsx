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
import classes from "./signupForm.module.css";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    setError("");

    if (!email || !password || !confirmPassword || !username) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();
    if (response.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "Something went wrong");
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
          Join <span className={classes.highlight}>Us</span> and conquer the world
        </motion.h1>

        <motion.p
          className={classes.subheading}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Create account and start learning languages with ease
          <br></br>
          allowing <span className={classes.highlight}>You</span> to explore new possibilities
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
              alt="Avatar"
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
          <Paper w={400} h={550} className={classes.form} radius={10} p={40}>

            {error && (
              <Text color="red" ta="center" mb="md">
                {error}
              </Text>
            )}

            <TextInput
              label="Username"
              placeholder="CoolGuy"
              size="md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              styles={{
                input: {
                  backgroundColor: "#030303",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                },
                label: { color: "white" },
              }}
            />
            <TextInput
              mt="md"
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

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              mt="md"
              size="md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              styles={{
                input: {
                  backgroundColor: "#030303",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
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
                onClick={handleSignup}
                variant="gradient"
                gradient={{ from: "purple", to: "pink" }}
              >
                Sign Up
              </Button>
            </Center>

            <Text ta="center" mt="md" c="white">
              Already have an account?{" "}
              <Anchor<"a">
                href="/login"
                fw={700}
                style={{ color: "rgb(251, 207, 232)" }}
              >
                Login
              </Anchor>
            </Text>
          </Paper>
        </motion.div>
      </div>
    </div>
  );
}

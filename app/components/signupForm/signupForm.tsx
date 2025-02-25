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
  Container,
  Group,
  Center,
  Image,
  Box,
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
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

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
      body: JSON.stringify({ email, password, username, isRegister: true }),
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      router.push("/login");
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <Box className={classes.pageWrapper}>
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

      <Container size="lg" className={classes.wrapper}>
        <Group className={classes.content}>
          <motion.h1
            className={classes.heading}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join <span className={classes.highlight}>Us</span> and conquer the
            world
          </motion.h1>

          <motion.p
            className={classes.subheading}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Create account and start learning languages with ease
            <br />
            allowing <span className={classes.highlight}>You</span> to explore
            new possibilities
          </motion.p>

          <motion.div
            className={classes.contactCard}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Group>
              <Image
                src="/images/avatar.jpg"
                alt="Avatar"
                width={60}
                height={60}
                radius="xl"
              />
            </Group>
            <div className={classes.contactInfo}>
              <div className={classes.contactName}>Tymoteusz Netter</div>
              <div className={classes.contactTitle}>
                Founder @ <span className={classes.highlight}>Fluently</span>
              </div>
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
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <Paper className={classes.form} radius="md" p="xl">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Text c="red" ta="center" mb="md">
                    {error}
                  </Text>
                </motion.div>
              )}

              <TextInput
                label="Username"
                placeholder="CoolGuy"
                size="md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                styles={{
                  label: { color: "white" },
                  input: {
                    borderColor: isUsernameFocused ? "rgb(251, 207, 232)" : "rgba(255, 255, 255, 0.4)",
                    transition: "border-color 0.3s ease",
                  },
                }}
              />

              <TextInput
                label="Email address"
                placeholder="hello@gmail.com"
                size="md"
                mt="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                styles={{
                  label: { color: "white" },
                  input: {
                    borderColor: isEmailFocused ? "rgb(251, 207, 232)" : "rgba(255, 255, 255, 0.4)",
                    transition: "border-color 0.3s ease",
                  },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                mt="md"
                size="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                styles={{
                  label: { color: "white" },
                  input: {
                    borderColor: isPasswordFocused ? "rgb(251, 207, 232)" : "rgba(255, 255, 255, 0.4)",
                    transition: "border-color 0.3s ease",
                  },
                }}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                mt="md"
                size="md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
                styles={{
                  label: { color: "white" },
                  input: {
                    borderColor: isConfirmPasswordFocused ? "rgb(251, 207, 232)" : "rgba(255, 255, 255, 0.4)",
                    transition: "border-color 0.3s ease",
                  },
                }}
              />

              <Center>
                <Button
                  w="50%"
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
                <Anchor href="/login" fw={700} c="rgb(251, 207, 232)" td="none">
                  Login
                </Anchor>
              </Text>
            </Paper>
          </motion.div>
        </Group>
      </Container>
    </Box>
  );
}

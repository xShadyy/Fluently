"use client";

import { motion } from "framer-motion";
import classes from "./UserCard.module.css";

interface User {
  username: string;
  email: string;
}

function getInitials(name: string): string {
  if (!name) return "";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
  return names
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function UserCard({ user }: { user: User }) {
  return (
    <motion.div
      className={classes.contactCard}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className={classes.avatar}>{getInitials(user.username)}</div>

      <div className={classes.contactInfo}>
        <div className={classes.contactName}>{user.username}</div>
        <div className={classes.contactEmail}>{user.email}</div>
      </div>
    </motion.div>
  );
}

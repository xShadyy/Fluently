'use client';

import { Card, Avatar, Text, Group } from '@mantine/core';
import styles from './UserCard.module.css';

interface User {
  username: string;
  email: string;
  createdAt: string;
}

function getInitials(name: string): string {
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
  return names.map(n => n[0]).join("").toUpperCase();
}

export default function UserCard({ user }: { user: User }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.card}>
      <Group align="center" className={styles.header}>
        <Avatar size={60} radius="xl" color="blue">
          {getInitials(user.username)}
        </Avatar>
        <div className={styles.userDetails}>
          <Text className={styles.username}>{user.username}</Text>
          <Text className={styles.email}>{user.email}</Text>
        </div>
      </Group>
      <Text className={styles.memberSince}>
        Member since: {new Date(user.createdAt).toLocaleDateString()}
      </Text>
    </Card>
  );
}

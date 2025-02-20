'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './loginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      if (keepLoggedIn) {
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; Secure; HttpOnly`;
      } else {
        localStorage.setItem('token', data.token);
      }
      router.push('/dashboard');
    } else {
      setError(data.error || 'Invalid email or password');
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={10} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back!
        </Title>

        {error && (
          <Text color="red" ta="center" mb="md">
            {error}
          </Text>
        )}

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Checkbox
          label="Keep me logged in"
          mt="xl"
          size="md"
          checked={keepLoggedIn}
          onChange={(e) => setKeepLoggedIn(e.currentTarget.checked)}
        />
        <Button fullWidth mt="xl" size="md" onClick={handleLogin}>
          Login
        </Button>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{' '}
          <Anchor<'a'> href="/signup" fw={700}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

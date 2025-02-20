'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Anchor, Button, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import classes from './SignupForm.module.css';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    setError('');

    if (!email || !password || !confirmPassword || !username) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();
    if (response.ok) {
      router.push('/dashboard');
    } else {
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={10} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Create Your Account
        </Title>

        {error && (
          <Text color="red" ta="center" mb="md">
            {error}
          </Text>
        )}

        <TextInput
          label="Username"
          placeholder="Your username"
          size="md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          mt="md"
          size="md"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button fullWidth mt="xl" size="md" onClick={handleSignup}>
          Sign Up
        </Button>

        <Text ta="center" mt="md">
          Already have an account?{' '}
          <Anchor<'a'> href="/login" fw={700}>
            Login
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

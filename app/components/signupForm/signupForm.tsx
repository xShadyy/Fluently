import React from 'react';
import { Anchor, Button, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import classes from './signupForm.module.css';

export function SignupForm() {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Create an account
        </Title>

        <TextInput label="Email address" placeholder="hello@gmail.com" size="md" />
        <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          mt="md"
          size="md"
        />
        <Button fullWidth mt="xl" size="md">
          Register
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

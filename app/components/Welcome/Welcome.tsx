import Link from 'next/link';
import { Anchor, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';
import React from 'react';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Fluently
        </Text>
      </Title>

    </>
  );
}

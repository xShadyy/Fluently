'use client';
import {
  Anchor,
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import classes from './Header.module.css';

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/register');
  };

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <img src="/images/fluently-big.png" alt="BigLogo" className={classes.logo} />

          <Group h="100%" gap={0} visibleFrom="sm">
            <Anchor href="/" className={classes.link}>
              Home
            </Anchor>
            <Anchor href="/learn" className={classes.link}>
              Learn
            </Anchor>
            <Anchor href="/academy" className={classes.link}>
              Academy
            </Anchor>
          </Group>

          <Group visibleFrom="sm">
            <Button variant="default" onClick={handleLogin}>Log in</Button>
            <Button onClick={handleSignup}>Sign up</Button>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Divider my="sm" />

        <Anchor href="/" className={classes.link}>
          Home
        </Anchor>
        <Anchor href="/learn" className={classes.link}>
          Learn
        </Anchor>
        <Anchor href="/academy" className={classes.link}>
          Academy
        </Anchor>

        <Divider my="sm" />

        <Group justify="center" grow pb="xl" px="md">
          <Button variant="default" onClick={handleLogin}>Log in</Button>
          <Button onClick={handleSignup}>Sign up</Button>
        </Group>
      </Drawer>
    </Box>
  );
}
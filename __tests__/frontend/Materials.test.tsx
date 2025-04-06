import React from 'react';
import { render, screen } from '@testing-library/react';
import Materials from '@/components/ui/Materials/Materials';
import { MantineProvider } from '@mantine/core';
import { vi } from 'vitest';

vi.mock('framer-motion', () => {
  return {
    motion: {
      div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

test('Materials component renders without crashing', () => {
  render(
    <MantineProvider>
      <Materials />
    </MantineProvider>
  );

  expect(screen.getByText(/English Learning Materials/i)).toBeInTheDocument();
});

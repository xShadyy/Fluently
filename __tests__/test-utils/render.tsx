import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';

function render(ui: React.ReactElement) {
  return rtlRender(<MantineProvider theme={theme}>{ui}</MantineProvider>);
}

export * from '@testing-library/react';
export { render };

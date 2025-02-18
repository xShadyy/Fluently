import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, DEFAULT_THEME, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme'; // Import your custom Mantine theme

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
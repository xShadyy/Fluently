import { Inter } from 'next/font/google';
import { createTheme, DEFAULT_THEME } from '@mantine/core';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  fontFamily: inter.style.fontFamily,
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: `${inter.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
    fontWeight: '600',
  },
  primaryColor: 'dark',
});

export default theme;
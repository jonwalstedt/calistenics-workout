import type { Preview } from '@storybook/react';
import '@radix-ui/themes/styles.css';
import { Theme, ThemePanel } from '@radix-ui/themes';
import React, { FC } from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  (Story: FC) => {
    return (
      <Theme>
        <Story />
        <ThemePanel defaultOpen={false} />
      </Theme>
    );
  },
];

export default preview;

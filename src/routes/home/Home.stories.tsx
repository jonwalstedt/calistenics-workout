import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Home } from './Home';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-react-router-v6';
import { ThemeProvider, UserContext } from '../../context';
import { mockUser } from '../../test-utils';

const meta = {
  component: Home,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: { path: '/' },
    }),
  },
  decorators: [
    withRouter,
    (Story) => (
      <ThemeProvider>
        <UserContext.Provider
          value={{
            user: mockUser,
            login: fn(),
            logout: fn(),
            addCompletedWorkout: fn(),
            isLoggedIn: true,
            hasCompletedTodaysWorkout: fn(),
          }}
        >
          <Story />
        </UserContext.Provider>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: fn() },
};

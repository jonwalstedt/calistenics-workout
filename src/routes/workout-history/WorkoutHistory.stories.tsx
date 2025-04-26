import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WorkoutHistory } from './WorkoutHistory';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-react-router-v6';
import { mockUser } from '../../test-utils';
import { ThemeProvider, UserContext } from '../../context';

const meta = {
  component: WorkoutHistory,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: { path: '/history' },
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
} satisfies Meta<typeof WorkoutHistory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: fn() },
};

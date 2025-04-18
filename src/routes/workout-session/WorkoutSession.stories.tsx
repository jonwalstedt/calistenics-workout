import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
  withRouter,
  reactRouterParameters,
} from 'storybook-addon-react-router-v6';

import { WorkoutSession } from './WorkoutSession';
import { UserContext } from '../../context';
import { mockUser } from '../../test-utils';

const meta = {
  component: WorkoutSession,
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { workoutId: '2' },
      },
      routing: { path: '/workout/:workoutId' },
    }),
  },
  decorators: [
    withRouter,
    (Story) => (
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
    ),
  ],
} satisfies Meta<typeof WorkoutSession>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: fn() },
};

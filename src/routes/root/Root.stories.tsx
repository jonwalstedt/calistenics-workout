import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Root } from './Root';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-react-router-v6';
import { UserContext } from '../../context';
import { mockUser } from '../../test-utils';

const meta = {
  component: Root,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: { path: '/' },
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
} satisfies Meta<typeof Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: fn() },
};

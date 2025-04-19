import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import { action } from '@storybook/addon-actions';

// Mock workout dates (5 dates in the current month)
const generateMockDates = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  
  return [
    `${year}-${String(month).padStart(2, '0')}-05`,
    `${year}-${String(month).padStart(2, '0')}-10`,
    `${year}-${String(month).padStart(2, '0')}-15`,
    `${year}-${String(month).padStart(2, '0')}-20`,
    `${year}-${String(month).padStart(2, '0')}-25`,
  ];
};

// Generate dates for the previous month
const generatePreviousMonthDates = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth(); // Previous month
  
  // Handle January case (previous month is December of previous year)
  if (month === 0) {
    month = 12;
    return [
      `${year - 1}-${String(month).padStart(2, '0')}-05`,
      `${year - 1}-${String(month).padStart(2, '0')}-15`,
      `${year - 1}-${String(month).padStart(2, '0')}-25`,
    ];
  }
  
  return [
    `${year}-${String(month).padStart(2, '0')}-05`,
    `${year}-${String(month).padStart(2, '0')}-15`,
    `${year}-${String(month).padStart(2, '0')}-25`,
  ];
};

// Generate many dates across multiple months
const generateManyDates = () => {
  const currentMonthDates = generateMockDates();
  const previousMonthDates = generatePreviousMonthDates();
  
  // Add some dates in next month
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 2; // Next month
  let yearAdjustment = 0;
  
  // Handle December case (next month is January of next year)
  if (month > 12) {
    month = 1;
    yearAdjustment = 1;
  }
  
  const nextMonthDates = [
    `${year + yearAdjustment}-${String(month).padStart(2, '0')}-03`,
    `${year + yearAdjustment}-${String(month).padStart(2, '0')}-12`,
    `${year + yearAdjustment}-${String(month).padStart(2, '0')}-21`,
  ];
  
  return [...previousMonthDates, ...currentMonthDates, ...nextMonthDates];
};

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Calendar>;

// Basic example with current month workout dates
export const Default: Story = {
  args: {
    workoutDates: generateMockDates(),
    onDateClick: action('Date clicked'),
  },
};

// Example with sparse workout dates
export const SparseWorkouts: Story = {
  args: {
    workoutDates: [
      generateMockDates()[0], // Just a single date from current month
      generatePreviousMonthDates()[0], // Just a single date from previous month
    ],
    onDateClick: action('Date clicked'),
  },
};

// Example with many workout dates across months
export const ManyWorkoutDates: Story = {
  args: {
    workoutDates: generateManyDates(),
    onDateClick: action('Date clicked'),
  },
};

// Example with no workout dates
export const NoWorkouts: Story = {
  args: {
    workoutDates: [],
    onDateClick: action('Date clicked'),
  },
};

// Example with no click handler
export const ReadOnly: Story = {
  args: {
    workoutDates: generateMockDates(),
    onDateClick: undefined,
  },
}; 
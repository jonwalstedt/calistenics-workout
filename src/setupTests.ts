// Set up any global test environment here
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically unmount and cleanup DOM after each test
afterEach(() => {
  cleanup();
});
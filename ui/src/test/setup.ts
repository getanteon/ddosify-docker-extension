import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Docker Desktop client
vi.mock('@docker/extension-api-client', () => ({
  createDockerDesktopClient: () => ({
    desktopUI: {
      toast: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
      },
    },
    host: {
      openExternal: vi.fn(),
    },
    extension: {
      vm: {
        cli: {
          exec: vi.fn(),
        },
      },
    },
  }),
}));

// Mock crypto.randomUUID for tests
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(7),
  },
});

import { jest } from "@jest/globals";

// Create a stable object for the mock functions
export const mockAuthFunctions = {
  signUpEmail: jest.fn(),
  signInEmail: jest.fn(),
  setActiveOrganization: jest.fn(),
  getSession: jest.fn(),
};

// Intercept the library
jest.mock("../lib/auth", () => ({
  auth: {
    api: mockAuthFunctions,
  },
}));
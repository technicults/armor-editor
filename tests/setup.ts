// Jest setup file
import 'jest-dom/extend-expect';

// Mock DOM APIs that might not be available in jsdom
Object.defineProperty(window, 'getSelection', {
  value: jest.fn(() => ({
    toString: jest.fn(() => ''),
    rangeCount: 0,
    getRangeAt: jest.fn(),
    removeAllRanges: jest.fn(),
    addRange: jest.fn()
  }))
});

Object.defineProperty(document, 'execCommand', {
  value: jest.fn(() => true)
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Suppress console warnings in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
});

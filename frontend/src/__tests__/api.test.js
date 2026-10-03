import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getToken, setToken } from '../lib/api';

describe('api token management', () => {
  beforeEach(() => {
    setToken(null);
  });

  it('starts with no token', () => {
    expect(getToken()).toBeNull();
  });

  it('sets and gets token', () => {
    setToken('test-token');
    expect(getToken()).toBe('test-token');
  });

  it('clears token', () => {
    setToken('test-token');
    setToken(null);
    expect(getToken()).toBeNull();
  });
});

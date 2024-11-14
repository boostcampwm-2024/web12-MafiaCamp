import { useOpenVidu } from '@/hooks/useOpenVidu';
import { renderHook } from '@testing-library/react';

describe('OpenVidu Test', () => {
  beforeAll(() => {
    jest.mock('@/stores/socketStore');
    jest.mock('openvidu-browser', () => {
      OpenVidu: jest.fn();
    });
  });

  beforeEach(() => {});

  test('OpenVidu Hook Test', () => {
    const { result } = renderHook(() => useOpenVidu());
    expect(result.current.isGameStarted).toBe(false);
    expect(result.current.gamePublisher).toBeNull();
    expect(result.current.gameSubscribers).toBe([]);
  });

  afterEach(() => {});

  afterAll(() => {
    jest.clearAllMocks();
  });
});

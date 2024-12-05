/*
// TODO: useOpenVidu 커스텀 훅을 jest로 테스트하려고 했으나, 백엔드와 연동이 필요해서 테스트 코드 작성이 어려워 보류하였습니다.

import { useOpenVidu } from '@/hooks/useOpenVidu';
import { useSocketStore } from '@/stores/socketStore';
import { act, renderHook } from '@testing-library/react';
import { Session } from 'openvidu-browser';
import { Socket } from 'socket.io-client';

describe('OpenVidu Test', () => {
  beforeAll(() => {
    jest.mock('openvidu-browser', () => ({
      OpenVidu: jest.fn().mockImplementation(() => ({
        initSession: jest.fn().mockReturnValue({
          on: jest.fn(),
          connect: jest.fn(),
          publish: jest.fn(),
          disconnect: jest.fn(),
          subscribe: jest.fn(),
          off: jest.fn(),
          initPublisherAsync: jest.fn(() => ({
            publishAudio: jest.fn(),
            publishVideo: jest.fn(),
          })),
        }),
      })),
    }));

    jest.mock('@/stores/socketStore', () => ({
      useSocketStore: jest.fn(),
    }));

    jest.mock('socket.io-client', () => ({
      Socket: jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        off: jest.fn(),
      })),
    }));

    const mockSession = new Session();
    const mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
    };
    const mockSetState = jest.fn();

    useSocketStore.mockReturnValue({
      nickname: 'TestNickname',
      socket: mockSocket,
      session: mockSession,
      setState: mockSetState,
    });
  });

  test('InitialState Test', () => {
    const { result } = renderHook(() => useOpenVidu());

    expect(result.current.isGameStarted).toBe(false);
    expect(result.current.gamePublisher).toBeNull();
    expect(result.current.gameSubscribers).toEqual([]);
  });

  test('Toggle Test', () => {
    const { result } = renderHook(() => useOpenVidu());

    expect(result.current.gamePublisher?.audioEnabled).toBe(true);
    expect(result.current.gamePublisher?.videoEnabled).toBe(true);

    act(() => {
      result.current.toggleAudio();
      result.current.toggleVideo();
    });

    expect(result.current.gamePublisher?.audioEnabled).toBe(false);
    expect(result.current.gamePublisher?.videoEnabled).toBe(false);
  });

  // test('Session Test', () => {
  //   const { result } = renderHook(() => useOpenVidu());

  //   act(() => {});
  // });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
*/

import { useOpenVidu } from '@/hooks/game/useOpenVidu';
import { renderHook } from '@testing-library/react';

describe('OpenVidu Test', () => {
  test('InitialState Test', () => {
    const { result } = renderHook(() => useOpenVidu());

    expect(result.current.isGameStarted).toBe(false);
    expect(result.current.gamePublisher).toBeNull();
    expect(result.current.gameSubscribers).toEqual([]);
  });
});

import { useSocketStore } from '@/stores/socketStore';
import { act, renderHook } from '@testing-library/react';
import { Session } from 'openvidu-browser';
import { Socket } from 'socket.io-client';

describe('socketStore Test', () => {
  beforeEach(() => {
    act(() => {
      useSocketStore.getState().initialize();
    });
  });

  test('InitialState Test', () => {
    const { result } = renderHook(() => useSocketStore());

    expect(result.current.nickname).toBe('');
    expect(result.current.socket).toBeNull();
    expect(result.current.session).toBeNull();
  });

  test('State Test', () => {
    const { result } = renderHook(() => useSocketStore());

    act(() => {
      result.current.setSocketState({
        nickname: 'Test',
        socket: {} as Socket,
        session: {} as Session,
      });
    });

    expect(result.current.nickname).toEqual('Test');
    expect(result.current.socket).not.toBeNull();
    expect(result.current.session).not.toBeNull();
  });

  afterAll(() => {
    act(() => {
      useSocketStore.getState().initialize();
    });
  });
});

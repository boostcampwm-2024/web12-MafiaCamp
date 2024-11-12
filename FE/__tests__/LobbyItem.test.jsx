import LobbyItem from '@/components/lobby/LobbyItem';
import { render, screen } from '@testing-library/react';

describe('LobbyItem', () => {
  it('render a LobbyItem', () => {
    render(
      <LobbyItem
        room={{
          roomId: 'roomId',
          title: '제목',
          capacity: 8,
          participants: 0,
          status: 'READY',
          createdAt: 1234,
        }}
      />,
    );

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});

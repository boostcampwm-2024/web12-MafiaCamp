import LobbyList from '@/components/lobby/LobbyList';
import { render, screen } from '@testing-library/react';

describe('LobbyList', () => {
  it('renders a LobbyList', () => {
    render(<LobbyList />);

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});

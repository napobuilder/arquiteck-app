import { render, screen } from '@testing-library/react';
import TimerDisplay from './TimerDisplay'; // Adjust path if necessary

describe('TimerDisplay', () => {
  it('renders without crashing', () => {
    render(<TimerDisplay />);
    // You can add more specific assertions here, e.g., checking for text content
    expect(screen.getByText(/25:00/i)).toBeInTheDocument();
  });
});
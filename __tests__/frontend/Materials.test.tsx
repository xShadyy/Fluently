// __tests__/frontend/Materials.test.tsx
import React from 'react';
import { render, screen } from '../test-utils/render'; // Adjust the path as needed
import userEvent from '@testing-library/user-event';
import Materials from '@/components/ui/Materials/Materials'; // Adjust the path as needed

describe('Materials Component', () => {
  test('filters by level and shows no results', async () => {
    render(<Materials />);

    // Click the "Advanced" level button to filter resources.
    const advancedButton = screen.getByRole('button', { name: /Advanced/i });
    userEvent.click(advancedButton);

    // Wait for the "No resources found..." message.
    const noResultsMessage = await screen.findByText((content, node) =>
      node?.textContent?.toLowerCase().includes('no resources found matching your filters.') ?? false
    );

    expect(noResultsMessage).toBeInTheDocument();

    // Optionally, check that the reset button is rendered.
    const resetButton = screen.getByRole('button', { name: /reset filters/i });
    expect(resetButton).toBeInTheDocument();
  });
});

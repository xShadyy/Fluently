import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import MultipleChoiceGame from '@/components/ui/MultipleChoiceGame/MultipleChoiceGame';
import { vi } from 'vitest';

describe('MultipleChoiceGame', () => {
  const question = 'What is 2+2?';
  const options = [
    { id: '1', text: '3' },
    { id: '2', text: '4' },
    { id: '3', text: '5' }
  ];
  const correctOptionId = '2';
  let onAnswer = vi.fn();

  beforeEach(() => {
    onAnswer = vi.fn();
  });

  const renderComponent = () =>
    render(
      <MantineProvider>
        <MultipleChoiceGame
          question={question}
          options={options}
          correctOptionId={correctOptionId}
          onAnswer={onAnswer}
        />
      </MantineProvider>
    );

  test('renders question and options', () => {
    renderComponent();
    expect(screen.getByText(question)).toBeInTheDocument();
    options.forEach(option => {
      expect(screen.getByText(option.text)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Submit Answer/i })).toBeInTheDocument();
  });

  test('submit button is disabled when no option is selected', () => {
    renderComponent();
    const submitButton = screen.getByRole('button', { name: /Submit Answer/i });
    expect(submitButton).toBeDisabled();
  });

  test('selecting correct option and submitting calls onAnswer with true', async () => {
    renderComponent();
    const correctButton = screen.getByRole('button', { name: /4/i });
    fireEvent.click(correctButton);
    const submitButton = screen.getByRole('button', { name: /Submit Answer/i });
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(onAnswer).toHaveBeenCalledWith(true);
    });
    options.forEach(option => {
      expect(screen.getByRole('button', { name: new RegExp(option.text, 'i') })).toBeDisabled();
    });
  });

  test('selecting incorrect option and submitting calls onAnswer with false', async () => {
    renderComponent();
    const wrongButton = screen.getByRole('button', { name: /3/i });
    fireEvent.click(wrongButton);
    const submitButton = screen.getByRole('button', { name: /Submit Answer/i });
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(onAnswer).toHaveBeenCalledWith(false);
    });
    options.forEach(option => {
      expect(screen.getByRole('button', { name: new RegExp(option.text, 'i') })).toBeDisabled();
    });
  });
});

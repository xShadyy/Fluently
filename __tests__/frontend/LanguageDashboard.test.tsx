import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageDashboard from "@/components/ui/Dashboard/LanguageDashboard";
import { MantineProvider } from "@mantine/core";

// Mock fetch API
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Create a wrapper function to provide MantineProvider
const renderWithMantine = (ui: React.ReactElement) => {
  return render(
    <MantineProvider>
      {ui}
    </MantineProvider>
  );
};

describe('LanguageDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Clear localStorage mock store between tests
    (localStorageMock.clear as any)();
    
    // Mock fetch for quiz completion data
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        beginner: true,
        intermediate: false,
        advanced: false
      }),
    });
  });

  it('renders the main dashboard elements correctly', async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });
    
    // Wait for data to load
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/quiz/completion');
    });

    // Main stats cards
    expect(screen.getByText('Words Learned')).toBeInTheDocument();
    expect(screen.getByText('Daily Goal')).toBeInTheDocument();
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    expect(screen.getByText('Time Spent')).toBeInTheDocument();
    
    // Check for skill cards
    expect(screen.getByText('Skill Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Weekly Progress')).toBeInTheDocument();
  });

  it('shows the correct achievement status', async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    
    // Check for achievements section title
    expect(screen.getByText('Word Quiz Achievements')).toBeInTheDocument();
    
    // Check that the status of the achievements matches the mock data
    const achievements = screen.getAllByText(/Master|Expert|Champion/);
    expect(achievements).toHaveLength(3);
  });

  it('initializes localStorage with learning start time on first visit', async () => {
    // Ensure getItem returns null to simulate first visit
    localStorageMock.getItem.mockReturnValue(null);
    
    // Use act to ensure state updates are flushed
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });
    
    // Wait for the effect to run
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    }, { timeout: 2000 });
    
    // Now verify that the correct key was used
    const calls = (localStorageMock.setItem as any).mock.calls;
    const learningStartTimeCall = calls.find(([key]: [string, any]) => key === 'learningStartTime');
    expect(learningStartTimeCall).toBeDefined();
  });

  it('uses existing localStorage start time if available', async () => {
    const mockDate = new Date(2023, 0, 1).toISOString(); // Jan 1, 2023
    localStorageMock.getItem.mockReturnValue(mockDate);
    
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });
    
    // Should not set a new time if one exists
    const calls = (localStorageMock.setItem as any).mock.calls;
    const learningStartTimeCall = calls.find(([key]: [string, any]) => key === 'learningStartTime');
    expect(learningStartTimeCall).toBeUndefined();
  });

  it('allows adding new words via the modal', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });
    
    // Click the add button
    const addButton = screen.getByText('Add');
    await user.click(addButton);
    
    // Check if modal appears
    expect(screen.getByText('How many new words did you learn today?')).toBeInTheDocument();
    
    // Find and interact with the input field
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '50');
    
    // Submit the form
    const submitButton = screen.getByText('Add Words');
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Check if modal closed
    await waitFor(() => {
      expect(screen.queryByText('How many new words did you learn today?')).not.toBeInTheDocument();
    });
    
    // Check if words count updated (initial 1250 + 50 = 1300)
    expect(screen.getByText('1300')).toBeInTheDocument();
  });

  it('displays daily goal data correctly', async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });
    
    const dailyGoalSection = screen.getByText('Daily Goal').closest('div');
    expect(dailyGoalSection).toBeInTheDocument();
    
    if (dailyGoalSection) {
      const value = within(dailyGoalSection.parentElement as HTMLElement).getByText('75%');
      expect(value).toBeInTheDocument();
    }
  });

  it('displays streak data correctly', async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });
    
    expect(screen.getByText('12 days')).toBeInTheDocument();
    expect(screen.getByText('Keep it up! 🔥')).toBeInTheDocument();
  });

  it('displays skill breakdown correctly', async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });
    
    const skills = ['Reading', 'Writing', 'Listening', 'Speaking'];
    
    skills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('displays weekly progress correctly', async () => {
    await act(async () => {
      renderWithMantine(<LanguageDashboard />);
    });
    
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    weekdays.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });
});
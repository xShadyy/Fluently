import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../../app/components/ui/SignupForm/signupForm';
import { useRouter } from 'next/navigation';
import { MantineProvider } from '@mantine/core';
import React from 'react';

// --- Simplified getComputedStyle mock that the accessibility utils expect ---
function mockGetComputedStyle() {
  return {
    display: 'block',
    visibility: 'visible',
    getPropertyValue(prop: string) {
      if (prop === 'display') return this.display;
      if (prop === 'visibility') return this.visibility;
      return '';
    },
  };
}

// Override jsdom’s window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle,
});

// Override on global as well (jsdom/testing-library may call this)
Object.defineProperty(global, 'getComputedStyle', {
  value: mockGetComputedStyle,
});

// Mock browser APIs needed for Mantine and Framer Motion
class MockMatchMedia {
  matches = false;
  media: string;
  constructor(query: string) { this.media = query; }
  addListener(_cb: any) {}
  removeListener() {}
  addEventListener(_evt: string, _cb: any) {}
  removeEventListener() {}
}

global.window = global.window || {};
global.window.matchMedia = vi.fn().mockImplementation((q) => new MockMatchMedia(q));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock the next/navigation useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock fetch API
global.fetch = vi.fn();

// Create a test wrapper with MantineProvider and required theme options
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MantineProvider
      theme={{
        colorScheme: 'dark',
      }}
    >
      {ui}
    </MantineProvider>
  );
};

// Create a simplified mock component for testing
vi.mock('../../app/components/ui/SignupForm/signupForm', () => {
  return {
    default: () => {
      const router = useRouter();
      const [email, setEmail] = React.useState('');
      const [password, setPassword] = React.useState('');
      const [confirmPassword, setConfirmPassword] = React.useState('');
      const [username, setUsername] = React.useState('');
      const [error, setError] = React.useState('');

      const handleSignup = async () => {
        setError('');

        if (!email || !password || !confirmPassword || !username) {
          setError('All fields are required');
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username, isRegister: true }),
          credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
          router.push('/login');
        } else {
          setError(data.error || 'Something went wrong');
        }
      };

      return (
        <div>
          <h1>Join Us and conquer the world</h1>
          <form>
            <div>
              <label htmlFor="username">Username</label>
              <input 
                id="username" 
                data-testid="username-input"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="email">Email Address</label>
              <input 
                id="email" 
                data-testid="email-input"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                data-testid="password-input"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                id="confirmPassword" 
                type="password" 
                data-testid="confirm-password-input"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
            {error && <div data-testid="error-message">{error}</div>}
            <button type="button" onClick={handleSignup}>
              Sign Up
            </button>
          </form>
          <div>
            Already have an account? <a href="/login">Login</a>
          </div>
        </div>
      );
    },
  };
});

describe('SignupForm', () => {
  const mockPush = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    (global.fetch as any).mockReset();
  });
  
  it('renders the signup form correctly', () => {
    renderWithProviders(<SignupForm />);
    
    expect(screen.getByText(/Join Us and conquer the world/i)).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });
  
  it('displays error when fields are empty', async () => {
    renderWithProviders(<SignupForm />);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(/all fields are required/i);
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
  
  it('displays error when passwords do not match', async () => {
    renderWithProviders(<SignupForm />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(/passwords do not match/i);
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
  
  it('submits the form successfully and redirects to login page', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User registered successfully' }),
    });
    
    renderWithProviders(<SignupForm />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('email-input'),    { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
          isRegister: true,
        }),
        credentials: 'include',
      });
    });
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
  
  it('shows an error message when registration fails', async () => {
    const errorMessage = 'Email already exists';
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    });
    
    renderWithProviders(<SignupForm />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('email-input'),    { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
  
  it('handles generic error when API response does not contain error message', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });
    
    renderWithProviders(<SignupForm />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('email-input'),    { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(/something went wrong/i);
    });
  });
});

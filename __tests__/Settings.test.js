import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Settings from './Settings';
import * as LoginAPI from '../src/Data/Login';

jest.mock('../src/Data/Login', () => ({
  loadLoginCredentials: jest.fn(),
  updateLoginCredentialById: jest.fn(),
}));

describe('Settings Component', () => {
  const mockCredentials = {
    id: 1,
    email: 'admin@example.com',
    password: 'Admin@123',
  };

  beforeEach(() => {
    LoginAPI.loadLoginCredentials.mockResolvedValue([mockCredentials]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders settings form with initial values', async () => {
    const { getByText, getByLabelText, getByPlaceholderText } = render(<Settings />);

    // Loading indicator should be displayed initially
    expect(getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(getByLabelText('Email')).toBeInTheDocument();
      expect(getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(getByText('Save')).toBeInTheDocument();
    });

    // Check if initial values are populated
    expect(getByLabelText('Email')).toHaveValue(mockCredentials.email);
    expect(getByPlaceholderText('Enter your password')).toHaveValue(mockCredentials.password);
  });

  it('updates credentials on form submission', async () => {
    const { getByText, getByLabelText } = render(<Settings />);

    // Wait for data to load
    await waitFor(() => {
      expect(getByLabelText('Email')).toBeInTheDocument();
    });

    const newEmail = 'newadmin@example.com';
    const newPassword = 'NewPassword@123';

    // Simulate user input and form submission
    fireEvent.change(getByLabelText('Email'), { target: { value: newEmail } });
    fireEvent.change(getByLabelText('Password'), { target: { value: newPassword } });
    fireEvent.click(getByText('Save'));

    // Check if update function is called with correct values
    await waitFor(() => {
      expect(LoginAPI.updateLoginCredentialById).toHaveBeenCalledWith(mockCredentials.id, {
        email: newEmail,
        password: newPassword,
      });
    });

    // Check if success message or alert is shown
    expect(getByText('Credentials updated successfully')).toBeInTheDocument();
  });

  it('displays error messages for invalid inputs', async () => {
    const { getByText, getByLabelText } = render(<Settings />);

    // Wait for data to load
    await waitFor(() => {
      expect(getByLabelText('Email')).toBeInTheDocument();
    });

    // Invalid email input
    fireEvent.change(getByLabelText('Email'), { target: { value: 'invalidemail' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'short' } });
    fireEvent.click(getByText('Save'));

    // Check if error messages are displayed
    expect(getByText('Invalid email address')).toBeInTheDocument();
    expect(getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('handles no credentials found scenario', async () => {
    LoginAPI.loadLoginCredentials.mockResolvedValue([]);

    const { getByText } = render(<Settings />);

    // Wait for loading indicator to disappear
    await waitFor(() => {
      expect(getByText('No credentials found to update')).toBeInTheDocument();
    });

    // Ensure form is not rendered
    expect(getByText('Email')).not.toBeInTheDocument();
    expect(getByText('Password')).not.toBeInTheDocument();
    expect(getByText('Save')).not.toBeInTheDocument();
  });
});

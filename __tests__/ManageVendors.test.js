import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { addVendor } from '../src/Data/Vendors';
import ModifyVendor from '../src/components/ModifyVendor/index';

jest.mock('../src/Data/Vendors', () => ({
  addVendor: jest.fn(),
}));

describe('ModifyVendor Component', () => {
  beforeEach(() => {
    // Reset any mock functions before test
    addVendor.mockClear();
  });

  test('renders Modify Vendor form with initial values', () => {
    const { getByLabelText, getByText } = render(<ModifyVendor />);

    // Check if form fields are rendered
    expect(getByLabelText(/Name/i)).toBeInTheDocument();
    expect(getByLabelText(/Email/i)).toBeInTheDocument();
    expect(getByLabelText(/Phone Number/i)).toBeInTheDocument();

    // Check if submit button is rendered
    expect(getByText(/Update Vendor/i)).toBeInTheDocument(); // Assuming the button text changes after refactoring
  });

  test('validates form fields on submit', async () => {
    const { getByLabelText, getByText } = render(<ModifyVendor />);

    // Find form elements
    const nameField = getByLabelText(/Name/i);
    const emailField = getByLabelText(/Email/i);
    const phoneField = getByLabelText(/Phone Number/i);

    // Simulate user input
    fireEvent.change(nameField, { target: { value: '' } });
    fireEvent.change(emailField, { target: { value: 'invalid-email' } });
    fireEvent.change(phoneField, { target: { value: '123' } });

    // Submit the form inside act
    await act(async () => {
      fireEvent.click(getByText(/Update Vendor/i)); // Assuming the button text changes after refactoring
      await waitFor(() => {
        // Assert validation errors appear
        expect(getByText(/Name is required/i)).toBeInTheDocument();
        expect(getByText(/Invalid email format/i)).toBeInTheDocument();
        expect(getByText(/Phone number must be exactly 10 digits/i)).toBeInTheDocument();
      });
    });

    // Ensure addVendor function is not called
    expect(addVendor).not.toHaveBeenCalled();
  });

  test('submits form data correctly', async () => {
    const { getByLabelText, getByText } = render(<ModifyVendor />);
    const nameField = getByLabelText(/Name/i);
    const emailField = getByLabelText(/Email/i);
    const phoneField = getByLabelText(/Phone Number/i);

    // Simulate user input
    fireEvent.change(nameField, { target: { value: 'Test Vendor' } });
    fireEvent.change(emailField, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneField, { target: { value: '1234567890' } });

    // Mock addVendor function
    addVendor.mockImplementation(() => { });

    // Submit the form inside act
    await act(async () => {
      fireEvent.click(getByText(/Update Vendor/i)); // Assuming the button text changes after refactoring
      await waitFor(() => {
        // Wait for alert message
        expect(window.alert).toHaveBeenCalledWith('Vendor updated successfully!'); // Assuming the success message changes after refactoring
      });
    });

    // Ensure addVendor function is called with correct values
    expect(addVendor).toHaveBeenCalledWith({
      name: 'Test Vendor',
      email: 'test@example.com',
      phone: '1234567890',
    });

  });
});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ModifyVendor from './ModifyVendor';
import { getVendorById, updateVendorById } from '../src/Data/Vendors';
import { loadRestaurants, deleteRestaurantById } from '../src/Data/Restaurants';

jest.mock('../src/Data/Vendors', () => ({
  getVendorById: jest.fn(() => ({ id: 1, name: 'Test Vendor', email: 'test@example.com', phoneNumber: '1234567890' })),
  updateVendorById: jest.fn(),
}));

jest.mock('../src/Data/Restaurants', () => ({
  loadRestaurants: jest.fn(() => []),
  deleteRestaurantById: jest.fn(),
}));

describe('ModifyVendor Component', () => {
  test('renders ModifyVendor with initial values', async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={['/vendors/1']}>
        <Routes>
          <Route path="/vendors/:id" element={<ModifyVendor />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if form fields are rendered with initial values
    expect(getByLabelText(/Name/i)).toHaveValue('Test Vendor');
    expect(getByLabelText(/Email/i)).toHaveValue('test@example.com');
    expect(getByLabelText(/Phone Number/i)).toHaveValue('1234567890');

    // Check if submit button is rendered
    expect(getByText(/Update Vendor/i)).toBeInTheDocument();
  });

  test('validates form fields on submit', async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/vendors/1']}>
        <Routes>
          <Route path="/vendors/:id" element={<ModifyVendor />} />
        </Routes>
      </MemoryRouter>
    );

    // Submit the form without filling any fields
    fireEvent.click(getByText(/Update Vendor/i));

    // Assert validation errors appear
    await waitFor(() => {
      expect(getByText(/Name is required/i)).toBeInTheDocument();
      expect(getByText(/Email is required/i)).toBeInTheDocument();
      expect(getByText(/Phone number is required/i)).toBeInTheDocument();
    });

    // Ensure updateVendorById function is not called
    expect(updateVendorById).not.toHaveBeenCalled();
  });

  test('submits form data correctly', async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={['/vendors/1']}>
        <Routes>
          <Route path="/vendors/:id" element={<ModifyVendor />} />
        </Routes>
      </MemoryRouter>
    );

    // Fill form fields
    fireEvent.change(getByLabelText(/Name/i), { target: { value: 'Updated Vendor Name' } });
    fireEvent.change(getByLabelText(/Email/i), { target: { value: 'updated@example.com' } });
    fireEvent.change(getByLabelText(/Phone Number/i), { target: { value: '9876543210' } });

    // Submit the form
    fireEvent.click(getByText(/Update Vendor/i));

    // Check updateVendorById function is called with correct values
    await waitFor(() => {
      expect(updateVendorById).toHaveBeenCalledWith('1', {
        name: 'Updated Vendor Name',
        email: 'updated@example.com',
        phoneNumber: '9876543210',
      });
    });

    expect(window.alert).toHaveBeenCalledWith('Vendor updated successfully!');
  });

});

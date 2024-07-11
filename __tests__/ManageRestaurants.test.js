import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import RestaurantForm from '../src/components/ManageRestaurant/index';
import { getRestaurantById, addRestaurant, updateRestaurantById } from '../src/Data/Restaurants'; // functions to mock API calls

jest.mock('../src/Data/Restaurants', () => ({
  getRestaurantById: jest.fn(),
  addRestaurant: jest.fn(),
  updateRestaurantById: jest.fn(),
}));

describe('RestaurantForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock function calls before each test
  });

  it('renders form fields correctly', async () => {
    const mockRestaurant = {
      name: 'Test Restaurant',
      description: 'Test Description',
      location: 'Test Location',
      contactNumber: '1234567890',
      openingHour: '10',
      closingHour: '20',
      vendorId: '1',
    };

    getRestaurantById.mockReturnValue(mockRestaurant);

    render(
      <MemoryRouter initialEntries={['/restaurants/edit/1']}>
        <Routes>
          <Route path="/restaurants/edit/:id" element={<RestaurantForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for form to be rendered with initial values
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue(mockRestaurant.name);
      expect(screen.getByLabelText(/description/i)).toHaveValue(mockRestaurant.description);
      expect(screen.getByLabelText(/location/i)).toHaveValue(mockRestaurant.location);
      expect(screen.getByLabelText(/contact number/i)).toHaveValue(mockRestaurant.contactNumber);
      expect(screen.getByLabelText(/opening hour/i)).toHaveValue(mockRestaurant.openingHour);
      expect(screen.getByLabelText(/closing hour/i)).toHaveValue(mockRestaurant.closingHour);
      expect(screen.getByLabelText(/vendor/i)).toHaveValue(mockRestaurant.vendorId);
    });
  });

  it('validates form fields on submit', async () => {
    render(
      <MemoryRouter initialEntries={['/restaurants/add']}>
        <Routes>
          <Route path="/restaurants/add" element={<RestaurantForm />} />
        </Routes>
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Add restaurant' || 'Update restaurant');
    fireEvent.click(submitButton);

    // Check validation messages
    await waitFor(() => {
      expect(screen.getByText(/name is required/i));
      expect(screen.getByText(/description is required/i));
      expect(screen.getByText(/location is required/i));
      expect(screen.getByText(/phone number is required/i));
      expect(screen.getByText(/opening hour is required/i));
      expect(screen.getByText(/closing hour is required/i));
      expect(screen.getByText(/vendor is required/i));
    });
  });


  it('submits form data correctly for new restaurant', async () => {
    render(
      <MemoryRouter initialEntries={['/restaurants/add']}>
        <Routes>
          <Route path="/restaurants/add" element={<RestaurantForm />} />
        </Routes>
      </MemoryRouter>
    );

    const mockValues = {
      name: 'New Restaurant',
      description: 'New Description',
      location: 'New Location',
      contactNumber: '1234567890',
      openingHour: '10',
      closingHour: '20',
      vendorId: '1',
      image: new File(['dummy content'], 'test.png', { type: 'image/png' }), // Mock image file
    };

    const submitButton = screen.getByText('Add restaurant' || 'Update restaurant');
    fireEvent.click(submitButton);

    // Check that addRestaurant function is called with correct arguments
    await waitFor(() => {
      expect(addRestaurant).toHaveBeenCalledWith(mockValues);
    });

  });

  it('submits form data correctly for editing restaurant', async () => {
    const mockRestaurantId = '1';
    const mockValues = {
      name: 'Updated Restaurant',
      description: 'Updated Description',
      location: 'Updated Location',
      contactNumber: '1234567890',
      openingHour: '11',
      closingHour: '21',
      vendorId: '2',
      image: new File(['dummy content'], 'test.png', { type: 'image/png' }), // Mock image file
    };

    getRestaurantById.mockReturnValueOnce(mockValues);

    render(
      <MemoryRouter initialEntries={[`/restaurants/edit/${mockRestaurantId}`]}>
        <Routes>
          <Route path="/restaurants/edit/:id" element={<RestaurantForm />} />
        </Routes>
      </MemoryRouter>
    );

    const submitButton = screen.getByText(/update restaurant/i);
    fireEvent.click(submitButton);

    // Check that updateRestaurantById function is called with correct arguments
    await waitFor(() => {
      expect(updateRestaurantById).toHaveBeenCalledWith(mockRestaurantId, mockValues);
    });

  });

});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RestaurantList from './RestaurantList';
import * as RestaurantsAPI from '../src/Data/Restaurants';
import * as VendorsAPI from '../../Data/Vendors';

describe('RestaurantList Component', () => {
  const mockRestaurants = [
    { id: 1, name: 'Restaurant A', description: 'Description A', location: 'Location A', vendorId: 1 },
    { id: 2, name: 'Restaurant B', description: 'Description B', location: 'Location B', vendorId: 2 },
  ];

  const mockVendors = [
    { id: 1, email: 'vendor1@example.com' },
    { id: 2, email: 'vendor2@example.com' },
  ];

  beforeEach(() => {
    jest.spyOn(RestaurantsAPI, 'loadRestaurants').mockResolvedValue(mockRestaurants);
    jest.spyOn(RestaurantsAPI, 'deleteRestaurantById').mockImplementation(() => { });
    jest.spyOn(VendorsAPI, 'loadVendors').mockResolvedValue(mockVendors);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders restaurant list correctly', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <MemoryRouter>
        <RestaurantList />
      </MemoryRouter>
    );

    // Loading indicator should be displayed initially
    expect(getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load and check if table headers render correctly
    await waitFor(() => {
      expect(getByText('ID')).toBeInTheDocument();
      expect(getByText('Name')).toBeInTheDocument();
      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Location')).toBeInTheDocument();
      expect(getByText('Vendor Email')).toBeInTheDocument();
    });

    // Check if search input renders correctly
    const searchInput = getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();

    // Check if restaurants are displayed in the data grid
    mockRestaurants.forEach((restaurant) => {
      expect(getByText(restaurant.name)).toBeInTheDocument();
      expect(getByText(restaurant.description)).toBeInTheDocument();
      expect(getByText(restaurant.location)).toBeInTheDocument();
      const vendorEmail = mockVendors.find((vendor) => vendor.id == restaurant.vendorId)?.email || 'N/A';
      expect(getByText(vendorEmail)).toBeInTheDocument();
    });

    // Check if Add New Restaurant button is present
    expect(getByText('Add New Restaurant')).toBeInTheDocument();

    // Mock delete function and test deletion
    const deleteButton = getByTestId(`delete-button-${mockRestaurants[0].id}`);
    fireEvent.click(deleteButton);
    expect(RestaurantsAPI.deleteRestaurantById).toHaveBeenCalledWith(mockRestaurants[0].id);

    // Check if alert for deletion success appears
    await waitFor(() => {
      expect(getByText('Restaurant deleted successfully')).toBeInTheDocument();
    });

    // Check if navigating to add new restaurant works
    fireEvent.click(getByText('Add New Restaurant'));
    expect(window.location.pathname).toBe('/restaurants/add');
  });

  it('filters restaurants based on search query', async () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <RestaurantList />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Wait for data to load
      expect(getByText('ID')).toBeInTheDocument();
    });

    const searchInput = getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Restaurant A' } });

    // Check if only filtered restaurant is displayed
    expect(getByText('Restaurant A')).toBeInTheDocument();
    expect(queryByText('Restaurant B')).not.toBeInTheDocument();
  });

  it('handles error when loading restaurants', async () => {
    jest.spyOn(RestaurantsAPI, 'loadRestaurants').mockRejectedValue(new Error('Failed to load restaurants'));

    const { getByText } = render(
      <MemoryRouter>
        <RestaurantList />
      </MemoryRouter>
    );

    // Check if error message is displayed
    await waitFor(() => {
      expect(getByText('Error: Failed to load restaurants')).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import VendorList from './VendorList';
import * as VendorsAPI from '../src/Data/Vendors';

jest.mock('../src/Data/Vendors', () => ({
  loadVendors: jest.fn(),
  deleteVendorById: jest.fn(),
}));

describe('VendorList Component', () => {
  const mockVendors = [
    { id: 1, name: 'Vendor A', email: 'vendorA@example.com' },
    { id: 2, name: 'Vendor B', email: 'vendorB@example.com' },
    { id: 3, name: 'Vendor C', email: 'vendorC@example.com' },
  ];

  beforeEach(() => {
    VendorsAPI.loadVendors.mockReturnValue(mockVendors);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders vendor list with initial data', async () => {
    const { getByText, getByPlaceholderText } = render(<VendorList />);

    // Loading indicator should be displayed initially
    expect(getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(getByText('Vendors')).toBeInTheDocument();
      expect(getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    // Check if initial vendor data is rendered
    mockVendors.forEach((vendor) => {
      expect(getByText(vendor.name)).toBeInTheDocument();
      expect(getByText(vendor.email)).toBeInTheDocument();
    });
  });

  it('filters vendors based on search input', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<VendorList />);

    // Wait for data to load
    await waitFor(() => {
      expect(getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    // Simulate search input
    fireEvent.change(getByPlaceholderText('Search...'), { target: { value: 'Vendor A' } });

    // Check if only filtered vendor is visible
    expect(getByText('Vendor A')).toBeInTheDocument();
    expect(queryByText('Vendor B')).not.toBeInTheDocument();
    expect(queryByText('Vendor C')).not.toBeInTheDocument();
  });

  it('deletes vendor on button click', async () => {
    const { getByText, queryByText } = render(<VendorList />);

    // Wait for data to load
    await waitFor(() => {
      expect(getByText('Vendors')).toBeInTheDocument();
    });

    // Simulate delete button click
    fireEvent.click(getByText('Delete', { exact: false }));

    // Check if deletion function is called
    await waitFor(() => {
      expect(VendorsAPI.deleteVendorById).toHaveBeenCalledTimes(1);
    });

    // Check if vendor is removed from the list
    expect(queryByText('Vendor A')).not.toBeInTheDocument();
  });

  it('displays appropriate message when no vendors are found', async () => {
    VendorsAPI.loadVendors.mockReturnValue([]);

    const { getByText } = render(<VendorList />);

    // Wait for loading indicator to disappear
    await waitFor(() => {
      expect(getByText('No vendors found')).toBeInTheDocument();
    });

    // Ensure form is not rendered
    expect(getByText('Vendors')).toBeInTheDocument();
    expect(getByText('Search...')).toBeInTheDocument();
  });
});

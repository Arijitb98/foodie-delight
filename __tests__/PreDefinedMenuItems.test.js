import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import PredefinedMenuItemForm from '../src/components/PreDefinedMenuItems/index';
import * as PreDefinedMenuItems from '../src/Data/PreDefinedMenuItems';

describe('PredefinedMenuItemForm Component', () => {
  const mockPreDefinedMenuItem = {
    id: 1,
    name: 'Test Item',
    price: 15.99,
    category: 'Test Category',
    image: null,
  };

  beforeEach(() => {
    // Mock functions from PreDefinedMenuItems module
    jest.spyOn(PreDefinedMenuItems, 'getPreDefinedMenuItemsById').mockReturnValue(mockPreDefinedMenuItem);
    jest.spyOn(PreDefinedMenuItems, 'addPreDefinedMenuItems').mockImplementation(() => { });
    jest.spyOn(PreDefinedMenuItems, 'updatePreDefinedMenuItemsById').mockImplementation(() => { });
    jest.spyOn(PreDefinedMenuItems, 'loadPreDefinedMenuItems').mockReturnValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders add menu item form correctly', async () => {
    const { getByText, getByLabelText } = render(
      <MemoryRouter initialEntries={['/add']} initialIndex={0}>
        <Route path="/add">
          <PredefinedMenuItemForm />
        </Route>
      </MemoryRouter>
    );

    // Check if form title renders correctly
    expect(getByText('Add Menu Item')).toBeInTheDocument();

    // Fill in form fields
    fireEvent.change(getByLabelText('Name'), { target: { value: 'New Test Item' } });
    fireEvent.change(getByLabelText('Price'), { target: { value: '12.99' } });
    fireEvent.change(getByLabelText('Category'), { target: { value: 'New Category' } });

    // Submit form
    fireEvent.click(getByText('Add Menu Item'));

    // Check if form submission alert message appears
    await waitFor(() => {
      expect(getByText('Menu item added successfully!')).toBeInTheDocument();
    });
  });

  it('renders edit menu item form correctly', async () => {
    const { getByText, getByLabelText } = render(
      <MemoryRouter initialEntries={['/edit/1']} initialIndex={0}>
        <Route path="/edit/:menuItemId">
          <PredefinedMenuItemForm />
        </Route>
      </MemoryRouter>
    );

    // Check if form title renders correctly
    expect(getByText('Edit Default Menu Item')).toBeInTheDocument();

    // Check if initial values are populated
    expect(getByLabelText('Name')).toHaveValue('Test Item');
    expect(getByLabelText('Price')).toHaveValue('15.99');
    expect(getByLabelText('Category')).toHaveValue('Test Category');

    // Change form values
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Updated Test Item' } });
    fireEvent.change(getByLabelText('Price'), { target: { value: '18.99' } });
    fireEvent.change(getByLabelText('Category'), { target: { value: 'Updated Category' } });

    // Submit form
    fireEvent.click(getByText('Update Menu Item'));

    // Check if form submission alert message appears
    await waitFor(() => {
      expect(getByText('Menu item updated successfully!')).toBeInTheDocument();
    });
  });
});

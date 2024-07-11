import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MenuItemForm from '../src/components/MenuItemForm/index';
import { addMenuItem, updateMenuItemById, loadMenuItems } from '../src/Data/MenuItems';
import { loadPreDefinedMenuItems } from '../src/Data/PreDefinedMenuItems';

jest.mock('../src/Data/MenuItems', () => ({
  addMenuItem: jest.fn(),
  updateMenuItemById: jest.fn(),
  loadMenuItems: jest.fn(() => []),
}));

jest.mock('../src/Data/PreDefinedMenuItems', () => ({
  loadPreDefinedMenuItems: jest.fn(() => []),
}));

describe('MenuItemForm Component', () => {
  test('renders MenuItemForm with initial values', async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={['/restaurants/edit/1/menuitems/new']}>
        <Routes>
          <Route path="/restaurants/edit/:restaurantId/menuitems/:menuItemId" element={<MenuItemForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if form fields are rendered
    expect(getByLabelText(/Name/i)).toBeInTheDocument();
    expect(getByLabelText(/Price/i)).toBeInTheDocument();
    expect(getByLabelText(/Category/i)).toBeInTheDocument();
    expect(getByLabelText(/Image/i)).toBeInTheDocument();

    // Check if submit button is rendered
    expect(getByText(/Add Menu Item/i)).toBeInTheDocument();
  });

  test('validates form fields on submit', async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/restaurants/edit/1/menuitems/new']}>
        <Routes>
          <Route path="/restaurants/edit/:restaurantId/menuitems/:menuItemId" element={<MenuItemForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Submit the form without filling any fields
    fireEvent.click(getByText(/Add Menu Item/i));

    // Assert validation errors appear
    await waitFor(() => {
      expect(getByText(/Name is required/i)).toBeInTheDocument();
      expect(getByText(/Price is required/i)).toBeInTheDocument();
      expect(getByText(/Category is required/i)).toBeInTheDocument();
    });

    // Ensure addMenuItem function is not called
    expect(addMenuItem).not.toHaveBeenCalled();
  });

  test('submits form data correctly for new menu item', async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={['/restaurants/edit/1/menuitems/new']}>
        <Routes>
          <Route path="/restaurants/edit/:restaurantId/menuitems/:menuItemId" element={<MenuItemForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Fill form fields
    fireEvent.change(getByLabelText(/Name/i), { target: { value: 'Test Item' } });
    fireEvent.change(getByLabelText(/Price/i), { target: { value: '10' } });
    fireEvent.change(getByLabelText(/Category/i), { target: { value: 'Test Category' } });

    // Mock loadPreDefinedMenuItems
    loadPreDefinedMenuItems.mockResolvedValueOnce([{ id: 1, name: 'Preset Item', price: 5, category: 'Preset Category' }]);

    // Submit the form
    fireEvent.click(getByText(/Add Menu Item/i));

    // Assert addMenuItem function is called with correct values
    await waitFor(() => {
      expect(addMenuItem).toHaveBeenCalledWith('1', {
        name: 'Test Item',
        price: '10',
        category: 'Test Category',
        image: null,
      });
    });

    expect(window.alert).toHaveBeenCalledWith('Menu item added successfully!');
  });

});

import service from "./ApiService";

// Load menuItems for a specific restaurant
export const loadMenuItems = async (restaurantId) => {
  try {
    const response = await service.get(`/menuItems?restaurantId=${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error('Error loading menu items:', error);
    return [];
  }
};

// Function to add a new menuItem
export const addMenuItem = async (restaurantId, newMenuItem) => {
  try {
    const response = await service.post(`/menuItems`, { restaurantId, ...newMenuItem });
    return response.data;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

// Function to update a menuItem by ID
export const updateMenuItemById = async (restaurantId, id, updatedMenuItem) => {
  try {
    const response = await service.put(`/menuItems/${id}`, { restaurantId, ...updatedMenuItem });
    return response.data;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// Function to get a menuItem by ID
export const getMenuItemById = async (restaurantId, id) => {
  try {
    const response = await service.get(`/menuItems/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting menu item:', error);
    return null;
  }
};

// Function to delete a menuItem by ID
export const deleteMenuItemById = async (restaurantId, id) => {
  try {
    await service.delete(`/menuItems/${id}`);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

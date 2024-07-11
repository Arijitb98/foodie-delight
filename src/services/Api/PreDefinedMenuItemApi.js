import service from "./ApiService";

// Load PreDefinedMenuItems from the API or local storage
export const loadPreDefinedMenuItems = async () => {
  try {
    const response = await service.get(`/preDefinedMenuItems`);
    return response.data;
  } catch (error) {
    console.error('Error loading PreDefinedMenuItems:', error);
    return [];
  }
};

// Function to add a new PreDefinedMenuItem
export const addPreDefinedMenuItem = async (newPreDefinedMenuItem) => {
  try {
    const response = await service.post(`/preDefinedMenuItems`, newPreDefinedMenuItem);
    return response.data;
  } catch (error) {
    console.error('Error adding PreDefinedMenuItem:', error);
    throw error;
  }
};

// Function to update a PreDefinedMenuItem by ID
export const updatePreDefinedMenuItemById = async (id, updatedPreDefinedMenuItem) => {
  try {
    const response = await service.put(`/preDefinedMenuItems/${id}`, updatedPreDefinedMenuItem);
    return response.data;
  } catch (error) {
    console.error('Error updating PreDefinedMenuItem:', error);
    throw error;
  }
};

// Function to get a PreDefinedMenuItem by ID
export const getPreDefinedMenuItemById = async (id) => {
  try {
    const response = await service.get(`/preDefinedMenuItems/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting PreDefinedMenuItem:', error);
    return null;
  }
};

// Function to delete a PreDefinedMenuItem by ID
export const deletePreDefinedMenuItemById = async (id) => {
  try {
    await service.delete(`/preDefinedMenuItems/${id}`);
  } catch (error) {
    console.error('Error deleting PreDefinedMenuItem:', error);
    throw error;
  }
};

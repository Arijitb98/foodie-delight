import service from "./ApiService";

// Load restaurants from the API or local storage
export const loadRestaurants = async () => {
  try {
    const response = await service.get(`restaurants`);
    return response.data;
  } catch (error) {
    console.error('Error loading restaurants:', error);
    return [];
  }
};

// Function to add a new restaurant
export const addRestaurant = async (newRestaurant) => {
  try {
    const response = await service.post(`restaurants`, newRestaurant);
    return response.data;
  } catch (error) {
    console.error('Error adding restaurant:', error);
    throw error;
  }
};

// Function to update a restaurant by ID
export const updateRestaurantById = async (id, updatedRestaurant) => {
  try {
    const response = await service.put(`restaurants/${id}`, updatedRestaurant);
    return response.data;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

// Function to get a restaurant by ID
export const getRestaurantById = async (id) => {
  try {
    const response = await service.get(`restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting restaurant:', error);
    return null;
  }
};

// Function to delete a restaurant by ID
export const deleteRestaurantById = async (id) => {
  try {
    await service.delete(`restaurants/${id}`);
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
};

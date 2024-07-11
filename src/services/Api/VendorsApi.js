import service from "./ApiService";

// Load vendors from the API or local storage
export const loadVendors = async () => {
  try {
    const response = await service.get(`vendors`);
    return response.data;
  } catch (error) {
    console.error('Error loading vendors:', error);
    return [];
  }
};

// Function to add a new vendor
export const addVendor = async (newVendor) => {
  try {
    const response = await service.post(`vendors`, newVendor);
    return response.data;
  } catch (error) {
    console.error('Error adding vendor:', error);
    throw error;
  }
};

// Function to update a vendor by ID
export const updateVendorById = async (id, updatedVendor) => {
  try {
    const response = await service.put(`vendors/${id}`, updatedVendor);
    return response.data;
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};

// Function to get a vendor by ID
export const getVendorById = async (id) => {
  try {
    const response = await service.get(`vendors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting vendor:', error);
    return null;
  }
};

// Function to delete a vendor by ID
export const deleteVendorById = async (id) => {
  try {
    await service.delete(`vendors/${id}`);
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
};

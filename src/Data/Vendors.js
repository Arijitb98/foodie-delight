// Mock data
export const mockVendors = [
  {
    id: 1,
    name: 'Vendor 1',
    email: 'vendor1@example.com',
    phoneNumber: '1234567890'
  },
  {
    id: 2,
    name: 'Vendor 2',
    email: 'vendor2@example.com',
    phoneNumber: '9876543210'
  },
  {
    id: 3,
    name: 'Vendor 3',
    email: 'vendor3@example.com',
    phoneNumber: '5551234567'
  }
];

// Function to load vendors from local storage or initial mock data
export const loadVendors = () => {
  const storedVendors = localStorage.getItem('vendors');
  return storedVendors ? JSON.parse(storedVendors) : [...mockVendors];
};

// Save vendors to local storage
const saveVendors = (vendors) => {
  localStorage.setItem('vendors', JSON.stringify(vendors));
};

// Function to add a new vendor
export const addVendor = (newVendor) => {
  const vendors = loadVendors();
  const id = vendors.length + 1;
  const vendor = { id, ...newVendor };
  const updatedVendors = [...vendors, vendor]; // Create a new array
  saveVendors(updatedVendors);
};

// Function to update a vendor by ID
export const updateVendorById = (id, updatedVendor) => {
  const vendors = loadVendors();
  const index = vendors.findIndex((vendor) => vendor.id == parseInt(id));
  if (index !== -1) {
    vendors[index] = { ...vendors[index], ...updatedVendor };
    saveVendors(vendors); // Save updated vendors
  }
};

// Function to get a vendor by ID
export const getVendorById = (id) => {
  const vendors = loadVendors();
  return vendors.find((vendor) => vendor.id == parseInt(id));
};

// Function to delete a vendor by ID
export const deleteVendorById = (id) => {
  const vendors = loadVendors();
  const index = vendors.findIndex((vendor) => vendor.id == id);
  if (index !== -1) {
    vendors.splice(index, 1); // Remove 1 element at index
    saveVendors(vendors); // Save updated array to local storage
  }
};
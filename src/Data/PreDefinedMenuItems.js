const PreDefinedMenuItems = [
  { id: 101, name: 'Vada Pav', price: 20, category: 'Fast Food' },
  { id: 102, name: 'Pizza', price: 500, category: 'Italian' },
  { id: 103, name: 'Soda', price: 45, category: 'Beverage' },
  { id: 104, name: 'Salad', price: 99, category: 'Healthy' },
  { id: 105, name: 'Shawarma', price: 199, category: 'Grill' },
];

export default PreDefinedMenuItems;

// Load PreDefinedMenuItems from local storage or use initial mock data
export const loadPreDefinedMenuItems = () => {
  const storedPreDefinedMenuItems = localStorage.getItem('PreDefinedMenuItems');
  return storedPreDefinedMenuItems ? JSON.parse(storedPreDefinedMenuItems) : [...PreDefinedMenuItems];
};

// Save PreDefinedMenuItems to local storage
const savePreDefinedMenuItems = (PreDefinedMenuItems) => {
  localStorage.setItem('PreDefinedMenuItems', JSON.stringify(PreDefinedMenuItems));
};

// Function to add a new PreDefinedMenuItems
export const addPreDefinedMenuItems = (newPreDefinedMenuItems) => {
  const PreDefinedMenuItems = loadPreDefinedMenuItems();
  const id = PreDefinedMenuItems.length ? PreDefinedMenuItems[PreDefinedMenuItems.length - 1].id + 1 : 1; // Generate new id
  const PreDefinedMenuItem = { id, ...newPreDefinedMenuItems };
  const updatedPreDefinedMenuItems = [...PreDefinedMenuItems, PreDefinedMenuItem]; // Create a new array
  savePreDefinedMenuItems(updatedPreDefinedMenuItems);
};

// Function to update a PreDefinedMenuItems by ID
export const updatePreDefinedMenuItemsById = (id, updatedPreDefinedMenuItems) => {
  const PreDefinedMenuItems = loadPreDefinedMenuItems();
  const index = PreDefinedMenuItems.findIndex((PreDefinedMenuItems) => PreDefinedMenuItems.id == parseInt(id));
  if (index !== -1) {
    PreDefinedMenuItems[index] = { ...PreDefinedMenuItems[index], ...updatedPreDefinedMenuItems };
    savePreDefinedMenuItems(PreDefinedMenuItems); // Save updated PreDefinedMenuItems
  }
};

// Function to get a PreDefinedMenuItems by ID
export const getPreDefinedMenuItemsById = (id) => {
  const PreDefinedMenuItems = loadPreDefinedMenuItems();
  return PreDefinedMenuItems.find((PreDefinedMenuItems) => PreDefinedMenuItems.id == parseInt(id));
};

// Function to delete a PreDefinedMenuItems by ID
export const deletePreDefinedMenuItemsById = (id) => {
  const PreDefinedMenuItems = loadPreDefinedMenuItems();
  const index = PreDefinedMenuItems.findIndex((PreDefinedMenuItems) => PreDefinedMenuItems.id == id);
  if (index !== -1) {
    PreDefinedMenuItems.splice(index, 1); // Remove 1 element at index
    savePreDefinedMenuItems(PreDefinedMenuItems); // Save updated array to local storage
  }
};
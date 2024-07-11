//Mock Data
const dummyFoodData = {
  1: [
    { id: 1, name: 'Burger', price: 10.99, category: 'Fast Food' },
    { id: 2, name: 'Pizza', price: 12.99, category: 'Italian' },
  ],
  2: [
    { id: 3, name: 'Sushi', price: 15.99, category: 'Japanese' },
    { id: 4, name: 'Salad', price: 8.99, category: 'Healthy' },
  ],
};

export default dummyFoodData;

// Load menuItems for a specific restaurant from local storage or use initial mock data
export const loadMenuItems = (restaurantId) => {
  const storedMenuItems = JSON.parse(localStorage.getItem('menuItems')) || {};
  return storedMenuItems[restaurantId] || dummyFoodData[restaurantId] || [];
};

// Save menuItems for a specific restaurant to local storage
const saveMenuItems = (restaurantId, menuItems) => {
  const allMenuItems = JSON.parse(localStorage.getItem('menuItems')) || {};
  allMenuItems[restaurantId] = menuItems;
  localStorage.setItem('menuItems', JSON.stringify(allMenuItems));
};

// Function to add a new menuItem
export const addMenuItem = (restaurantId, newMenuItem) => {
  const menuItems = loadMenuItems(restaurantId);
  const id = menuItems.length ? menuItems[menuItems.length - 1].id + 1 : 1; // Generate new id
  const menuItem = { id, ...newMenuItem };
  const updatedMenuItems = [...menuItems, menuItem];
  saveMenuItems(restaurantId, updatedMenuItems);
};

// Function to update a menuItem by ID
export const updateMenuItemById = (restaurantId, id, updatedMenuItem) => {
  const menuItems = loadMenuItems(restaurantId);
  const index = menuItems.findIndex((menuItem) => menuItem.id == parseInt(id));
  if (index !== -1) {
    menuItems[index] = { ...menuItems[index], ...updatedMenuItem };
    saveMenuItems(restaurantId, menuItems);
  }
};

// Function to get a menuItem by ID
export const getMenuItemById = (restaurantId, id) => {
  const menuItems = loadMenuItems(restaurantId);
  return menuItems.find((menuItem) => menuItem.id == parseInt(id));
};

// Function to delete a menuItem by ID
export const deleteMenuItemById = (restaurantId, id) => {
  const menuItems = loadMenuItems(restaurantId);
  const index = menuItems.findIndex((menuItem) => menuItem.id == id);
  if (index !== -1) {
    menuItems.splice(index, 1);
    saveMenuItems(restaurantId, menuItems);
  }
};

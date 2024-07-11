export const mockRestaurants = [
  {
    id: 1,
    name: 'Restaurant 1',
    description: 'Description of Restaurant 1',
    location: 'Location 1',
    contactNumber: '1234567890',
    openingHour: "09",
    closingHour: "00",
    vendorId: 1
  },
  {
    id: 2,
    name: 'Restaurant 2',
    description: 'Description of Restaurant 2',
    location: 'Location 2',
    contactNumber: '9876543210',
    openingHour: "06",
    closingHour: "22",
    vendorId: 2
  },
];

// Load restaurants from local storage or use initial mock data
export const loadRestaurants = () => {
  const storedRestaurants = localStorage.getItem('restaurants');
  return storedRestaurants ? JSON.parse(storedRestaurants) : [...mockRestaurants];
};

// Save restaurants to local storage
const saveRestaurants = (restaurants) => {
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
};

// Function to add a new restaurant
export const addRestaurant = (newRestaurant) => {
  const restaurants = loadRestaurants();
  const maxId = restaurants.length > 0 ? Math.max(...restaurants.map(r => r.id)) : 0;
  const id = maxId + 1;
  const restaurant = { id, ...newRestaurant };
  const updatedRestaurants = [...restaurants, restaurant];
  saveRestaurants(updatedRestaurants);
};

// Function to update a restaurant by ID
export const updateRestaurantById = (id, updatedRestaurant) => {
  const restaurants = loadRestaurants();
  const index = restaurants.findIndex((restaurant) => restaurant.id === parseInt(id));
  if (index !== -1) {
    restaurants[index] = { ...restaurants[index], ...updatedRestaurant };
    saveRestaurants(restaurants); // Save updated restaurants
  }
};

// Function to get a restaurant by ID
export const getRestaurantById = (id) => {
  const restaurants = loadRestaurants();
  return restaurants.find((restaurant) => restaurant.id === parseInt(id));
};

// Function to delete a restaurant by ID
export const deleteRestaurantById = (id) => {
  const restaurants = loadRestaurants();
  const index = restaurants.findIndex((restaurant) => restaurant.id === id);
  if (index !== -1) {
    restaurants.splice(index, 1); // Remove 1 element at index
    saveRestaurants(restaurants); // Save updated array to local storage
  }
};
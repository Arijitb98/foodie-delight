// Mock data for restaurants
export const mockRestaurants = [
  {
    id: 1,
    name: 'Restaurant 1',
    description: 'Description of Restaurant 1',
    location: 'Location 1',
    contactNumber: '123-456-7890',
    openingHours: '9 AM - 10 PM'
  },
  {
    id: 2,
    name: 'Restaurant 2',
    description: 'Description of Restaurant 2',
    location: 'Location 2',
    contactNumber: '987-654-3210',
    openingHours: '10 AM - 11 PM'
  }
];

// Function to add a new restaurant
export const addRestaurant = (newRestaurant) => {
  // Generate a unique ID for the new restaurant
  const id = mockRestaurants.length + 1;
  // Create the new restaurant object
  const restaurant = { id, ...newRestaurant };
  // Add the new restaurant to the mock data array
  mockRestaurants.push(restaurant);
};

// Function to update a restaurant by ID
export const updateRestaurantById = (id, updatedRestaurant) => {
  const index = mockRestaurants.findIndex((restaurant) => restaurant.id === id);
  if (index !== -1) {
    mockRestaurants[index] = { ...mockRestaurants[index], ...updatedRestaurant };
  }
};

// Function to get a restaurant by ID
export const getRestaurantById = (id) => {
  return mockRestaurants.find((restaurant) => restaurant.id === parseInt(id));
};

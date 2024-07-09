export const mockRestaurants = [
    {
      id: '1',
      name: 'Restaurant A',
      description: 'A great place for delicious food.',
      location: '123 Main St',
      contactNumber: '123-456-7890',
      openingHours: '9 AM - 9 PM'
    },
    {
      id: '2',
      name: 'Restaurant B',
      description: 'Exquisite cuisine and fine dining.',
      location: '456 Elm St',
      contactNumber: '987-654-3210',
      openingHours: '11 AM - 10 PM'
    }
  ];
  
  export const getRestaurantById = (id) => {
    return mockRestaurants.find((restaurant) => restaurant.id === id);
  };
  
  export const updateRestaurantById = (id, updatedRestaurant) => {
    const index = mockRestaurants.findIndex((restaurant) => restaurant.id === id);
    if (index !== -1) {
      mockRestaurants[index] = { ...mockRestaurants[index], ...updatedRestaurant };
    }
  };
  
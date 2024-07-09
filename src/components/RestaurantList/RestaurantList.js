import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockRestaurants, updateRestaurantById } from '../../Data/Data';
import './styles.css';  // Import the CSS file

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
    setRestaurants(mockRestaurants);
  }, []);

  const deleteRestaurant = (id) => {
    const updatedRestaurants = restaurants.filter((restaurant) => restaurant.id !== id);
    setRestaurants(updatedRestaurants);
    alert('Restaurant deleted successfully');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Restaurants</h1>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} className="restaurant">
            <h2>{restaurant.name}</h2>
            <p>{restaurant.description}</p>
            <p>{restaurant.location}</p>
            <div className="actions">
              <Link to={`/restaurants/edit/${restaurant.id}`}>Edit</Link>
              <button onClick={() => deleteRestaurant(restaurant.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;

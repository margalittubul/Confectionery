
// const API_URL = 'http://localhost:3000/buying';
const API_URL='https://confectionery-server-59ew.onrender.com'

export const getAllBuying = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch Buying list');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Buying list:", error);
    return null;
  }
};
export const getBuyingById = async () => {
  try {
    const token = localStorage.getItem('userToken');

    const response = await fetch(`${API_URL}/my-cart`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Buying cart');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Buying cart by ID:", error);
    return null;
  }
};

export const addProductToBuying = async (productId, quantity) => {
  const token = localStorage.getItem('userToken');

  try {
    const response = await fetch(`${API_URL}/add-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return null;
  }
};

export const removeProductFromBuying = async (productId) => {
  const token = localStorage.getItem('userToken');

  try {
    const response = await fetch(`${API_URL}/remove-product/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove product from Buying');
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing product from Buying:", error);
    return null;
  }
};

export const calculateTotalBuyingPrice = async () => {
  const token = localStorage.getItem('userToken');

  try {
    const response = await fetch(`${API_URL}/total-price`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to calculate total Buying price');
    }
    return await response.json();
  } catch (error) {
    console.error("Error calculating total price:", error);
    return null;
  }
};

export const clearBuyingCart = async () => {
  const token = localStorage.getItem('userToken');
  try {
    
    const response = await fetch(`${API_URL}/clear-cart`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
    return await response.json();
  } catch (error) {
    console.error("Error clearing cart:", error);
    return null;
  }
};

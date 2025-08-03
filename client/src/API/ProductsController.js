const API_URL = 'http://localhost:3000/products';

export const getAllProducts = async (categoryId) => {
  try {
    const url = categoryId ? `${API_URL}?categoryId=${categoryId}` : API_URL;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch products: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product, status: ${response.status}`);
    }
    const data = await response.json();
    return data.product; 
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const addProduct = async (productData) => {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
};

export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
};

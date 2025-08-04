// const API_URL = 'http://localhost:3000/categories'; 
const API_URL='https://confectionery-server-59ew.onrender.com'

export const getAllCategories = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return null;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`); 
    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching category by ID (${id}):`, error);
    return null;
  }
};

export const addCategory = async (categoryData) => {
  const token = localStorage.getItem('userToken');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add category: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error adding category:", error);
    return null;
  }
};

export const updateCategory = async (id, categoryData) => {
  const token = localStorage.getItem('userToken');

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error updating category (${id}):`, error);
    return null;
  }
};


const API_URL = 'http://localhost:3000/customer';

export const getAllCustomers = async () => {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching customers:", error);
    return null;
  }
};

export const getCustomerById = async (id) => {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    return null;
  }
};

export const getCustomerByEmail = async (email) => {
  const token = localStorage.getItem('userToken');
  try {
    //מוודא שהמייל תקין ומקודד אותו
    const response = await fetch(`${API_URL}/by-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer by email');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching customer by email:", error);
    return null;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error('Failed to add customer');
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding customer:", error);
    return null;
  }
};

export const updateCustomer = async (id, customerData) => {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error('Failed to update customer');
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating customer:", error);
    return null;
  }
};

export const loginCustomer = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

export const getCustomerProfile = async () => {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

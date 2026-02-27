// const API_URL = 'http://localhost:3000/customer';
const API_URL = "https://confectionery-server-59ew.onrender.com/customer";

export const getAllCustomers = async () => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching customers:", error);
    return null;
  }
};

export const getCustomerById = async (id) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch customer");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    return null;
  }
};

export const getCustomerByEmail = async (email) => {
  const token = localStorage.getItem("userToken");
  try {
    //מוודא שהמייל תקין ומקודד אותו
    const response = await fetch(
      `${API_URL}/by-email?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch customer by email");
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error("Failed to add customer");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding customer:", error);
    return null;
  }
};

export const updateCustomer = async (id, customerData) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error("Failed to update customer");
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

export const getCustomerProfile = async () => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const joinClub = async (clubData) => {
  const token = localStorage.getItem("userToken");
  try {
    console.log("Sending to server:", clubData);
    const response = await fetch(`${API_URL}/join-club`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clubData),
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      console.error("Server error:", data);
      return data;
    }

    return data;
  } catch (error) {
    console.error("Error joining club:", error);
    return null;
  }
};

export const markFirstPurchaseUsed = async () => {
  const token = localStorage.getItem("userToken");
  try {
    console.log("Calling markFirstPurchaseUsed API");
    const response = await fetch(`${API_URL}/mark-first-purchase`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("markFirstPurchaseUsed response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error("Failed to mark first purchase");
    }

    const data = await response.json();
    console.log("markFirstPurchaseUsed response data:", data);
    return data;
  } catch (error) {
    console.error("Error marking first purchase:", error);
    return null;
  }
};

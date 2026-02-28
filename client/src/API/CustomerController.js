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
    const response = await fetch(`${API_URL}/join-club`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clubData),
    });

    const data = await response.json();

    if (!response.ok) {
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
    const response = await fetch(`${API_URL}/mark-first-purchase`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Failed to mark first purchase");
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking first purchase:", error);
    return null;
  }
};

export const markBirthdayDiscountUsed = async () => {
  const token = localStorage.getItem("userToken");
  try {
    console.log("Calling markBirthdayDiscountUsed API");
    const response = await fetch(`${API_URL}/mark-birthday-discount`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error("Failed to mark birthday discount");
    }

    const data = await response.json();
    console.log("Birthday discount marked:", data);
    console.log("birthday_discount_used_year value:", data.birthday_discount_used_year);
    return data;
  } catch (error) {
    console.error("Error marking birthday discount:", error);
    return null;
  }
};

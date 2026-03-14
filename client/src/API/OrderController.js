const API_URL = "https://confectionery-server-59ew.onrender.com/order";

export const getAllOrders = async () => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await response.json();
    return data.orderList || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrderById = async (id) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
};

export const addOrder = async (orderData) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem("userToken");

  const response = await fetch(`${API_URL}/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update order status");
  }

  return await response.json();
};

export const advanceOrderStatus = async (orderId) => {
  const token = localStorage.getItem("userToken");
  const response = await fetch(`${API_URL}/${orderId}/advance`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to advance");
  return await response.json();
};

export const updateOrderPrice = async (orderId, price) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/${orderId}/price`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ price }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order price");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order price:", error);
    return null;
  }
};

export const updateOrderShipping = async (orderId, hasShipping) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/${orderId}/shipping`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hasShipping }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order shipping");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order shipping:", error);
    return null;
  }
};

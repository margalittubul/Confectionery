// const API_URL = "http://localhost:3000/coupons";
const API_URL = "https://confectionery-server-59ew.onrender.com/coupons";

export const createCoupon = async (couponData) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });

    if (!response.ok) {
      throw new Error("Failed to create coupon");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating coupon:", error);
    return null;
  }
};

export const getAllCoupons = async () => {
  const token = localStorage.getItem("userToken");
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, { headers });

    if (!response.ok) {
      throw new Error("Failed to fetch coupons");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return null;
  }
};

export const getCouponById = async (id) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch coupon");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return null;
  }
};

export const updateCoupon = async (id, couponData) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });

    if (!response.ok) {
      throw new Error("Failed to update coupon");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating coupon:", error);
    return null;
  }
};

export const deleteCoupon = async (id) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete coupon");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return null;
  }
};

export const validateCoupon = async (code, products) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await fetch(`${API_URL}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, products }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { valid: false, message: data.message };
    }

    return data;
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { valid: false, message: "שגיאה בבדיקת הקופון" };
  }
};

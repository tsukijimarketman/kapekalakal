import { API_BASE_URL, fetchWithCredentials } from "../config/api";

export const addToCart = async (productId: string, quantity: number = 1) => {
  const response = await fetchWithCredentials(`${API_BASE_URL}/cart`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok)
    throw new Error((await response.json()).message || "Failed to add to cart");
  return response.json();
};

export const removeFromCart = async (itemId: string) => {
  const response = await fetchWithCredentials(
    `${API_BASE_URL}/cart/${itemId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok)
    throw new Error(
      (await response.json()).message || "Failed to remove from cart"
    );
  return response.json();
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const response = await fetchWithCredentials(
    `${API_BASE_URL}/cart/${itemId}`,
    {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }
  );
  if (!response.ok)
    throw new Error(
      (await response.json()).message || "Failed to update cart item"
    );
  return response.json();
};

export const clearCart = async () => {
  const response = await fetchWithCredentials(`${API_BASE_URL}/cart`, {
    method: "DELETE",
  });
  if (!response.ok)
    throw new Error((await response.json()).message || "Failed to clear cart");
  return response.json();
};

export const getCart = async () => {
  const response = await fetchWithCredentials(`${API_BASE_URL}/cart`);
  if (!response.ok)
    throw new Error((await response.json()).message || "Failed to get cart");
  return response.json();
};

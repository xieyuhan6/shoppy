const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  // Products
  async getProducts(categoryId?: number) {
    const params = new URLSearchParams();
    if (categoryId) params.append('category_id', categoryId.toString());
    const res = await fetch(`${API_BASE}/api/products/?${params}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id: number) {
    const res = await fetch(`${API_BASE}/api/products/${id}/`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/api/categories/`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getCategoryBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/api/categories/${slug}/`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
  },

  // Cart
  async getCart() {
    const res = await fetch(`${API_BASE}/api/cart/me/`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  },

  async addToCart(productId: number, quantity: number = 1) {
    const res = await fetch(`${API_BASE}/api/cart/add_item/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return res.json();
  },

  async removeFromCart(productId: number) {
    const res = await fetch(`${API_BASE}/api/cart/remove_item/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    });
    if (!res.ok) throw new Error('Failed to remove from cart');
    return res.json();
  },

  async updateCartItem(productId: number, quantity: number) {
    const res = await fetch(`${API_BASE}/api/cart/update_item/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    if (!res.ok) throw new Error('Failed to update cart item');
    return res.json();
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/api/cart/clear/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to clear cart');
    return res.json();
  },

  // Orders
  async getOrders() {
    const res = await fetch(`${API_BASE}/api/orders/`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrder(id: number) {
    const res = await fetch(`${API_BASE}/api/orders/${id}/`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  },

  async createOrderFromCart(orderData: {
    full_name: string;
    email: string;
    address: string;
  }) {
    const res = await fetch(`${API_BASE}/api/orders/create_from_cart/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },
};

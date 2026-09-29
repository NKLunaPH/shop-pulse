import { Product } from "@/app/shop/data/products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  pulsePoints?: number;
  tier?: string;
}

export interface OrderItemPayload {
  productId: string;
  productName: string;
  quantity: number;
  color?: string;
  price: number;
}

export interface CheckoutOrderPayload {
  customerName: string;
  email: string;
  items: OrderItemPayload[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
}

export interface OrderRecord extends CheckoutOrderPayload {
  id: string;
  userId?: string;
  status: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt?: string;
}

export interface VendorRecord {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "Audio" | "Wearables" | "Workspace" | "Gaming" | "Smart Home";
  rating: number;
  reviewsCount: number;
  ordersFulfilled: number;
  dispatchRate: number;
  avgResponseTime: string;
  location: string;
  badge: "Flagship Partner" | "Pulse Prime" | "Master Artisan" | "Esports Verified";
  logo: string;
  banner: string;
  featuredProductIds: string[];
  followers: number;
  established: string;
  products?: Product[];
}

export interface AdminMetrics {
  gmv: number;
  revenue: number;
  activeVendors: number;
  totalProducts: number;
  totalOrders: number;
  liveShoppers: number;
}

export interface SystemHealth {
  status: string;
  uptime: string;
  edgeServersOnline: number;
}

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const token = typeof window !== "undefined" ? localStorage.getItem("shoppulse_token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Network request failed" }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string; role?: string }) =>
      fetcher<{ success: boolean; data: { token: string; user: AuthUser }; message?: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (userData: { name: string; email: string; password: string; accountType?: string }) =>
      fetcher<{ success: boolean; data: { token: string; user: AuthUser }; message?: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    getMe: () =>
      fetcher<{ success: boolean; data: AuthUser }>("/auth/me"),
  },

  products: {
    getAll: (params?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }) => {
      const query = new URLSearchParams();
      if (params?.category && params.category !== "All") query.append("category", params.category);
      if (params?.search) query.append("search", params.search);
      if (params?.minPrice !== undefined) query.append("minPrice", params.minPrice.toString());
      if (params?.maxPrice !== undefined) query.append("maxPrice", params.maxPrice.toString());
      if (params?.sort) query.append("sort", params.sort);
      
      const qs = query.toString();
      return fetcher<{ success: boolean; count: number; data: Product[] }>(`/products${qs ? `?${qs}` : ""}`);
    },
    getById: (id: string) =>
      fetcher<{ success: boolean; data: Product }>(`/products/${id}`),
    create: (productData: Partial<Product>) =>
      fetcher<{ success: boolean; data: Product }>("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      }),
  },

  orders: {
    getAll: () =>
      fetcher<{ success: boolean; count: number; data: OrderRecord[] }>("/orders"),
    getById: (id: string) =>
      fetcher<{ success: boolean; data: OrderRecord }>(`/orders/${id}`),
    checkout: (orderData: CheckoutOrderPayload) =>
      fetcher<{ success: boolean; data: OrderRecord; message?: string }>("/orders/checkout", {
        method: "POST",
        body: JSON.stringify(orderData),
      }),
  },

  vendors: {
    getAll: () =>
      fetcher<{ success: boolean; count: number; data: VendorRecord[] }>("/vendors"),
    getById: (id: string) =>
      fetcher<{ success: boolean; data: VendorRecord }>(`/vendors/${id}`),
  },

  admin: {
    getMetrics: () =>
      fetcher<{ success: boolean; data: { metrics: AdminMetrics; systemHealth: SystemHealth } }>("/admin/metrics"),
  },

  health: {
    check: () =>
      fetcher<{ status: string; service: string; database?: { connected: boolean; name: string } }>("/health"),
  },
};

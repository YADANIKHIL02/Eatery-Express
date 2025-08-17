

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantId: string;
  category: string;
  imageHint?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  imageUrl: string;
  imageHint?: string;
  menu?: Dish[]; // Optional: menu might be loaded separately
}

export interface CartItem extends Dish {
  quantity: number;
}

export type OrderStatus = "Pending" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  contactNumber: string;
  estimatedDeliveryTime?: string; // ISO date string or human-readable
  orderDate: string; // ISO date string
}

export interface MockOrderDetails {
  id: string;
  date: string;
  total: number;
  status: OrderStatus; // Using a more specific type
  items: Array<{ id: string; name: string; quantity: number; price: number; description: string; imageUrl: string; restaurantId: string; category: string }>;
  estimatedDeliveryTime: string;
  deliveryAddress: string;
  contactNumber: string;
}

export interface UserPreferences {
  favoriteCuisines: string[];
  dietaryRestrictions: string[];
  spiceLevel: 'mild' | 'medium' | 'hot';
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
}

export interface UserProfile {
  uid: string; // Corresponds to Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  addresses: Address[];
}


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

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  deliveryAddress: string;
  contactNumber: string;
  estimatedDeliveryTime?: string; // ISO date string or human-readable
  orderDate: string; // ISO date string
}

export interface UserPreferences {
  favoriteCuisines: string[];
  dietaryRestrictions: string[];
  spiceLevel: 'mild' | 'medium' | 'hot';
}

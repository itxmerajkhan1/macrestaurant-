export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietary: string[];
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type AdminRole = 'Manager' | 'Staff' | 'Citizen';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  isAdmin?: boolean;
  role?: AdminRole;
  dietaryFlags: {
    vegan: boolean;
    halal: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    noBeef: boolean;
  };
  paymentCards?: {
    id: string;
    number: string;
    expiry: string;
    last4: string;
  }[];
  rewards: number;
  savings: number;
  orders: number;
  orderHistory: Order[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  actionType: 'CANCEL_ORDER' | 'UPDATE_ORDER_STATUS' | 'MODIFY_USER_DATA' | 'SYSTEM_REBOOT';
  targetId: string;
  details: string;
  timestamp: any;
}

export interface Order {
  id: string;
  items: string[];
  total: number;
  totalPrice?: number;
  date: string;
  timestamp?: any;
  status: 'Pending' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
}

export interface GlobalOrder extends Order {
  userId: string;
  userEmail?: string; // User requested field
  customerName: string;
  location?: string;
}

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

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  dietaryFlags: {
    vegan: boolean;
    halal: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    noBeef: boolean;
  };
  paymentCards?: {
    number: string;
    expiry: string;
  }[];
  orderHistory: Order[];
  createdAt: string;
}

export interface Order {
  id: string;
  items: string[];
  total: number;
  date: string;
}

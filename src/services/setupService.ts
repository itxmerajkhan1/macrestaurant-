import { doc, getDoc, setDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GlobalOrder } from '../types';

const ADMIN_EMAIL = 'itxmerajkhan3109@gmail.com';

const DUMMY_ORDERS: GlobalOrder[] = [
  {
    id: 'ORDER-101',
    userId: 'dummy-1',
    customerName: 'Cyber Citizen',
    items: ['Big Mac Meal', 'Large Fries', 'Coke Zero'],
    total: 12.50,
    date: new Date(Date.now() - 3600000).toISOString(),
    status: 'Delivered',
    location: 'Sector 7, Block C'
  },
  {
    id: 'ORDER-102',
    userId: 'dummy-2',
    customerName: 'Neon Rider',
    items: ['McFlurry Oreo', 'Apple Pie'],
    total: 5.99,
    date: new Date(Date.now() - 7200000).toISOString(),
    status: 'Out for Delivery',
    location: 'Dine-in'
  },
  {
    id: 'ORDER-103',
    userId: 'dummy-3',
    customerName: 'Data Ghost',
    items: ['Quarter Pounder', '6pc McNuggets'],
    total: 15.25,
    date: new Date(Date.now() - 10800000).toISOString(),
    status: 'Pending',
    location: 'Neural District, Hub 4'
  }
];

export const initializeCollections = async (userEmail: string, userId: string) => {
  try {
    console.log('--- STARTING MAC SYSTEM INITIALIZATION ---');

    // 1. Admin Setup
    if (userEmail === ADMIN_EMAIL) {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      // JSON Guard for user setup
      const existingData = userSnap.exists() ? userSnap.data() : {};
      
      await setDoc(userRef, {
        ...existingData,
        isAdmin: true,
        role: 'Manager',
        rank: 'Elite Owner',
        displayName: existingData.displayName || 'MERAJ KHAN',
        email: ADMIN_EMAIL,
        uid: userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      console.log('ADMIN PRIVILEGES GRANTED: ELITE OWNER (MANAGER)');
    }

    // 2. Dummy Orders Setup (Only if collection is empty and user is admin)
    if (userEmail === ADMIN_EMAIL) {
      const ordersRef = collection(db, 'orders');
      try {
        const ordersSnap = await getDocs(query(ordersRef, limit(1)));
        
        if (ordersSnap.empty) {
          console.log('INITIALIZING DUMMY DATASET...');
          for (const order of DUMMY_ORDERS) {
            await setDoc(doc(db, 'orders', order.id), order);
          }
          console.log('DUMMY ORDERS TRANSMITTED.');
        }
      } catch (e) {
        console.warn('Could not check orders collection (likely permission issue):', e);
      }
    }

    console.log('--- MAC SYSTEM INITIALIZATION COMPLETE ---');
  } catch (error) {
    console.error('INITIALIZATION ERROR:', error);
  }
};

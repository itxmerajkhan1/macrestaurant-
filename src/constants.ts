import { MenuItem } from './types';

export const MENU_JSON: MenuItem[] = [
  // BURGERS
  {
    id: 'b1',
    name: 'Big Mac',
    description: 'The iconic double-decker with 100% beef patties and our legendary Special Sauce.',
    price: 5.99,
    category: 'burger',
    dietary: ['halal'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800'
  },
  {
    id: 'b2',
    name: 'Quarter Pounder with Cheese',
    description: 'Fresh beef, cooked when you order, topped with two slices of melty American cheese.',
    price: 6.29,
    category: 'burger',
    dietary: ['halal'],
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800'
  },
  {
    id: 'b3',
    name: 'Double Cheeseburger',
    description: 'Two 100% beef patties with a slice of melty American cheese, pickles, onions, ketchup and mustard.',
    price: 3.29,
    category: 'burger',
    dietary: ['halal'],
    image: 'https://images.unsplash.com/photo-1550317138-10000687ad32?q=80&w=800'
  },
  {
    id: 'b4',
    name: 'Filet-O-Fish',
    description: 'Sustainably sourced fish patty, American cheese and creamy tartar sauce.',
    price: 4.49,
    category: 'burger',
    dietary: ['halal', 'no-beef', 'no-pork', 'vegetarian'],
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=800'
  },
  {
    id: 'b5',
    name: 'McDouble',
    description: 'Two 100% beef patties with a slice of American cheese, pickles, onions, ketchup and mustard.',
    price: 2.99,
    category: 'burger',
    dietary: ['halal'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800'
  },
  // CHICKEN
  {
    id: 'c1',
    name: 'McChicken',
    description: 'Crispy chicken patty topped with shredded lettuce and creamy mayonnaise.',
    price: 4.29,
    category: 'chicken',
    dietary: ['halal', 'no-beef', 'no-pork'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800'
  },
  {
    id: 'c2',
    name: 'Chicken McNuggets (10pc)',
    description: 'Tender, juicy Chicken McNuggets made with 100% white meat chicken.',
    price: 5.49,
    category: 'chicken',
    dietary: ['halal', 'no-beef', 'no-pork'],
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800'
  },
  {
    id: 'c3',
    name: 'Spicy McChicken',
    description: 'A spicy, crispy chicken patty topped with shredded lettuce and mayonnaise.',
    price: 4.49,
    category: 'chicken',
    dietary: ['halal', 'no-beef', 'no-pork'],
    image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?q=80&w=800'
  },
  // BREAKFAST
  {
    id: 'br1',
    name: 'Egg McMuffin',
    description: 'A freshly cracked Grade A egg on a toasted English Muffin with lean Canadian bacon.',
    price: 3.99,
    category: 'breakfast',
    dietary: ['halal', 'no-beef'],
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=80&w=800'
  },
  {
    id: 'br2',
    name: 'Sausage McMuffin',
    description: 'A savory hot sausage patty and a slice of melty American cheese on a toasted English Muffin.',
    price: 2.99,
    category: 'breakfast',
    dietary: ['halal', 'no-beef'],
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=80&w=800'
  },
  {
    id: 'br3',
    name: 'Hotcakes',
    description: 'Three golden brown hotcakes with real butter and sweet maple-flavored syrup.',
    price: 3.49,
    category: 'breakfast',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork'],
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=800'
  },
  {
    id: 'br4',
    name: 'Hash Brown',
    description: 'Crispy, golden brown hash brown made from premium potatoes.',
    price: 1.89,
    category: 'breakfast',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=800'
  },
  {
    id: 'br5',
    name: 'Sausage Biscuit',
    description: 'A warm, flaky biscuit topped with a savory hot sausage patty.',
    price: 2.49,
    category: 'breakfast',
    dietary: ['halal', 'no-beef'],
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=80&w=800'
  },
  // SIDES
  {
    id: 's1',
    name: 'World Famous Fries',
    description: 'Crispy and golden on the outside, fluffy on the inside.',
    price: 3.29,
    category: 'sides',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800'
  },
  {
    id: 's2',
    name: 'Apple Slices',
    description: 'Fresh, crunchy apple slices for a healthy snack.',
    price: 1.29,
    category: 'sides',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800'
  },
  // DRINKS
  {
    id: 'd1',
    name: 'Coca-Cola',
    description: 'The classic refreshing soft drink.',
    price: 2.19,
    category: 'drinks',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800'
  },
  {
    id: 'd2',
    name: 'McCafé Coffee',
    description: 'Premium roast coffee made from 100% Arabica beans.',
    price: 1.99,
    category: 'drinks',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800'
  },
  {
    id: 'd3',
    name: 'Iced Tea',
    description: 'Refreshing brewed iced tea.',
    price: 2.19,
    category: 'drinks',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'
  },
  {
    id: 'd4',
    name: 'Orange Juice',
    description: '100% pure orange juice.',
    price: 2.49,
    category: 'drinks',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=800'
  },
  // DESSERTS
  {
    id: 'de1',
    name: 'Oreo McFlurry',
    description: 'Creamy vanilla soft serve with pieces of OREO cookies mixed in.',
    price: 4.19,
    category: 'desserts',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork'],
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800'
  },
  {
    id: 'de2',
    name: 'Apple Pie',
    description: 'Baked apple pie with a lattice crust and warm cinnamon-spiced filling.',
    price: 1.49,
    category: 'desserts',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork'],
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=800'
  },
  {
    id: 'de3',
    name: 'Vanilla Cone',
    description: 'Creamy vanilla soft serve in a crispy cone.',
    price: 1.29,
    category: 'desserts',
    dietary: ['halal', 'vegetarian', 'no-beef', 'no-pork'],
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dabb892?q=80&w=800'
  }
];

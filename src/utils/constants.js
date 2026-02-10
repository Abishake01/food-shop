export const STORAGE_KEYS = {
  FOOD_ITEMS: '@foodshop:foodItems',
  ORDERS: '@foodshop:orders',
  TOKEN_COUNTER: '@foodshop:tokenCounter',
};

export const DEFAULT_FOOD_ITEMS = [
  { id: '1', name: 'Samosa', price: 15, enabled: true },
  { id: '2', name: 'Pakora', price: 20, enabled: true },
  { id: '3', name: 'Chai', price: 10, enabled: true },
  { id: '4', name: 'Biryani', price: 80, enabled: true },
  { id: '5', name: 'Noodles', price: 50, enabled: true },
  { id: '6', name: 'Fried Rice', price: 60, enabled: true },
];

export const ORDER_TYPES = {
  BILL: 'bill',
  TOKEN: 'token',
};

export const TOKEN_STATUS = {
  PREPARING: 'preparing',
  READY: 'ready',
};


import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_FOOD_ITEMS } from './constants';

// Food Items
export const getFoodItems = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    if (data) {
      return JSON.parse(data);
    }
    // Return default items if no data exists
    await saveFoodItems(DEFAULT_FOOD_ITEMS);
    return DEFAULT_FOOD_ITEMS;
  } catch (error) {
    console.error('Error getting food items:', error);
    return DEFAULT_FOOD_ITEMS;
  }
};

export const saveFoodItems = async (items) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving food items:', error);
  }
};

// Orders
export const getOrders = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

export const saveOrder = async (order) => {
  try {
    const orders = await getOrders();
    const updatedOrders = [order, ...orders];
    await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    return order;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

// Token Counter
export const getNextTokenNumber = async () => {
  try {
    const counter = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_COUNTER);
    const nextNumber = counter ? parseInt(counter, 10) + 1 : 1;
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_COUNTER, nextNumber.toString());
    return nextNumber;
  } catch (error) {
    console.error('Error getting token number:', error);
    return 1;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const orders = await getOrders();
    return orders.find(order => order.id === orderId);
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
  }
};


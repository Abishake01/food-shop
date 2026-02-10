import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import FoodCard from '../components/FoodCard';
import OrderSummary from '../components/OrderSummary';
import { getFoodItems } from '../utils/storage';
import { saveOrder, getNextTokenNumber } from '../utils/storage';
import { ORDER_TYPES } from '../utils/constants';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const CARD_MARGIN = theme.spacing.md;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - (CARD_MARGIN * (NUM_COLUMNS + 1))) / NUM_COLUMNS;

const HomeScreen = () => {
  const navigation = useNavigation();
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    const items = await getFoodItems();
    setFoodItems(items);
  };

  const getCartItem = (foodId) => {
    return cart.find(item => item.foodId === foodId);
  };

  const addToCart = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const existingItem = getCartItem(item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.foodId === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        foodId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      }]);
    }
  };

  const removeFromCart = (foodId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCart(cart.filter(item => item.foodId !== foodId));
  };

  const generateOrder = async (type) => {
    if (cart.length === 0) return;

    const orderItems = cart.map(item => ({
      foodId: item.foodId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let tokenNumber = null;
    if (type === ORDER_TYPES.TOKEN) {
      tokenNumber = await getNextTokenNumber();
    }

    const order = {
      id: Date.now().toString(),
      type,
      items: orderItems,
      total,
      timestamp: Date.now(),
      ...(tokenNumber && { tokenNumber }),
    };

    await saveOrder(order);
    setCart([]);

    if (type === ORDER_TYPES.TOKEN) {
      navigation.navigate('Token', { tokenNumber, total, timestamp: order.timestamp });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleGenerateBill = () => {
    generateOrder(ORDER_TYPES.BILL);
  };

  const handleGenerateToken = () => {
    generateOrder(ORDER_TYPES.TOKEN);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const enabledItems = foodItems.filter(item => item.enabled);

  const renderFoodCard = useCallback(({ item }) => {
    const cartItem = getCartItem(item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
        <FoodCard
          item={item}
          quantity={quantity}
          onPress={() => addToCart(item)}
          onLongPress={() => removeFromCart(item.id)}
          disabled={!item.enabled}
        />
      </View>
    );
  }, [cart]);

  return (
    <View style={styles.container}>
      <FlatList
        data={enabledItems}
        renderItem={renderFoodCard}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
      <OrderSummary
        totalItems={totalItems}
        totalPrice={totalPrice}
        onGenerateBill={handleGenerateBill}
        onGenerateToken={handleGenerateToken}
        visible={cart.length > 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.md,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 200, // Space for fixed summary bar
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  cardContainer: {
    marginBottom: theme.spacing.md,
  },
});

export default HomeScreen;


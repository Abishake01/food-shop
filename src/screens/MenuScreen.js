import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import FoodForm from '../components/FoodForm';
import { getFoodItems, saveFoodItems } from '../utils/storage';
import { theme } from '../styles/theme';

const MenuScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadFoodItems();
    }, [])
  );

  const loadFoodItems = async () => {
    const items = await getFoodItems();
    setFoodItems(items);
  };

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingItem(null);
    setFormVisible(true);
  };

  const handleEdit = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingItem(item);
    setFormVisible(true);
  };

  const handleSave = async (itemData) => {
    let updatedItems;
    
    if (editingItem) {
      // Update existing item
      updatedItems = foodItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...itemData }
          : item
      );
    } else {
      // Add new item
      const newItem = {
        id: Date.now().toString(),
        ...itemData,
      };
      updatedItems = [...foodItems, newItem];
    }

    setFoodItems(updatedItems);
    await saveFoodItems(updatedItems);
    setFormVisible(false);
    setEditingItem(null);
  };

  const handleToggleEnabled = async (itemId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedItems = foodItems.map(item =>
      item.id === itemId
        ? { ...item, enabled: !item.enabled }
        : item
    );
    setFoodItems(updatedItems);
    await saveFoodItems(updatedItems);
  };

  const handlePriceEdit = (item) => {
    handleEdit(item);
  };

  const renderFoodItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[styles.itemCard, !item.enabled && styles.itemCardDisabled]}
      onPress={() => handleEdit(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, !item.enabled && styles.itemNameDisabled]}>
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.priceButton}
            onPress={() => handlePriceEdit(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.priceButtonText}>Edit Price</Text>
          </TouchableOpacity>
          <Switch
            value={item.enabled}
            onValueChange={() => handleToggleEnabled(item.id)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.text}
          />
        </View>
      </View>
    </TouchableOpacity>
  ), [foodItems]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Menu</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={foodItems}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <FoodForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        initialData={editingItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h2,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  addButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  itemCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  itemCardDisabled: {
    opacity: 0.6,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  itemNameDisabled: {
    color: theme.colors.textDisabled,
  },
  itemPrice: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  priceButton: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  priceButtonText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.text,
  },
});

export default MenuScreen;


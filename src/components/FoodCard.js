import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../styles/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FoodCard = ({ item, quantity = 0, onPress, onLongPress, disabled }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withSpring(0.8);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const handleLongPress = () => {
    if (!disabled && onLongPress && quantity > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onLongPress();
    }
  };

  return (
    <AnimatedTouchable
      style={[styles.card, animatedStyle, disabled && styles.disabled]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>₹{item.price}</Text>
        {quantity > 0 && (
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>{quantity}</Text>
          </View>
        )}
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minHeight: 100,
    justifyContent: 'center',
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...theme.typography.body,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  price: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  quantityBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  quantityText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default FoodCard;


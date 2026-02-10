import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../styles/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const OrderSummary = ({ totalItems, totalPrice, onGenerateBill, onGenerateToken, visible }) => {
  const scale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleBillPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onGenerateBill();
  };

  const handleTokenPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onGenerateToken();
  };

  if (!visible || totalItems === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={styles.container}
    >
      <View style={styles.summary}>
        <View style={styles.info}>
          <Text style={styles.label}>Items: {totalItems}</Text>
          <Text style={styles.total}>₹{totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.actions}>
          <AnimatedTouchable
            style={[styles.button, styles.billButton, buttonAnimatedStyle]}
            onPress={handleBillPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Bill</Text>
          </AnimatedTouchable>
          <AnimatedTouchable
            style={[styles.button, styles.tokenButton, buttonAnimatedStyle]}
            onPress={handleTokenPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Token</Text>
          </AnimatedTouchable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.large,
    paddingBottom: 20,
  },
  summary: {
    padding: theme.spacing.md,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  total: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.touchTarget.minHeight,
    ...theme.shadows.medium,
  },
  billButton: {
    backgroundColor: theme.colors.primary,
  },
  tokenButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
});

export default OrderSummary;


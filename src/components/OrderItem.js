import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const OrderItem = ({ order, onPress }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderId = () => {
    if (order.type === 'token' && order.tokenNumber) {
      return `Token #${order.tokenNumber}`;
    }
    return `Bill #${order.id.slice(0, 8)}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.id}>{getOrderId()}</Text>
          <Text style={styles.amount}>₹{order.total.toFixed(2)}</Text>
        </View>
        <Text style={styles.date}>{formatDate(order.timestamp)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{order.type.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  id: {
    ...theme.typography.body,
    fontWeight: '600',
    flex: 1,
  },
  amount: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  date: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default OrderItem;


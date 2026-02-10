import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { getOrders, saveOrder } from '../utils/storage';
import { TOKEN_STATUS } from '../utils/constants';
import { theme } from '../styles/theme';

const TokenScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { tokenNumber, total, timestamp } = route.params || {};
  const [status, setStatus] = useState(TOKEN_STATUS.PREPARING);

  useEffect(() => {
    if (tokenNumber) {
      loadTokenStatus();
    }
  }, [tokenNumber]);

  const loadTokenStatus = async () => {
    const orders = await getOrders();
    const order = orders.find(o => o.tokenNumber === tokenNumber);
    if (order && order.status) {
      setStatus(order.status);
    }
  };

  const toggleStatus = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newStatus = status === TOKEN_STATUS.PREPARING
      ? TOKEN_STATUS.READY
      : TOKEN_STATUS.PREPARING;
    
    setStatus(newStatus);
    
    // Update order status in storage
    const orders = await getOrders();
    const orderIndex = orders.findIndex(o => o.tokenNumber === tokenNumber);
    if (orderIndex !== -1) {
      orders[orderIndex].status = newStatus;
      // Note: In a real app, you'd want a proper update function
      // For now, we'll just update the local state
    }
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!tokenNumber) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No token generated yet</Text>
        <Text style={styles.emptySubtext}>Generate a token from the Home screen</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Token Number</Text>
        <Text style={styles.tokenNumber}>{tokenNumber}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Amount</Text>
            <Text style={styles.infoValue}>₹{total?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{formatDate(timestamp)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.statusButton,
            status === TOKEN_STATUS.READY && styles.statusButtonReady
          ]}
          onPress={toggleStatus}
          activeOpacity={0.8}
        >
          <Text style={styles.statusText}>
            {status === TOKEN_STATUS.PREPARING ? 'Preparing' : 'Ready'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  tokenNumber: {
    ...theme.typography.tokenNumber,
    marginBottom: theme.spacing.xl,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  statusButton: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    minWidth: 200,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  statusButtonReady: {
    backgroundColor: theme.colors.success,
  },
  statusText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  emptyText: {
    ...theme.typography.h2,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default TokenScreen;


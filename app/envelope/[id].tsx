import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Design';

export default function EnvelopeDetailScreen() {
  const { name, allocated, spent } = useLocalSearchParams();
  
  // Convert strings to numbers
  const allocatedAmount = parseFloat(allocated as string);
  const spentAmount = parseFloat(spent as string);
  const remaining = allocatedAmount - spentAmount;
  const percentSpent = (spentAmount / allocatedAmount) * 100;
  
  // Sample transactions for this envelope
  const transactions = [
    { id: '1', description: 'Whole Foods', amount: -85.43, date: '2025-10-09' },
    { id: '2', description: 'Trader Joes', amount: -52.18, date: '2025-10-07' },
    { id: '3', description: 'Farmers Market', amount: -32.50, date: '2025-10-05' },
  ];
  
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.header}>
        <Text style={styles.envelopeName}>{name}</Text>
        <View style={styles.amountCard}>
          <Text style={styles.remainingLabel}>Remaining</Text>
          <Text style={styles.remainingAmount}>${remaining.toFixed(2)}</Text>
          <Text style={styles.remainingSubtext}>
            of ${allocatedAmount.toFixed(2)} allocated
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(percentSpent, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {percentSpent.toFixed(0)}% spent
          </Text>
        </View>
      </View>
      
      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>💸 Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
          <Text style={styles.actionButtonTextSecondary}>💰 Add Funds</Text>
        </TouchableOpacity>
      </View>
      
      {/* Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map(transaction => (
          <View key={transaction.id} style={styles.transactionRow}>
            <View>
              <Text style={styles.transactionDesc}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={styles.transactionAmount}>
              ${Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  envelopeName: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.lg,
  },
  amountCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  remainingLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  remainingAmount: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  remainingSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.surface,
    opacity: 0.8,
  },
  progressSection: {
    gap: Spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: Typography.sizes.sm,
    color: Colors.surface,
    opacity: 0.9,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.surface,
  },
  actionButtonTextSecondary: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  transactionDesc: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.error,
  },
});
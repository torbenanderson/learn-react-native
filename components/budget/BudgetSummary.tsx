import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/Design';

interface BudgetSummaryProps {
  totalIncome: number;
  totalAllocated: number;
  totalSpent: number;
}

function BudgetSummary({ totalIncome, totalAllocated, totalSpent }: BudgetSummaryProps) {
  const unallocated = totalIncome - totalAllocated;
  const remaining = totalAllocated - totalSpent;
  
  return (
    <View style={styles.container}>
      {/* Main Balance Card */}
      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Available to Budget</Text>
        <Text style={styles.mainAmount}>
          ${unallocated.toFixed(2)}
        </Text>
        <Text style={styles.mainSubtext}>
          {unallocated > 0 ? 'Ready to allocate' : 'All funds allocated'}
        </Text>
      </View>
      
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: `${Colors.success}20` }]}>
            <Text style={styles.statEmoji}>💰</Text>
          </View>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            ${totalIncome.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: `${Colors.primary}20` }]}>
            <Text style={styles.statEmoji}>📊</Text>
          </View>
          <Text style={styles.statLabel}>Allocated</Text>
          <Text style={[styles.statValue, { color: Colors.primary }]}>
            ${totalAllocated.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: `${Colors.error}20` }]}>
            <Text style={styles.statEmoji}>💸</Text>
          </View>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={[styles.statValue, { color: Colors.error }]}>
            ${totalSpent.toFixed(2)}
          </Text>
        </View>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Budget Progress</Text>
          <Text style={styles.progressPercent}>
            {totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(0) : 0}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%`,
                backgroundColor: totalSpent > totalAllocated ? Colors.error : Colors.primary,
              }
            ]} 
          />
        </View>
        <Text style={styles.progressSubtext}>
          ${remaining.toFixed(2)} remaining in envelopes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  mainCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.medium,
  },
  mainLabel: {
    fontSize: Typography.sizes.base,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  mainAmount: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  mainSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.surface,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statEmoji: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  progressSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  progressPercent: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressSubtext: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default BudgetSummary;
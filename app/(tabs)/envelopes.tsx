import { ScrollView, Text, StyleSheet } from 'react-native';
import EnvelopeCard from '@/components/budget/EnvelopeCard';
import { Colors, Spacing, Typography } from '@/constants/Design';

export default function EnvelopesScreen() {
  const envelopes = [
    { id: '1', name: 'Groceries', icon: '🛒', allocated: 500, spent: 325.50, color: '#10b981' },
    { id: '2', name: 'Rent', icon: '🏠', allocated: 1200, spent: 1200, color: '#3b82f6' },
    { id: '3', name: 'Gas', icon: '⛽', allocated: 150, spent: 89.25, color: '#f59e0b' },
    { id: '4', name: 'Entertainment', icon: '🎬', allocated: 200, spent: 175.80, color: '#8b5cf6' },
    { id: '5', name: 'Dining Out', icon: '🍔', allocated: 100, spent: 95.50, color: '#ef4444' },
  ];
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>All Envelopes</Text>
      {envelopes.map(envelope => (
        <EnvelopeCard key={envelope.id} {...envelope} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
});
import { StyleSheet, Text, View } from 'react-native';

// Define the props interface
interface EnvelopeCardProps {
  name: string;
  icon: string;
  amount: number;
  spent: number;
  color?: string; // Optional color prop
}

function EnvelopeCard({ name, amount, spent, icon, color='#3b82f6' }: EnvelopeCardProps) {
  // Step 2: Define envelope data

  const remaining = amount - spent;
  const percentSpent = amount > 0 ? (spent / amount) * 100 : 0;

  
  // Step 3: Return the UI
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      
      <View style={styles.amounts}>
        <View style={styles.amountRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        </View>
      </View>
     </View>
  );
}
// StyleSheet documentation: https://reactnative.dev/docs/stylesheet
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  amounts: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  lowAmount: {
    color: '#ef4444',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
});

export default EnvelopeCard; 
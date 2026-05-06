import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Define the props interface
interface EnvelopeCardProps {
  id: string; // Add id prop for navigation
  name: string;
  icon: string;
  allocated: number;
  spent: number;
  color?: string; // Optional color prop
}

function EnvelopeCard({ id, name, allocated, spent, icon, color='#3b82f6' }: EnvelopeCardProps) {
  const router = useRouter();
  
  const remaining = allocated - spent;
  const percentSpent = allocated > 0 ? (spent / allocated) * 100 : 0;

  const handlePress = () => {
    router.push({
      pathname: '/envelope/[id]',
      params: { 
        id, 
        name, 
        allocated: allocated.toString(), 
        spent: spent.toString() 
      }
    });
  };
  
  // Step 3: Return the UI
  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: color }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      
      <View style={styles.amounts}>
        <View style={styles.amountRow}>
          <Text style={styles.label}>Allocated:</Text>
          <Text style={styles.amount}>${allocated.toFixed(2)}</Text>
        </View>
        
        <View style={styles.amountRow}>
          <Text style={styles.label}>Spent:</Text>
          <Text style={styles.amount}>${spent.toFixed(2)}</Text>
        </View>
        
        <View style={styles.amountRow}>
          <Text style={styles.label}>Remaining:</Text>
          <Text style={[
            styles.amount, 
            remaining < 50 && styles.lowAmount
          ]}>
            ${remaining.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${percentSpent}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.percentage}>{percentSpent.toFixed(0)}% spent</Text>
    </TouchableOpacity>
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
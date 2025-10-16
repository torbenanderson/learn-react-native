import { ScrollView, StyleSheet, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EnvelopeCard from '@/components/budget/EnvelopeCard';
import MoneyCard from '@/components/budget/MoneyCard';
import { AllocateFunds } from '@/components/budget/AllocateFunds';
import BudgetSummary from '@/components/budget/BudgetSummary';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
      <BudgetSummary 
        totalIncome={3000}
        totalAllocated={2500}
        totalSpent={1850}
      />
      <AllocateFunds />
     
        <Text style={styles.title}>Transactions</Text>
        <MoneyCard
          name="Groceries"
          icon="🛒"
          amount={-500}
          color="#10b981"
        />
        <MoneyCard
          name="Rent"
          icon="🏠"
          amount={200}
          color="#3b82f6"
        />
      <Text style={styles.title}>My Budget Envelopes</Text>
      
      {/* Multiple envelope cards with different data */}
      <EnvelopeCard
        name="Groceries"
        icon="🛒"
        allocated={500}
        spent={325.50}
        color="#10b981"
      />
      
      <EnvelopeCard
        name="Rent"
        icon="🏠"
        allocated={1200}
        spent={1200}
        color="#3b82f6"
      />
      
      <EnvelopeCard
        name="Gas"
        icon="⛽"
        allocated={150}
        spent={89.25}
        color="#f59e0b"
      />
      
      <EnvelopeCard
        name="Entertainment"
        icon="🎬"
        allocated={200}
        spent={175.80}
        color="#8b5cf6"
      />
      
      <EnvelopeCard
        name="Dining Out"
        icon="🍔"
        allocated={100}
        spent={95.50}
        color="#ef4444"
      />
    </ScrollView>
    </SafeAreaView>
    
  );
}


// StyleSheet documentation: https://reactnative.dev/docs/stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
});
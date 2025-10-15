import { StyleSheet, Text, View } from 'react-native';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Transaction } from '@/types/budget';

interface TransactionRowProps {
  transaction: Transaction;
}

function TransactionRow({ transaction }: TransactionRowProps) {
  const isIncome = transaction.type === 'income';
  const isExpense = transaction.type === 'expense';
  
  // Format date: "2025-10-09" -> "Oct 9"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.description}>{transaction.description}</Text>
        <View style={styles.meta}>
          <Text style={styles.envelope}>{transaction.envelopeName}</Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>
      
      <Text style={[
        styles.amount,
        isIncome && styles.incomeAmount,
        isExpense && styles.expenseAmount,
      ]}>
        {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  left: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
  },
  envelope: {
    fontSize: 14,
    color: '#6b7280',
  },
  date: {
    fontSize: 14,
    color: '#9ca3af',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#10b981',
  },
  expenseAmount: {
    color: '#ef4444',
  },
});

export default TransactionRow;
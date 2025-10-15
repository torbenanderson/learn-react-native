import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import TransactionRow from '@/components/budget/TransactionRow';
import type { Transaction } from '@/types/budget';

export default function TransactionsScreen() {
  // Sample data (we'll replace with real data in Lesson 10)
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      envelopeId: 'env1',
      envelopeName: 'Groceries',
      description: 'Whole Foods',
      amount: -85.43,
      date: '2025-10-09',
      type: 'expense',
      createdAt: '2025-10-09',
      updatedAt: '2025-10-09',
    },
    {
      id: '2',
      envelopeId: 'env2',
      envelopeName: 'Gas',
      description: 'Shell Gas Station',
      amount: -45.00,
      date: '2025-10-09',
      type: 'expense',
      createdAt: '2025-10-09',
      updatedAt: '2025-10-09',
    },
    {
      id: '3',
      envelopeId: 'env3',
      envelopeName: 'Entertainment',
      description: 'Movie Theater',
      amount: -32.50,
      date: '2025-10-08',
      type: 'expense',
      createdAt: '2025-10-08',
      updatedAt: '2025-10-08',
    },
    {
      id: '4',
      envelopeId: 'env1',
      envelopeName: 'Groceries',
      description: 'Trader Joes',
      amount: -52.18,
      date: '2025-10-07',
      type: 'expense',
      createdAt: '2025-10-07',
      updatedAt: '2025-10-07',
    },
    {
      id: '5',
      envelopeId: 'env4',
      envelopeName: 'Income',
      description: 'Paycheck',
      amount: 2500.00,
      date: '2025-10-01',
      type: 'income',
      createdAt: '2025-10-01',
      updatedAt: '2025-10-01',
    },
  ]);
  
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  // Filter transactions
  const filteredTransactions = filter === 'all' 
    ? transactions
    : transactions.filter(t => t.type === filter);
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );
  
  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryValue, styles.income]}>
            ${totalIncome.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryValue, styles.expense]}>
            ${totalExpenses.toFixed(2)}
          </Text>
        </View>
      </View>
      
      {/* Filter Buttons */}
      <View style={styles.filters}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'income' && styles.filterButtonActive]}
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.filterTextActive]}>
            Income
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'expense' && styles.filterButtonActive]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.filterTextActive]}>
            Expenses
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TransactionRow transaction={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  summary: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  income: {
    color: '#10b981',
  },
  expense: {
    color: '#ef4444',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    padding: 20,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});
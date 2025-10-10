# Lesson 04: Lists and Keys - Display List of Envelopes and Transactions

## 📚 Theory

### Rendering Lists in React Native

In React Native, you render lists by using JavaScript's `.map()` function to transform an array of data into an array of components.

```typescript
const fruits = ["Apple", "Banana", "Orange"];

// Transform array of strings into array of Text components
const fruitList = fruits.map((fruit) => (
  <Text key={fruit}>{fruit}</Text>
));
```

### The .map() Function

`.map()` creates a new array by applying a function to each element:

```typescript
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2);
// Result: [2, 4, 6]

const names = ["Alice", "Bob"];
const greetings = names.map(name => `Hello, ${name}!`);
// Result: ["Hello, Alice!", "Hello, Bob!"]
```

**In React Native:**
```typescript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

return (
  <View>
    {users.map(user => (
      <Text key={user.id}>{user.name}</Text>
    ))}
  </View>
);
```

### Why Keys Are Important

Keys help React identify which items have changed, been added, or removed. This makes updates efficient.

```typescript
// ✅ Good - using unique ID as key
{items.map(item => (
  <View key={item.id}>
    <Text>{item.name}</Text>
  </View>
))}

// ❌ Bad - using index as key (avoid if list can change)
{items.map((item, index) => (
  <View key={index}>
    <Text>{item.name}</Text>
  </View>
))}

// ❌ Very Bad - no key
{items.map(item => (
  <View>
    <Text>{item.name}</Text>
  </View>
))}
```

**Key Rules:**
1. Keys must be unique among siblings
2. Keys should be stable (don't change between renders)
3. Don't use random values or indexes (if list reorders/filters)
4. Best practice: Use database IDs or UUIDs

### FlatList for Performance

For long lists, use `FlatList` instead of `.map()`. It only renders visible items:

```typescript
import { FlatList } from 'react-native';

<FlatList
  data={items}
  renderItem={({ item }) => <Text>{item.name}</Text>}
  keyExtractor={item => item.id}
/>
```

**When to use what:**
- **Few items** (< 20): Use `.map()`
- **Many items** (20+): Use `FlatList`
- **Sections**: Use `SectionList`

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Render dynamic lists with .map()
- ✅ Understand the importance of keys
- ✅ Use FlatList for performance
- ✅ Build a transaction history list
- ✅ Display arrays of envelopes
- ✅ Filter and sort list data

## 📖 Book Reference

**"React Native in Action" - Chapter 4: Working with Lists**
- Section 4.1: Rendering lists with .map()
- Section 4.2: Understanding keys
- Section 4.3: FlatList component
- Section 4.4: Performance optimization

## 💻 Code Examples

### Example 1: Simple List with .map()

```typescript
import { View, Text } from 'react-native';

function GroceryList() {
  const items = ["Apples", "Bananas", "Milk", "Bread"];
  
  return (
    <View>
      {items.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </View>
  );
}
```

### Example 2: List with Objects

```typescript
interface Envelope {
  id: string;
  name: string;
  amount: number;
}

function EnvelopeList() {
  const envelopes: Envelope[] = [
    { id: '1', name: 'Groceries', amount: 500 },
    { id: '2', name: 'Rent', amount: 1200 },
    { id: '3', name: 'Gas', amount: 150 },
  ];
  
  return (
    <View>
      {envelopes.map(envelope => (
        <View key={envelope.id}>
          <Text>{envelope.name}: ${envelope.amount}</Text>
        </View>
      ))}
    </View>
  );
}
```

### Example 3: Using FlatList

```typescript
import { FlatList, Text } from 'react-native';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

function TransactionList() {
  const transactions: Transaction[] = [
    { id: '1', description: 'Grocery Store', amount: -45.50, date: '2025-10-09' },
    { id: '2', description: 'Gas Station', amount: -30.00, date: '2025-10-08' },
    { id: '3', description: 'Paycheck', amount: 2000.00, date: '2025-10-01' },
  ];
  
  return (
    <FlatList
      data={transactions}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text>{item.description}</Text>
          <Text>${Math.abs(item.amount)}</Text>
          <Text>{item.date}</Text>
        </View>
      )}
    />
  );
}
```

### Example 4: Empty State

```typescript
function EnvelopeList({ envelopes }) {
  if (envelopes.length === 0) {
    return (
      <View>
        <Text>No envelopes yet.</Text>
        <Text>Create your first envelope to get started!</Text>
      </View>
    );
  }
  
  return (
    <View>
      {envelopes.map(envelope => (
        <EnvelopeCard key={envelope.id} {...envelope} />
      ))}
    </View>
  );
}
```

## 🛠️ Hands-On Exercise

### Goal: Build a Transaction History Screen

Let's create a screen that displays a list of transactions with filtering capabilities!

**Step 1: Create Transaction Interface**

Create `/Users/torbenanderson/development/projects/learn-react-native/types/budget.ts`:

```typescript
export interface Envelope {
  id: string;
  name: string;
  icon: string;
  color: string;
  allocated: number;
  spent: number;
}

export interface Transaction {
  id: string;
  envelopeId: string;
  envelopeName: string;
  description: string;
  amount: number;
  date: string; // ISO date string
  type: 'expense' | 'income' | 'transfer';
}
```

**Step 2: Create TransactionRow Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/budget/TransactionRow.tsx`:

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '@/types/budget';

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
```

**Step 3: Create Transaction List Screen**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/transactions.tsx`:

If this file doesn't exist yet, create it:

```typescript
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import TransactionRow from '@/components/budget/TransactionRow';
import { Transaction } from '@/types/budget';

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
    },
    {
      id: '2',
      envelopeId: 'env2',
      envelopeName: 'Gas',
      description: 'Shell Gas Station',
      amount: -45.00,
      date: '2025-10-09',
      type: 'expense',
    },
    {
      id: '3',
      envelopeId: 'env3',
      envelopeName: 'Entertainment',
      description: 'Movie Theater',
      amount: -32.50,
      date: '2025-10-08',
      type: 'expense',
    },
    {
      id: '4',
      envelopeId: 'env1',
      envelopeName: 'Groceries',
      description: 'Trader Joes',
      amount: -52.18,
      date: '2025-10-07',
      type: 'expense',
    },
    {
      id: '5',
      envelopeId: 'env4',
      envelopeName: 'Income',
      description: 'Paycheck',
      amount: 2500.00,
      date: '2025-10-01',
      type: 'income',
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
```

**Step 4: Update Tab Navigation**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/_layout.tsx` to add the transactions tab. Find the Tabs component and add:

```typescript
<Tabs.Screen
  name="transactions"
  options={{
    title: 'Transactions',
    tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
  }}
/>
```

**Step 5: Run and Test**

```bash
npm start
```

Navigate to the Transactions tab and test the filter buttons!

## ✅ Checkpoint

### What You Should See
- A summary showing total income and expenses
- Filter buttons (All, Income, Expenses)
- A list of transactions with:
  - Description, envelope, and date
  - Amount (green for income, red for expenses)
- Clicking filters changes the displayed transactions

### Can You Answer These?
1. Why do we need keys in lists?
2. What does .map() do?
3. When should you use FlatList instead of .map()?
4. How do you filter an array?
5. What is the purpose of ListEmptyComponent?

### Common Issues

**Issue**: "Each child in a list should have a unique 'key' prop"
- **Solution**: Add `key={item.id}` to your mapped elements

**Issue**: FlatList not scrolling
- **Solution**: Make sure parent View has `flex: 1`

**Issue**: Filter not working
- **Solution**: Check that filter state is being used in the filter function

## 🚀 Next Steps

### Preview of Lesson 05: Styling in React Native
In the next lesson, you'll learn how to:
- Use StyleSheet for organized styling
- Create responsive layouts with Flexbox
- Apply platform-specific styles
- Build a professional-looking budget UI
- Use colors, fonts, and spacing effectively

### Optional Challenges
1. **Sort by date**: Add a sort function to show newest transactions first
2. **Search**: Add a search input to filter by description
3. **Group by date**: Group transactions by day with headers
4. **Swipe to delete**: Add swipe gesture to delete transactions (we'll learn gestures in Lesson 16!)
5. **Pagination**: Load more transactions as user scrolls

**Example Challenge Solution (Sort by Date):**
```typescript
const sortedTransactions = [...filteredTransactions].sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

// Then use sortedTransactions in your FlatList
```

### Key Takeaways
- ✅ Use .map() to render arrays as components
- ✅ Keys help React identify which items changed
- ✅ FlatList is more performant for long lists
- ✅ Filter and sort data before rendering
- ✅ Always handle empty states
- ✅ ListEmptyComponent shows UI when list is empty

**Fantastic work completing Lesson 04!** You can now display dynamic lists efficiently. Tomorrow, we'll make everything look beautiful with advanced styling!

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐⭐⭐☆☆ Intermediate
**Previous lesson**: [03-state-with-usestate.md](./03-state-with-usestate.md)
**Next lesson**: [05-styling-in-react-native.md](./05-styling-in-react-native.md)


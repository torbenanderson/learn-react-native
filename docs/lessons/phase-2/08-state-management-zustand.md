# Lesson 08: State Management with Zustand - Global Budget State

## 📚 Theory

### Why Global State Management?

**The Problem with Local State:**
As your app grows, you'll face these challenges with `useState`:

```typescript
// ❌ Problem: Data scattered across components
function HomeScreen() {
  const [envelopes, setEnvelopes] = useState([]);
  // How do other screens access this data?
}

function EnvelopeScreen() {
  const [envelopes, setEnvelopes] = useState([]);
  // Duplicate state! How do we keep them in sync?
}

function TransactionScreen() {
  const [envelopes, setEnvelopes] = useState([]);
  // More duplicate state! This is getting messy...
}
```

**The Solution: Global State**
Store data in one place that all components can access:

```typescript
// ✅ Solution: One source of truth
const useBudgetStore = create((set) => ({
  envelopes: [],
  addEnvelope: (envelope) => set((state) => ({ 
    envelopes: [...state.envelopes, envelope] 
  })),
}));

// Any component can access the same data
function HomeScreen() {
  const { envelopes, addEnvelope } = useBudgetStore();
}

function EnvelopeScreen() {
  const { envelopes, addEnvelope } = useBudgetStore();
  // Same data, automatically synced!
}
```

### What is Zustand?

**Zustand** (German for "state") is a lightweight state management library that's perfect for React Native.

**Why Zustand over Redux?**
- **Simpler**: Less boilerplate code
- **TypeScript-friendly**: Great type inference
- **Small**: Only 2.9kb gzipped
- **No providers**: No need to wrap your app
- **DevTools**: Built-in debugging support

**Core Concepts:**
1. **Store**: A single object containing all your state
2. **Actions**: Functions that modify the state
3. **Selectors**: Functions that extract specific data
4. **Subscriptions**: Components automatically re-render when state changes

### Understanding the Store Pattern

**Think of a store like a global variable that:**
- Stores data (like a database)
- Provides methods to change data (like API functions)
- Notifies components when data changes (like event listeners)

```typescript
// Traditional approach - data scattered
const envelopes = []; // In HomeScreen
const transactions = []; // In TransactionScreen
const user = {}; // In ProfileScreen

// Zustand approach - everything in one place
const useAppStore = create((set) => ({
  // All your data
  envelopes: [],
  transactions: [],
  user: {},
  
  // All your actions
  addEnvelope: (envelope) => set((state) => ({ 
    envelopes: [...state.envelopes, envelope] 
  })),
  addTransaction: (transaction) => set((state) => ({ 
    transactions: [...state.transactions, transaction] 
  })),
  updateUser: (userData) => set({ user: userData }),
}));
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand when to use global state vs local state
- ✅ Set up Zustand in your React Native app
- ✅ Create a budget store with envelopes and transactions
- ✅ Use the store in multiple components
- ✅ Handle async operations with Zustand
- ✅ Persist state to device storage

## 📖 Book Reference

**"React Native in Action" - Chapter 8: State Management**
- Section 8.1: When to use global state
- Section 8.2: Introduction to Zustand
- Section 8.3: Creating stores and actions
- Section 8.4: Persisting state

## 💻 Code Examples

### Example 1: Basic Zustand Store

```typescript
import { create } from 'zustand';

interface Envelope {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

interface BudgetStore {
  envelopes: Envelope[];
  addEnvelope: (envelope: Omit<Envelope, 'id'>) => void;
  updateEnvelope: (id: string, updates: Partial<Envelope>) => void;
  deleteEnvelope: (id: string) => void;
}

const useBudgetStore = create<BudgetStore>((set) => ({
  envelopes: [],
  
  addEnvelope: (envelope) => set((state) => ({
    envelopes: [...state.envelopes, { ...envelope, id: Date.now().toString() }]
  })),
  
  updateEnvelope: (id, updates) => set((state) => ({
    envelopes: state.envelopes.map(env => 
      env.id === id ? { ...env, ...updates } : env
    )
  })),
  
  deleteEnvelope: (id) => set((state) => ({
    envelopes: state.envelopes.filter(env => env.id !== id)
  })),
}));

export default useBudgetStore;
```

### Example 2: Using the Store in Components

```typescript
import { View, Text, Button } from 'react-native';
import useBudgetStore from '@/stores/budgetStore';

function EnvelopeList() {
  const { envelopes, addEnvelope, deleteEnvelope } = useBudgetStore();
  
  const handleAddEnvelope = () => {
    addEnvelope({
      name: 'New Envelope',
      allocated: 100,
      spent: 0,
    });
  };
  
  return (
    <View>
      {envelopes.map(envelope => (
        <View key={envelope.id}>
          <Text>{envelope.name}: ${envelope.allocated}</Text>
          <Button 
            title="Delete" 
            onPress={() => deleteEnvelope(envelope.id)} 
          />
        </View>
      ))}
      <Button title="Add Envelope" onPress={handleAddEnvelope} />
    </View>
  );
}
```

### Example 3: Selectors for Performance

```typescript
// Select only what you need to avoid unnecessary re-renders
function EnvelopeSummary() {
  // This component only re-renders when envelopes change
  const envelopes = useBudgetStore(state => state.envelopes);
  
  const totalAllocated = envelopes.reduce((sum, env) => sum + env.allocated, 0);
  const totalSpent = envelopes.reduce((sum, env) => sum + env.spent, 0);
  
  return (
    <View>
      <Text>Total Allocated: ${totalAllocated}</Text>
      <Text>Total Spent: ${totalSpent}</Text>
    </View>
  );
}

// This component only re-renders when addEnvelope changes
function AddEnvelopeButton() {
  const addEnvelope = useBudgetStore(state => state.addEnvelope);
  
  return (
    <Button 
      title="Add Envelope" 
      onPress={() => addEnvelope({ name: 'New', allocated: 100, spent: 0 })} 
    />
  );
}
```

### Example 4: Async Actions

```typescript
interface BudgetStore {
  envelopes: Envelope[];
  loading: boolean;
  error: string | null;
  fetchEnvelopes: () => Promise<void>;
  addEnvelope: (envelope: Omit<Envelope, 'id'>) => Promise<void>;
}

const useBudgetStore = create<BudgetStore>((set, get) => ({
  envelopes: [],
  loading: false,
  error: null,
  
  fetchEnvelopes: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      const response = await fetch('/api/envelopes');
      const envelopes = await response.json();
      set({ envelopes, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  addEnvelope: async (envelope) => {
    set({ loading: true });
    try {
      const response = await fetch('/api/envelopes', {
        method: 'POST',
        body: JSON.stringify(envelope),
      });
      const newEnvelope = await response.json();
      
      set((state) => ({
        envelopes: [...state.envelopes, newEnvelope],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## 🛠️ Hands-On Exercise

### Goal: Create a Global Budget Store

Let's replace our local state with a global Zustand store!

**Step 1: Install Zustand**

```bash
npm install zustand
```

**Step 2: Create the Budget Store**

Create `/Users/torbenanderson/development/projects/learn-react-native/stores/budgetStore.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Envelope {
  id: string;
  name: string;
  icon: string;
  color: string;
  allocated: number;
  spent: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  envelopeId: string;
  description: string;
  amount: number;
  date: string;
  type: 'expense' | 'income' | 'transfer';
}

interface BudgetStore {
  // State
  envelopes: Envelope[];
  transactions: Transaction[];
  totalIncome: number;
  loading: boolean;
  error: string | null;
  
  // Envelope actions
  addEnvelope: (envelope: Omit<Envelope, 'id' | 'createdAt'>) => void;
  updateEnvelope: (id: string, updates: Partial<Envelope>) => void;
  deleteEnvelope: (id: string) => void;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Computed values
  getTotalAllocated: () => number;
  getTotalSpent: () => number;
  getUnallocatedFunds: () => number;
  getEnvelopeById: (id: string) => Envelope | undefined;
  getTransactionsByEnvelope: (envelopeId: string) => Transaction[];
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      envelopes: [],
      transactions: [],
      totalIncome: 3000,
      loading: false,
      error: null,
      
      // Envelope actions
      addEnvelope: (envelope) => set((state) => ({
        envelopes: [...state.envelopes, {
          ...envelope,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }]
      })),
      
      updateEnvelope: (id, updates) => set((state) => ({
        envelopes: state.envelopes.map(env => 
          env.id === id ? { ...env, ...updates } : env
        )
      })),
      
      deleteEnvelope: (id) => set((state) => ({
        envelopes: state.envelopes.filter(env => env.id !== id),
        transactions: state.transactions.filter(t => t.envelopeId !== id),
      })),
      
      // Transaction actions
      addTransaction: (transaction) => set((state) => {
        const newTransaction = {
          ...transaction,
          id: Date.now().toString(),
        };
        
        // Update envelope spent amount
        const updatedEnvelopes = state.envelopes.map(env => {
          if (env.id === transaction.envelopeId) {
            const amount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
            return { ...env, spent: env.spent + Math.abs(amount) };
          }
          return env;
        });
        
        return {
          transactions: [...state.transactions, newTransaction],
          envelopes: updatedEnvelopes,
        };
      }),
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      
      deleteTransaction: (id) => set((state) => {
        const transaction = state.transactions.find(t => t.id === id);
        if (!transaction) return state;
        
        // Update envelope spent amount
        const updatedEnvelopes = state.envelopes.map(env => {
          if (env.id === transaction.envelopeId) {
            const amount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
            return { ...env, spent: env.spent - Math.abs(amount) };
          }
          return env;
        });
        
        return {
          transactions: state.transactions.filter(t => t.id !== id),
          envelopes: updatedEnvelopes,
        };
      }),
      
      // Computed values
      getTotalAllocated: () => {
        const state = get();
        return state.envelopes.reduce((sum, env) => sum + env.allocated, 0);
      },
      
      getTotalSpent: () => {
        const state = get();
        return state.envelopes.reduce((sum, env) => sum + env.spent, 0);
      },
      
      getUnallocatedFunds: () => {
        const state = get();
        return state.totalIncome - state.getTotalAllocated();
      },
      
      getEnvelopeById: (id) => {
        const state = get();
        return state.envelopes.find(env => env.id === id);
      },
      
      getTransactionsByEnvelope: (envelopeId) => {
        const state = get();
        return state.transactions.filter(t => t.envelopeId === envelopeId);
      },
      
      // Utility actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      resetStore: () => set({
        envelopes: [],
        transactions: [],
        totalIncome: 3000,
        loading: false,
        error: null,
      }),
    }),
    {
      name: 'budget-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        envelopes: state.envelopes,
        transactions: state.transactions,
        totalIncome: state.totalIncome,
      }), // only persist these fields
    }
  )
);

export default useBudgetStore;
```

**Step 3: Update Components to Use the Store**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx`:

```typescript
import { ScrollView, StyleSheet } from 'react-native';
import BudgetSummary from '@/components/budget/BudgetSummary';
import AllocateFunds from '@/components/budget/AllocateFunds';
import EnvelopeCard from '@/components/budget/EnvelopeCard';
import { useBudgetStore } from '@/stores/budgetStore';
import { Colors } from '@/constants/Design';

export default function HomeScreen() {
  const { 
    envelopes, 
    getTotalAllocated, 
    getTotalSpent, 
    totalIncome 
  } = useBudgetStore();
  
  const totalAllocated = getTotalAllocated();
  const totalSpent = getTotalSpent();
  
  return (
    <ScrollView style={styles.container}>
      <BudgetSummary
        totalIncome={totalIncome}
        totalAllocated={totalAllocated}
        totalSpent={totalSpent}
      />
      
      <AllocateFunds />
      
      {envelopes.map(envelope => (
        <EnvelopeCard
          key={envelope.id}
          id={envelope.id}
          name={envelope.name}
          icon={envelope.icon}
          allocated={envelope.allocated}
          spent={envelope.spent}
          color={envelope.color}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
```

**Step 4: Update AllocateFunds Component**

Update `/Users/torbenanderson/development/projects/learn-react-native/components/budget/AllocateFunds.tsx`:

```typescript
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useBudgetStore } from '@/stores/budgetStore';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';

function AllocateFunds() {
  const [envelopeName, setEnvelopeName] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  
  const { 
    addEnvelope, 
    getUnallocatedFunds, 
    envelopes 
  } = useBudgetStore();
  
  const unallocatedFunds = getUnallocatedFunds();
  
  const handleAllocate = () => {
    const amount = parseFloat(allocatedAmount);
    
    if (!envelopeName.trim()) {
      alert("Please enter an envelope name");
      return;
    }
    
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    if (amount > unallocatedFunds) {
      alert("Not enough unallocated funds!");
      return;
    }
    
    addEnvelope({
      name: envelopeName,
      icon: '📁',
      color: '#3b82f6',
      allocated: amount,
      spent: 0,
    });
    
    setEnvelopeName("");
    setAllocatedAmount("");
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allocate Funds</Text>
      
      <View style={styles.fundsCard}>
        <Text style={styles.fundsLabel}>Unallocated Funds</Text>
        <Text style={styles.fundsAmount}>${unallocatedFunds.toFixed(2)}</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Envelope Name</Text>
        <TextInput
          style={styles.input}
          value={envelopeName}
          onChangeText={setEnvelopeName}
          placeholder="e.g., Groceries"
        />
        
        <Text style={styles.label}>Amount to Allocate</Text>
        <TextInput
          style={styles.input}
          value={allocatedAmount}
          onChangeText={setAllocatedAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleAllocate}
        >
          <Text style={styles.buttonText}>Allocate Funds</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... styles remain the same
```

**Step 5: Test the Global State**

```bash
npm start
```

Try adding envelopes and see how they persist across app restarts!

## ✅ Checkpoint

### What You Should See
- Envelopes persist when you restart the app
- All components share the same data
- Adding an envelope updates all screens immediately
- Data is automatically saved to device storage

### Can You Answer These?
1. When should you use global state vs local state?
2. What are the benefits of Zustand over Redux?
3. How do selectors improve performance?
4. What is the purpose of the `persist` middleware?
5. How do you handle async operations in Zustand?

### Common Issues

**Issue**: "Cannot find module 'zustand'"
- **Solution**: Run `npm install zustand`

**Issue**: State not persisting
- **Solution**: Check that you're using the `persist` middleware correctly

**Issue**: Components not updating
- **Solution**: Make sure you're using the store hook in your components

## 🚀 Next Steps

### Preview of Lesson 09: AsyncStorage and Data Persistence
In the next lesson, you'll learn how to:
- Use AsyncStorage for complex data persistence
- Handle data migration and versioning
- Implement offline-first data strategies
- Sync data with remote APIs
- Handle network errors gracefully

### Key Takeaways
- ✅ Global state solves data sharing problems
- ✅ Zustand is simpler than Redux
- ✅ Use selectors for performance optimization
- ✅ Persist middleware saves data automatically
- ✅ Actions can be async and handle errors
- ✅ Computed values keep data consistent

**Excellent work completing Lesson 08!** You now have a robust global state management system. Tomorrow, we'll dive deeper into data persistence!

---

**Time to complete**: ~2-3 hours
**Difficulty**: ⭐⭐⭐⭐☆ Advanced
**Previous lesson**: [07-forms-and-input-handling.md](./07-forms-and-input-handling.md)
**Next lesson**: [09-asyncstorage-data-persistence.md](./09-asyncstorage-data-persistence.md)

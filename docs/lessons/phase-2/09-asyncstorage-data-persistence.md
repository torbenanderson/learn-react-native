# Lesson 09: AsyncStorage and Data Persistence - Save Your Budget Data

## 📚 Theory

### Why Data Persistence Matters

**The Problem:**
Without persistence, your app data disappears when:
- User closes the app
- Phone restarts
- App is killed by the system
- User switches to another app

```typescript
// ❌ Data lost on app restart
const [envelopes, setEnvelopes] = useState([]);
// User adds envelopes, closes app, reopens → all data gone!
```

**The Solution:**
Save data to the device's storage so it survives app restarts:

```typescript
// ✅ Data persists across app restarts
const [envelopes, setEnvelopes] = useState([]);

useEffect(() => {
  // Load data when app starts
  loadEnvelopes();
}, []);

const saveEnvelopes = async (newEnvelopes) => {
  await AsyncStorage.setItem('envelopes', JSON.stringify(newEnvelopes));
  setEnvelopes(newEnvelopes);
};
```

### What is AsyncStorage?

**AsyncStorage** is React Native's equivalent to `localStorage` in web browsers. It provides a simple, asynchronous, persistent, key-value storage system.

**Key Features:**
- **Asynchronous**: Won't block the UI thread
- **Persistent**: Data survives app restarts
- **Key-value**: Store data with string keys
- **Cross-platform**: Works on iOS and Android
- **Large capacity**: Can store several MB of data

**Storage Locations:**
- **iOS**: Documents directory (backed up to iCloud)
- **Android**: Internal storage (app-specific)
- **Web**: localStorage (if using Expo Web)

### Understanding Async vs Sync Operations

**Why Async?**
Storage operations can be slow (especially with large data), so they run asynchronously to avoid freezing the UI:

```typescript
// ❌ This would freeze the UI
const data = AsyncStorage.getItem('envelopes'); // Blocks UI
console.log(data); // undefined! (not loaded yet)

// ✅ This keeps UI responsive
const data = await AsyncStorage.getItem('envelopes'); // Non-blocking
console.log(data); // actual data
```

**The Async Pattern:**
```typescript
// 1. Start operation
const promise = AsyncStorage.getItem('envelopes');

// 2. Wait for completion
const data = await promise;

// 3. Use the data
console.log(data);
```

### Data Serialization

**The Problem:**
AsyncStorage only stores strings, but we want to store objects:

```typescript
// ❌ This won't work
const envelope = { name: 'Groceries', amount: 500 };
await AsyncStorage.setItem('envelope', envelope); // Error!

// ✅ Convert to string first
await AsyncStorage.setItem('envelope', JSON.stringify(envelope));

// ✅ Convert back to object when reading
const data = await AsyncStorage.getItem('envelope');
const envelope = JSON.parse(data);
```

**Serialization Process:**
```
Object → JSON.stringify() → String → AsyncStorage
AsyncStorage → String → JSON.parse() → Object
```

### Error Handling

**Storage operations can fail:**
- Device storage full
- Permission denied
- Corrupted data
- Network issues (for cloud sync)

```typescript
try {
  const data = await AsyncStorage.getItem('envelopes');
  if (data) {
    setEnvelopes(JSON.parse(data));
  }
} catch (error) {
  console.error('Failed to load envelopes:', error);
  // Show user-friendly error message
  Alert.alert('Error', 'Failed to load your data. Please try again.');
}
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand when and why to use AsyncStorage
- ✅ Save and load data from device storage
- ✅ Handle serialization and deserialization
- ✅ Implement proper error handling
- ✅ Create data migration strategies
- ✅ Build offline-first data patterns

## 📖 Book Reference

**"React Native in Action" - Chapter 9: Data Persistence**
- Section 9.1: AsyncStorage basics
- Section 9.2: Data serialization
- Section 9.3: Error handling and recovery
- Section 9.4: Data migration strategies

## 💻 Code Examples

### Example 1: Basic AsyncStorage Usage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
const saveData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Load data
const loadData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

// Usage
const envelope = { name: 'Groceries', amount: 500 };
await saveData('envelope', envelope);
const loadedEnvelope = await loadData('envelope');
```

### Example 2: Data Persistence Hook

```typescript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever state changes
  useEffect(() => {
    if (!loading) {
      saveData();
    }
  }, [state]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        setState(JSON.parse(data));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(state));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return [state, setState, loading, error] as const;
}

// Usage
function EnvelopeList() {
  const [envelopes, setEnvelopes, loading, error] = usePersistedState('envelopes', []);
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  
  return (
    <View>
      {envelopes.map(envelope => (
        <Text key={envelope.id}>{envelope.name}</Text>
      ))}
    </View>
  );
}
```

### Example 3: Data Migration

```typescript
interface DataVersion {
  version: number;
  data: any;
}

const CURRENT_VERSION = 2;

const migrateData = (storedData: any): any => {
  // If no version, assume version 1
  if (!storedData.version) {
    return migrateFromV1ToV2(storedData);
  }
  
  let data = storedData.data;
  let version = storedData.version;
  
  // Apply migrations in sequence
  while (version < CURRENT_VERSION) {
    switch (version) {
      case 1:
        data = migrateFromV1ToV2(data);
        version = 2;
        break;
      // Add more migrations as needed
    }
  }
  
  return data;
};

const migrateFromV1ToV2 = (data: any) => {
  // Example: Add createdAt field to all envelopes
  return {
    ...data,
    envelopes: data.envelopes.map((env: any) => ({
      ...env,
      createdAt: new Date().toISOString(),
    })),
  };
};

const loadWithMigration = async (key: string) => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    if (!storedData) return null;
    
    const parsed = JSON.parse(storedData);
    const migratedData = migrateData(parsed);
    
    // Save migrated data
    await AsyncStorage.setItem(key, JSON.stringify({
      version: CURRENT_VERSION,
      data: migratedData,
    }));
    
    return migratedData;
  } catch (error) {
    console.error('Migration failed:', error);
    return null;
  }
};
```

### Example 4: Batch Operations

```typescript
const batchSave = async (operations: Array<{key: string, value: any}>) => {
  try {
    const multiSet = operations.map(({ key, value }) => [
      key,
      JSON.stringify(value)
    ]);
    
    await AsyncStorage.multiSet(multiSet);
    console.log('Batch save successful');
  } catch (error) {
    console.error('Batch save failed:', error);
  }
};

const batchLoad = async (keys: string[]) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    return values.reduce((acc, [key, value]) => {
      acc[key] = value ? JSON.parse(value) : null;
      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('Batch load failed:', error);
    return {};
  }
};

// Usage
await batchSave([
  { key: 'envelopes', value: envelopes },
  { key: 'transactions', value: transactions },
  { key: 'settings', value: settings },
]);

const data = await batchLoad(['envelopes', 'transactions', 'settings']);
```

## 🛠️ Hands-On Exercise

### Goal: Add Data Persistence to Your Budget App

Let's enhance our Zustand store with proper AsyncStorage persistence!

**Step 1: Install AsyncStorage**

```bash
npm install @react-native-async-storage/async-storage
```

**Step 2: Create a Data Service**

Create `/Users/torbenanderson/development/projects/learn-react-native/services/storageService.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredData {
  version: number;
  envelopes: any[];
  transactions: any[];
  totalIncome: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'budget_app_data';
const CURRENT_VERSION = 1;

export class StorageService {
  static async saveData(data: Omit<StoredData, 'version' | 'lastUpdated'>): Promise<void> {
    try {
      const dataToStore: StoredData = {
        ...data,
        version: CURRENT_VERSION,
        lastUpdated: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data');
    }
  }

  static async loadData(): Promise<StoredData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const parsed: StoredData = JSON.parse(data);
      
      // Handle data migration if needed
      if (parsed.version < CURRENT_VERSION) {
        return this.migrateData(parsed);
      }
      
      return parsed;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  static async clearData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  }

  static async getStorageInfo(): Promise<{used: number, available: number}> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);
      
      const used = data.reduce((total, [key, value]) => {
        return total + (key.length + (value?.length || 0));
      }, 0);
      
      return {
        used,
        available: 6 * 1024 * 1024 - used, // Assume 6MB limit
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0 };
    }
  }

  private static migrateData(data: StoredData): StoredData {
    // Add migration logic here as your data structure evolves
    return data;
  }
}
```

**Step 3: Update the Budget Store**

Update `/Users/torbenanderson/development/projects/learn-react-native/stores/budgetStore.ts`:

```typescript
import { create } from 'zustand';
import { StorageService } from '@/services/storageService';

// ... existing interfaces ...

const useBudgetStore = create<BudgetStore>((set, get) => ({
  // ... existing state ...

  // Add persistence actions
  loadFromStorage: async () => {
    set({ loading: true, error: null });
    try {
      const data = await StorageService.loadData();
      if (data) {
        set({
          envelopes: data.envelopes,
          transactions: data.transactions,
          totalIncome: data.totalIncome,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  saveToStorage: async () => {
    const state = get();
    try {
      await StorageService.saveData({
        envelopes: state.envelopes,
        transactions: state.transactions,
        totalIncome: state.totalIncome,
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  clearStorage: async () => {
    try {
      await StorageService.clearData();
      set({
        envelopes: [],
        transactions: [],
        totalIncome: 3000,
        error: null,
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Update existing actions to auto-save
  addEnvelope: (envelope) => {
    set((state) => {
      const newState = {
        envelopes: [...state.envelopes, {
          ...envelope,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }]
      };
      
      // Auto-save after state update
      setTimeout(() => {
        get().saveToStorage();
      }, 0);
      
      return newState;
    });
  },

  // ... update other actions similarly ...
}));
```

**Step 4: Add Loading and Error States**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/LoadingScreen.tsx`:

```typescript
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/Design';

interface LoadingScreenProps {
  message?: string;
}

function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
});

export default LoadingScreen;
```

**Step 5: Update App to Load Data on Startup**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/_layout.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useBudgetStore } from '@/stores/budgetStore';
import LoadingScreen from '@/components/LoadingScreen';

export default function RootLayout() {
  const { loadFromStorage, loading, error } = useBudgetStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await loadFromStorage();
      setIsInitialized(true);
    };
    
    initializeApp();
  }, []);

  if (!isInitialized || loading) {
    return <LoadingScreen message="Loading your budget data..." />;
  }

  if (error) {
    return <LoadingScreen message={`Error: ${error}`} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

**Step 6: Add Data Management Screen**

Create `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/data.tsx`:

```typescript
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useBudgetStore } from '@/stores/budgetStore';
import { StorageService } from '@/services/storageService';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';

export default function DataScreen() {
  const { clearStorage, envelopes, transactions } = useBudgetStore();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your budget data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await clearStorage();
            Alert.alert('Success', 'All data has been cleared');
          }
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const data = await StorageService.loadData();
      if (data) {
        // In a real app, you'd implement actual export functionality
        Alert.alert('Export', 'Data export feature coming soon!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Management</Text>
      
      <View style={styles.stats}>
        <Text style={styles.statText}>
          Envelopes: {envelopes.length}
        </Text>
        <Text style={styles.statText}>
          Transactions: {transactions.length}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.exportButton]}
          onPress={handleExportData}
        >
          <Text style={styles.buttonText}>Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.clearButton]}
          onPress={handleClearData}
        >
          <Text style={styles.buttonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  stats: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  statText: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  actions: {
    gap: Spacing.md,
  },
  button: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: Colors.primary,
  },
  clearButton: {
    backgroundColor: Colors.error,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});
```

**Step 7: Test Data Persistence**

```bash
npm start
```

1. Add some envelopes
2. Close the app completely
3. Reopen the app
4. Verify your data is still there!

## ✅ Checkpoint

### What You Should See
- App shows loading screen on startup
- Data persists across app restarts
- Error handling for storage failures
- Data management screen for clearing/exporting

### Can You Answer These?
1. Why is AsyncStorage asynchronous?
2. What is data serialization and why is it needed?
3. How do you handle storage errors gracefully?
4. What is data migration and when do you need it?
5. How do you implement auto-save functionality?

### Common Issues

**Issue**: "Cannot find module '@react-native-async-storage/async-storage'"
- **Solution**: Run `npm install @react-native-async-storage/async-storage`

**Issue**: Data not persisting
- **Solution**: Check that you're calling the save function after state changes

**Issue**: App crashes on startup
- **Solution**: Add proper error handling in the load function

## 🚀 Next Steps

### Preview of Lesson 10: API Integration and Data Sync
In the next lesson, you'll learn how to:
- Connect to REST APIs
- Handle network requests and responses
- Implement data synchronization
- Handle offline/online states
- Add authentication and security

### Key Takeaways
- ✅ AsyncStorage provides persistent device storage
- ✅ Always handle serialization/deserialization
- ✅ Implement proper error handling
- ✅ Use data migration for app updates
- ✅ Auto-save keeps data current
- ✅ Loading states improve user experience

**Fantastic work completing Lesson 09!** Your app now has robust data persistence. Tomorrow, we'll connect it to the cloud!

---

**Time to complete**: ~2-3 hours
**Difficulty**: ⭐⭐⭐⭐☆ Advanced
**Previous lesson**: [08-state-management-zustand.md](./08-state-management-zustand.md)
**Next lesson**: [10-api-integration-data-sync.md](./10-api-integration-data-sync.md)

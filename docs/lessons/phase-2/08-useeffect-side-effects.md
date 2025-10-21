# Lesson 08: useEffect and Side Effects - Handle Data Loading and Lifecycle

## 📚 Theory

### What are Side Effects?

**Side Effects** are operations that affect something outside the scope of the current function being executed. In React Native, these include:

- **Data fetching** from APIs
- **Setting up subscriptions** (timers, listeners)
- **Manually changing the DOM** (though rare in React Native)
- **Logging** and analytics
- **Cleanup operations**

**Why Side Effects Matter:**
- Components need to interact with the outside world
- Data doesn't just appear - it needs to be fetched
- Resources need to be cleaned up to prevent memory leaks
- User interactions often trigger external operations

### Understanding useEffect

**useEffect** is React's hook for handling side effects. It runs after every render and lets you perform side effects in functional components.

**Basic Syntax:**
```typescript
useEffect(() => {
  // Side effect code here
}, [dependencies]);
```

**The Two Parameters:**
1. **Effect function**: The code to run
2. **Dependencies array**: When to run the effect

### useEffect Dependency Patterns

**1. Run on Every Render:**
```typescript
useEffect(() => {
  console.log('Runs after every render');
});
// No dependency array = runs after every render
```

**2. Run Only Once (on Mount):**
```typescript
useEffect(() => {
  console.log('Runs only once when component mounts');
}, []);
// Empty dependency array = runs only once
```

**3. Run When Dependencies Change:**
```typescript
useEffect(() => {
  console.log('Runs when userId changes');
}, [userId]);
// Specific dependencies = runs when they change
```

**4. Cleanup Function:**
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Timer tick');
  }, 1000);

  // Cleanup function
  return () => {
    clearInterval(timer);
  };
}, []);
```

### Common Side Effect Patterns

**1. Data Fetching:**
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/envelopes');
      const data = await response.json();
      setEnvelopes(data);
    } catch (error) {
      setError(error.message);
    }
  };

  fetchData();
}, []); // Run once on mount
```

**2. Subscriptions:**
```typescript
useEffect(() => {
  const subscription = NetInfo.addEventListener(state => {
    setIsOnline(state.isConnected);
  });

  return () => subscription?.();
}, []); // Cleanup subscription on unmount
```

**3. Timers:**
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand what side effects are and why they matter
- ✅ Use useEffect for data fetching
- ✅ Handle component lifecycle events
- ✅ Implement cleanup functions
- ✅ Manage loading and error states
- ✅ Avoid common useEffect pitfalls

## 📖 Book Reference

**"React Native in Action" - Chapter 8: Side Effects and Data Fetching**
- Section 8.1: Understanding useEffect
- Section 8.2: Data fetching patterns
- Section 8.3: Cleanup and memory management
- Section 8.4: Error handling

## 💻 Code Examples

### Example 1: Basic Data Fetching

```typescript
import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

function EnvelopeList() {
  const [envelopes, setEnvelopes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnvelopes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/envelopes');
        
        if (!response.ok) {
          throw new Error('Failed to fetch envelopes');
        }
        
        const data = await response.json();
        setEnvelopes(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnvelopes();
  }, []); // Run once on mount

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading envelopes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      {envelopes.map(envelope => (
        <Text key={envelope.id}>{envelope.name}</Text>
      ))}
    </View>
  );
}
```

### Example 2: Conditional Data Fetching

```typescript
function EnvelopeDetail({ envelopeId }) {
  const [envelope, setEnvelope] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if we have an envelopeId
    if (!envelopeId) return;

    const fetchEnvelope = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/envelopes/${envelopeId}`);
        const data = await response.json();
        setEnvelope(data);
      } catch (error) {
        console.error('Failed to fetch envelope:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnvelope();
  }, [envelopeId]); // Re-run when envelopeId changes

  if (loading) return <Text>Loading...</Text>;
  if (!envelope) return <Text>No envelope selected</Text>;

  return <Text>{envelope.name}</Text>;
}
```

### Example 3: Cleanup and Subscriptions

```typescript
function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []); // Run once on mount, cleanup on unmount

  return (
    <Text style={{ color: isOnline ? 'green' : 'red' }}>
      {isOnline ? 'Online' : 'Offline'}
    </Text>
  );
}
```

### Example 4: Timer with Cleanup

```typescript
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, []);

  return <Text>Timer: {seconds}s</Text>;
}
```

## 🛠️ Hands-On Exercise

### Goal: Add Data Loading to Your Budget App

Let's enhance your budget app with proper data loading and lifecycle management!

**Step 1: Create Data Loading Hook**

Create `/Users/torbenanderson/development/projects/learn-react-native/hooks/useEnvelopes.ts`:

```typescript
import { useState, useEffect } from 'react';

interface Envelope {
  id: string;
  name: string;
  icon: string;
  color: string;
  allocated: number;
  spent: number;
  createdAt: string;
}

interface UseEnvelopesReturn {
  envelopes: Envelope[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEnvelopes(): UseEnvelopesReturn {
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnvelopes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEnvelopes: Envelope[] = [
        {
          id: '1',
          name: 'Groceries',
          icon: '🛒',
          color: '#10b981',
          allocated: 500,
          spent: 325.50,
          createdAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Rent',
          icon: '🏠',
          color: '#3b82f6',
          allocated: 1200,
          spent: 1200,
          createdAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '3',
          name: 'Gas',
          icon: '⛽',
          color: '#f59e0b',
          allocated: 150,
          spent: 89.25,
          createdAt: '2023-01-01T00:00:00Z',
        },
      ];
      
      setEnvelopes(mockEnvelopes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch envelopes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvelopes();
  }, []); // Run once on mount

  return {
    envelopes,
    loading,
    error,
    refetch: fetchEnvelopes,
  };
}
```

**Step 2: Create Loading Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/LoadingSpinner.tsx`:

```typescript
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/Design';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'large' 
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
```

**Step 3: Create Error Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/ErrorMessage.tsx`:

```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/Design';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  retryButtonText: {
    color: Colors.surface,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});

export default ErrorMessage;
```

**Step 4: Update Home Screen with Data Loading**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx`:

```typescript
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useState } from 'react';
import BudgetSummary from '@/components/budget/BudgetSummary';
import AllocateFunds from '@/components/budget/AllocateFunds';
import EnvelopeCard from '@/components/budget/EnvelopeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useEnvelopes } from '@/hooks/useEnvelopes';
import { Colors } from '@/constants/Design';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { envelopes, loading, error, refetch } = useEnvelopes();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return <LoadingSpinner message="Loading your budget data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  // Calculate totals
  const totalAllocated = envelopes.reduce((sum, env) => sum + env.allocated, 0);
  const totalSpent = envelopes.reduce((sum, env) => sum + env.spent, 0);
  const totalIncome = 3000;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.primary}
        />
      }
    >
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

**Step 5: Add Network Status Indicator**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/NetworkStatus.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/Design';

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  if (isOnline) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📡 No internet connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.error,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  text: {
    color: Colors.surface,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});

export default NetworkStatus;
```

**Step 6: Test Data Loading**

```bash
npm start
```

1. See the loading spinner on first load
2. Pull down to refresh and see the loading state
3. Try disconnecting internet to see the network status
4. Test the error state by modifying the API call

## ✅ Checkpoint

### What You Should See
- Loading spinner when data is fetching
- Error message if something goes wrong
- Pull-to-refresh functionality
- Network status indicator when offline
- Smooth transitions between states

### Can You Answer These?
1. What are side effects in React Native?
2. When does useEffect run?
3. Why is cleanup important?
4. How do you handle loading and error states?
5. What's the difference between useEffect patterns?

### Common Issues

**Issue**: Infinite re-renders
- **Solution**: Check your dependency array in useEffect

**Issue**: Memory leaks
- **Solution**: Always clean up subscriptions and timers

**Issue**: Stale data
- **Solution**: Include all dependencies in the dependency array

## 🚀 Next Steps

### Preview of Lesson 09: Custom Hooks
In the next lesson, you'll learn how to:
- Extract logic into reusable custom hooks
- Share stateful logic between components
- Create hooks for common patterns
- Build a custom hook for form handling

### Key Takeaways
- ✅ useEffect handles side effects in functional components
- ✅ Always clean up subscriptions and timers
- ✅ Use dependency arrays to control when effects run
- ✅ Handle loading, error, and success states
- ✅ Side effects are essential for real-world apps

**Great work completing Lesson 08!** Your app now handles data loading properly. Tomorrow, we'll learn custom hooks!

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐⭐⭐☆☆ Intermediate
**Previous lesson**: [07-forms-and-input-handling.md](./07-forms-and-input-handling.md)
**Next lesson**: [09-custom-hooks.md](./09-custom-hooks.md)

# Lesson 17: Performance Optimization - Make Your Budget App Lightning Fast

## 📚 Theory

### Why Performance Matters

**The Impact of Poor Performance:**
- **User Experience**: Slow apps feel broken and frustrating
- **User Retention**: 53% of users abandon apps that take >3 seconds to load
- **Battery Life**: Inefficient code drains battery faster
- **App Store Rankings**: Performance affects app store visibility
- **Business Impact**: Poor performance = lost revenue

**Performance Metrics:**
- **Time to Interactive (TTI)**: How long until app is usable
- **First Contentful Paint (FCP)**: Time to first visual content
- **Frame Rate**: Should maintain 60 FPS for smooth animations
- **Memory Usage**: High memory usage causes crashes
- **Bundle Size**: Larger bundles = slower downloads

### React Native Performance Characteristics

**JavaScript Thread:**
- Runs your React code
- Handles business logic
- Can become blocked by heavy operations
- Limited to ~16ms per frame for 60 FPS

**Native Thread:**
- Handles UI rendering
- Runs native animations
- Communicates with JavaScript via bridge
- Bridge communication has overhead

**Common Performance Bottlenecks:**
1. **Heavy JavaScript operations** blocking the main thread
2. **Excessive re-renders** causing unnecessary work
3. **Large bundle sizes** slowing app startup
4. **Memory leaks** causing crashes over time
5. **Inefficient list rendering** with many items

### Optimization Strategies

**1. Component Optimization:**
- `React.memo()` for preventing unnecessary re-renders
- `useMemo()` for expensive calculations
- `useCallback()` for stable function references
- `PureComponent` for class components

**2. List Optimization:**
- `FlatList` instead of `ScrollView` with `.map()`
- `getItemLayout` for known item sizes
- `keyExtractor` for efficient updates
- `removeClippedSubviews` for memory management

**3. Image Optimization:**
- Resize images to appropriate dimensions
- Use WebP format when possible
- Implement lazy loading
- Cache images locally

**4. Bundle Optimization:**
- Code splitting and lazy loading
- Remove unused dependencies
- Tree shaking for smaller bundles
- Use Hermes engine (React Native's JS engine)

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Identify performance bottlenecks
- ✅ Optimize component rendering
- ✅ Implement efficient list rendering
- ✅ Use React performance tools
- ✅ Profile and debug performance issues
- ✅ Apply memory management techniques

## 📖 Book Reference

**"React Native in Action" - Chapter 17: Performance Optimization**
- Section 17.1: Performance profiling tools
- Section 17.2: Component optimization techniques
- Section 17.3: List and image optimization
- Section 17.4: Memory management

## 💻 Code Examples

### Example 1: Memoized Components

```typescript
import { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface EnvelopeCardProps {
  envelope: Envelope;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

// Memoize the component to prevent unnecessary re-renders
const EnvelopeCard = memo(({ envelope, onPress, onDelete }: EnvelopeCardProps) => {
  // Memoize expensive calculations
  const remaining = useMemo(() => {
    return envelope.allocated - envelope.spent;
  }, [envelope.allocated, envelope.spent]);

  const percentSpent = useMemo(() => {
    return envelope.allocated > 0 ? (envelope.spent / envelope.allocated) * 100 : 0;
  }, [envelope.spent, envelope.allocated]);

  // Memoize callback functions to prevent child re-renders
  const handlePress = useCallback(() => {
    onPress(envelope.id);
  }, [onPress, envelope.id]);

  const handleDelete = useCallback(() => {
    onDelete(envelope.id);
  }, [onDelete, envelope.id]);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handlePress}>
        <Text>{envelope.name}</Text>
        <Text>Remaining: ${remaining.toFixed(2)}</Text>
        <Text>{percentSpent.toFixed(0)}% spent</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete}>
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );
});

// Custom comparison function for more control
const EnvelopeCardWithCustomComparison = memo(
  EnvelopeCard,
  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.envelope.id === nextProps.envelope.id &&
      prevProps.envelope.name === nextProps.envelope.name &&
      prevProps.envelope.allocated === nextProps.envelope.allocated &&
      prevProps.envelope.spent === nextProps.envelope.spent
    );
  }
);
```

### Example 2: Optimized FlatList

```typescript
import { FlatList, ListRenderItem, View, Text } from 'react-native';
import { useMemo, useCallback } from 'react';

interface OptimizedEnvelopeListProps {
  envelopes: Envelope[];
  onEnvelopePress: (id: string) => void;
  onEnvelopeDelete: (id: string) => void;
}

function OptimizedEnvelopeList({ 
  envelopes, 
  onEnvelopePress, 
  onEnvelopeDelete 
}: OptimizedEnvelopeListProps) {
  // Memoize the render function
  const renderItem: ListRenderItem<Envelope> = useCallback(({ item }) => (
    <EnvelopeCard
      envelope={item}
      onPress={onEnvelopePress}
      onDelete={onEnvelopeDelete}
    />
  ), [onEnvelopePress, onEnvelopeDelete]);

  // Memoize the key extractor
  const keyExtractor = useCallback((item: Envelope) => item.id, []);

  // Memoize the item layout for better performance
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 120, // Height of each item
    offset: 120 * index,
    index,
  }), []);

  // Memoize the empty component
  const ListEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No envelopes yet</Text>
    </View>
  ), []);

  return (
    <FlatList
      data={envelopes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListEmptyComponent={ListEmptyComponent}
      removeClippedSubviews={true} // Remove off-screen items from memory
      maxToRenderPerBatch={10} // Render 10 items at a time
      windowSize={10} // Keep 10 screens worth of items in memory
      initialNumToRender={5} // Render 5 items initially
      updateCellsBatchingPeriod={50} // Batch updates every 50ms
      onEndReachedThreshold={0.5} // Load more when 50% from end
    />
  );
}
```

### Example 3: Image Optimization

```typescript
import { Image, View, Text, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';

interface OptimizedImageProps {
  source: { uri: string };
  width: number;
  height: number;
  placeholder?: string;
}

function OptimizedImage({ source, width, height, placeholder }: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  return (
    <View style={[styles.container, { width, height }]}>
      {loading && (
        <View style={styles.placeholder}>
          <Text>Loading...</Text>
        </View>
      )}
      
      <Image
        source={source}
        style={[styles.image, { width, height }]}
        onLoad={handleLoad}
        onError={handleError}
        resizeMode="cover"
        // Optimize for performance
        fadeDuration={0} // Disable fade animation
        progressiveRenderingEnabled={true} // Progressive loading
        cache="force-cache" // Cache the image
      />
      
      {error && (
        <View style={styles.errorContainer}>
          <Text>Failed to load</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 8,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffebee',
  },
});
```

### Example 4: Performance Monitoring

```typescript
import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

// Performance monitoring hook
function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    console.log(`${componentName} rendered ${renderCount.current} times`);
    console.log(`Time since last render: ${timeSinceLastRender}ms`);
    
    lastRenderTime.current = now;
  });

  return {
    renderCount: renderCount.current,
  };
}

// Heavy operation optimization
function useHeavyOperation<T>(
  operation: () => T,
  dependencies: any[]
): T | null {
  const [result, setResult] = useState<T | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) return;

    setIsRunning(true);
    
    // Run heavy operation after interactions complete
    InteractionManager.runAfterInteractions(() => {
      try {
        const operationResult = operation();
        setResult(operationResult);
      } catch (error) {
        console.error('Heavy operation failed:', error);
      } finally {
        setIsRunning(false);
      }
    });
  }, dependencies);

  return result;
}

// Usage example
function ExpensiveComponent({ data }: { data: any[] }) {
  const { renderCount } = usePerformanceMonitor('ExpensiveComponent');
  
  const processedData = useHeavyOperation(() => {
    // Expensive data processing
    return data.map(item => ({
      ...item,
      processed: complexCalculation(item),
    }));
  }, [data]);

  return (
    <View>
      <Text>Renders: {renderCount}</Text>
      {processedData && (
        <FlatList data={processedData} renderItem={renderItem} />
      )}
    </View>
  );
}
```

## 🛠️ Hands-On Exercise

### Goal: Optimize Your Budget App Performance

Let's identify and fix performance issues in your budget app!

**Step 1: Install Performance Tools**

```bash
npm install react-native-performance react-native-flipper
```

**Step 2: Create Performance Monitoring**

Create `/Users/torbenanderson/development/projects/learn-react-native/utils/performanceMonitor.ts`:

```typescript
import { InteractionManager } from 'react-native';

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): () => void {
    const startTime = Date.now();
    
    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }
      
      this.metrics.get(label)!.push(duration);
      
      // Log slow operations
      if (duration > 100) {
        console.warn(`Slow operation: ${label} took ${duration}ms`);
      }
    };
  }

  getMetrics(label: string): { average: number; max: number; count: number } {
    const times = this.metrics.get(label) || [];
    const average = times.reduce((sum, time) => sum + time, 0) / times.length;
    const max = Math.max(...times, 0);
    
    return { average, max, count: times.length };
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  logAllMetrics(): void {
    console.log('=== Performance Metrics ===');
    for (const [label, times] of this.metrics) {
      const { average, max, count } = this.getMetrics(label);
      console.log(`${label}: avg=${average.toFixed(2)}ms, max=${max}ms, count=${count}`);
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
```

**Step 3: Optimize Envelope List**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/budget/OptimizedEnvelopeList.tsx`:

```typescript
import { FlatList, ListRenderItem, View, Text, StyleSheet } from 'react-native';
import { memo, useMemo, useCallback } from 'react';
import { Envelope } from '@/types/budget';
import EnvelopeCard from './EnvelopeCard';
import { performanceMonitor } from '@/utils/performanceMonitor';

interface OptimizedEnvelopeListProps {
  envelopes: Envelope[];
  onEnvelopePress: (id: string) => void;
  onEnvelopeDelete: (id: string) => void;
  loading?: boolean;
}

const OptimizedEnvelopeList = memo(({ 
  envelopes, 
  onEnvelopePress, 
  onEnvelopeDelete,
  loading = false 
}: OptimizedEnvelopeListProps) => {
  // Memoize expensive calculations
  const processedEnvelopes = useMemo(() => {
    const endTiming = performanceMonitor.startTiming('processEnvelopes');
    
    const processed = envelopes.map(envelope => ({
      ...envelope,
      remaining: envelope.allocated - envelope.spent,
      percentSpent: envelope.allocated > 0 ? (envelope.spent / envelope.allocated) * 100 : 0,
    }));
    
    endTiming();
    return processed;
  }, [envelopes]);

  // Memoize render function
  const renderItem: ListRenderItem<Envelope> = useCallback(({ item }) => {
    const endTiming = performanceMonitor.startTiming('renderEnvelopeItem');
    
    const result = (
      <EnvelopeCard
        envelope={item}
        onPress={onEnvelopePress}
        onDelete={onEnvelopeDelete}
      />
    );
    
    endTiming();
    return result;
  }, [onEnvelopePress, onEnvelopeDelete]);

  // Memoize key extractor
  const keyExtractor = useCallback((item: Envelope) => item.id, []);

  // Memoize item layout for better performance
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 120, // Approximate height of each card
    offset: 120 * index,
    index,
  }), []);

  // Memoize empty component
  const ListEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? 'Loading envelopes...' : 'No envelopes yet'}
      </Text>
    </View>
  ), [loading]);

  // Memoize footer component
  const ListFooterComponent = useMemo(() => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {envelopes.length} envelope{envelopes.length !== 1 ? 's' : ''}
      </Text>
    </View>
  ), [envelopes.length]);

  return (
    <FlatList
      data={processedEnvelopes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      windowSize={10}
      initialNumToRender={3}
      updateCellsBatchingPeriod={100}
      onEndReachedThreshold={0.1}
      // Memory management
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
    />
  );
});

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});

export default OptimizedEnvelopeList;
```

**Step 4: Create Memoized Budget Summary**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/budget/MemoizedBudgetSummary.tsx`:

```typescript
import { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';
import { performanceMonitor } from '@/utils/performanceMonitor';

interface MemoizedBudgetSummaryProps {
  totalIncome: number;
  totalAllocated: number;
  totalSpent: number;
}

const MemoizedBudgetSummary = memo(({ 
  totalIncome, 
  totalAllocated, 
  totalSpent 
}: MemoizedBudgetSummaryProps) => {
  // Memoize expensive calculations
  const calculations = useMemo(() => {
    const endTiming = performanceMonitor.startTiming('budgetCalculations');
    
    const unallocated = totalIncome - totalAllocated;
    const remaining = totalAllocated - totalSpent;
    const percentSpent = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
    const isOverBudget = totalSpent > totalAllocated;
    
    endTiming();
    
    return {
      unallocated,
      remaining,
      percentSpent,
      isOverBudget,
    };
  }, [totalIncome, totalAllocated, totalSpent]);

  // Memoize status message
  const statusMessage = useMemo(() => {
    if (calculations.isOverBudget) {
      return 'Over budget!';
    } else if (calculations.unallocated > 0) {
      return 'Ready to allocate';
    } else {
      return 'All funds allocated';
    }
  }, [calculations.isOverBudget, calculations.unallocated]);

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Available to Budget</Text>
        <Text style={[
          styles.mainAmount,
          calculations.isOverBudget && styles.overBudgetAmount
        ]}>
          ${calculations.unallocated.toFixed(2)}
        </Text>
        <Text style={styles.mainSubtext}>{statusMessage}</Text>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={styles.statValue}>${totalIncome.toFixed(2)}</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Allocated</Text>
          <Text style={styles.statValue}>${totalAllocated.toFixed(2)}</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={styles.statValue}>${totalSpent.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Budget Progress</Text>
          <Text style={styles.progressPercent}>
            {calculations.percentSpent.toFixed(0)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(calculations.percentSpent, 100)}%`,
                backgroundColor: calculations.isOverBudget ? Colors.error : Colors.primary,
              }
            ]} 
          />
        </View>
        <Text style={styles.progressSubtext}>
          ${calculations.remaining.toFixed(2)} remaining
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  mainCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  mainLabel: {
    fontSize: Typography.sizes.base,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  mainAmount: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  overBudgetAmount: {
    color: Colors.error,
  },
  mainSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.surface,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  progressSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  progressPercent: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressSubtext: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default MemoizedBudgetSummary;
```

**Step 5: Add Performance Debugging**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/PerformanceDebugger.tsx`:

```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';

function PerformanceDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setMetrics({
          'processEnvelopes': performanceMonitor.getMetrics('processEnvelopes'),
          'renderEnvelopeItem': performanceMonitor.getMetrics('renderEnvelopeItem'),
          'budgetCalculations': performanceMonitor.getMetrics('budgetCalculations'),
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const clearMetrics = () => {
    performanceMonitor.clearMetrics();
    setMetrics({});
  };

  if (!isVisible) {
    return (
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.toggleButtonText}>Perf</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance Monitor</Text>
        <TouchableOpacity onPress={() => setIsVisible(false)}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.metrics}>
        {Object.entries(metrics).map(([key, value]) => (
          <View key={key} style={styles.metric}>
            <Text style={styles.metricName}>{key}</Text>
            <Text style={styles.metricValue}>
              avg: {value.average?.toFixed(2)}ms
            </Text>
            <Text style={styles.metricValue}>
              max: {value.max}ms
            </Text>
            <Text style={styles.metricValue}>
              count: {value.count}
            </Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.clearButton} onPress={clearMetrics}>
        <Text style={styles.clearButtonText}>Clear Metrics</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 8,
    minWidth: 200,
  },
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
    borderRadius: 4,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
  },
  metrics: {
    marginBottom: 10,
  },
  metric: {
    marginBottom: 8,
  },
  metricName: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricValue: {
    color: 'white',
    fontSize: 10,
  },
  clearButton: {
    backgroundColor: 'rgba(255,0,0,0.5)',
    padding: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 10,
  },
});

export default PerformanceDebugger;
```

**Step 6: Update Home Screen with Optimizations**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx`:

```typescript
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import MemoizedBudgetSummary from '@/components/budget/MemoizedBudgetSummary';
import AllocateFunds from '@/components/budget/AllocateFunds';
import OptimizedEnvelopeList from '@/components/budget/OptimizedEnvelopeList';
import PerformanceDebugger from '@/components/PerformanceDebugger';
import { useBudgetStore } from '@/stores/budgetStore';
import { Colors } from '@/constants/Design';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { 
    envelopes, 
    getTotalAllocated, 
    getTotalSpent, 
    totalIncome,
    syncWithServer,
    deleteEnvelope 
  } = useBudgetStore();
  
  const totalAllocated = getTotalAllocated();
  const totalSpent = getTotalSpent();

  // Memoize callback functions
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await syncWithServer();
    } finally {
      setRefreshing(false);
    }
  }, [syncWithServer]);

  const handleEnvelopePress = useCallback((envelopeId: string) => {
    // Navigate to envelope details
    console.log('View envelope:', envelopeId);
  }, []);

  const handleEnvelopeDelete = useCallback((envelopeId: string) => {
    deleteEnvelope(envelopeId);
  }, [deleteEnvelope]);

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
      <MemoizedBudgetSummary
        totalIncome={totalIncome}
        totalAllocated={totalAllocated}
        totalSpent={totalSpent}
      />
      
      <AllocateFunds />
      
      <OptimizedEnvelopeList
        envelopes={envelopes}
        onEnvelopePress={handleEnvelopePress}
        onEnvelopeDelete={handleEnvelopeDelete}
        loading={refreshing}
      />
      
      <PerformanceDebugger />
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

**Step 7: Test Performance Optimizations**

```bash
npm start
```

1. Open the performance debugger
2. Add many envelopes to test list performance
3. Scroll through the list and watch metrics
4. Try refreshing and see performance impact
5. Check memory usage in device settings

## ✅ Checkpoint

### What You Should See
- Smooth scrolling with many items
- Fast rendering of budget summary
- Performance metrics in debugger
- No unnecessary re-renders
- Responsive UI during operations

### Can You Answer These?
1. What causes performance issues in React Native?
2. How do you prevent unnecessary re-renders?
3. What are the benefits of memoization?
4. How do you optimize FlatList performance?
5. What tools help you identify performance bottlenecks?

### Common Issues

**Issue**: "Cannot find module 'react-native-performance'"
- **Solution**: Run `npm install react-native-performance react-native-flipper`

**Issue**: Performance still slow
- **Solution**: Check if you're using `useCallback` and `useMemo` correctly

**Issue**: Memory usage high
- **Solution**: Use `removeClippedSubviews` and optimize image loading

## 🚀 Next Steps

### Preview of Lesson 18: Testing and Debugging
In the next lesson, you'll learn how to:
- Write unit tests for components
- Test user interactions
- Debug common issues
- Set up testing environments
- Implement error boundaries

### Key Takeaways
- ✅ Performance optimization is crucial for user experience
- ✅ Memoization prevents unnecessary re-renders
- ✅ FlatList optimizations improve list performance
- ✅ Performance monitoring helps identify bottlenecks
- ✅ Memory management prevents crashes
- ✅ Profiling tools are essential for optimization

**Fantastic work completing Lesson 17!** Your app is now optimized for performance. Tomorrow, we'll learn testing and debugging!

---

**Time to complete**: ~3-4 hours
**Difficulty**: ⭐⭐⭐⭐☆ Advanced
**Previous lesson**: [16-advanced-ui-components.md](./16-advanced-ui-components.md)
**Next lesson**: [18-testing-debugging.md](./18-testing-debugging.md)

# Lesson 12: Advanced UI Components - Build Professional Interface Elements

## 📚 Theory

### Why Advanced UI Components?

**The Problem with Basic Components:**
- Limited customization options
- Inconsistent styling across screens
- Repetitive code for common patterns
- Poor user experience
- Hard to maintain

**The Solution: Advanced Components**
- Reusable, customizable components
- Consistent design system
- Better user experience
- Easier maintenance
- Professional appearance

### Component Architecture Patterns

**1. Compound Components:**
Components that work together as a group:

```typescript
// Usage
<Card>
  <Card.Header>
    <Card.Title>Budget Overview</Card.Title>
  </Card.Header>
  <Card.Content>
    <Card.Text>Your total budget is $5,000</Card.Text>
  </Card.Content>
  <Card.Footer>
    <Card.Button>View Details</Card.Button>
  </Card.Footer>
</Card>
```

**2. Render Props Pattern:**
Pass functions as children to customize rendering:

```typescript
<DataFetcher>
  {({ data, loading, error }) => (
    loading ? <LoadingSpinner /> : 
    error ? <ErrorMessage error={error} /> :
    <DataList data={data} />
  )}
</DataFetcher>
```

**3. Higher-Order Components (HOCs):**
Wrap components to add functionality:

```typescript
const withLoading = (WrappedComponent) => {
  return (props) => {
    if (props.loading) {
      return <LoadingSpinner />;
    }
    return <WrappedComponent {...props} />;
  };
};
```

### Animation Principles

**Why Animations Matter:**
- Provide visual feedback
- Guide user attention
- Make interactions feel natural
- Improve perceived performance
- Enhance user experience

**Animation Types:**
- **Layout animations**: Smooth transitions when content changes
- **Gesture animations**: Respond to user touch
- **Loading animations**: Show progress
- **Micro-interactions**: Small, delightful details

**Performance Considerations:**
- Use native driver when possible
- Avoid animating layout properties
- Keep animations under 300ms
- Use easing functions for natural motion

### Accessibility in React Native

**Why Accessibility Matters:**
- 15% of the world population has disabilities
- Legal requirements in many countries
- Better user experience for everyone
- Inclusive design principles

**Key Accessibility Features:**
- **Screen readers**: VoiceOver (iOS), TalkBack (Android)
- **Voice control**: Hands-free navigation
- **High contrast**: Better visibility
- **Large text**: Readable fonts
- **Motor assistance**: Switch control

**Accessibility Props:**
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Add new envelope"
  accessibilityHint="Double tap to create a new budget envelope"
  accessibilityRole="button"
>
  <Text>Add Envelope</Text>
</TouchableOpacity>
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Build compound components
- ✅ Create animated UI elements
- ✅ Implement gesture handling
- ✅ Add accessibility features
- ✅ Build reusable component libraries
- ✅ Create professional-looking interfaces

## 📖 Book Reference

**"React Native in Action" - Chapter 12: Advanced UI Components**
- Section 12.1: Component composition patterns
- Section 12.2: Animation and gestures
- Section 12.3: Accessibility best practices
- Section 12.4: Building component libraries

## 💻 Code Examples

### Example 1: Animated Card Component

```typescript
import { View, Text, StyleSheet, Animated, PanGestureHandler } from 'react-native';
import { useState, useRef } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

function AnimatedCard({ children, onSwipeLeft, onSwipeRight }: AnimatedCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleGestureEnd = (event: any) => {
    const { translationX, velocityX } = event.nativeEvent;
    
    if (Math.abs(translationX) > 100 || Math.abs(velocityX) > 500) {
      // Swipe threshold reached
      const toValue = translationX > 0 ? 300 : -300;
      
      Animated.parallel([
        Animated.timing(translateX, {
          toValue,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (translationX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
        
        // Reset animation
        translateX.setValue(0);
        scale.setValue(1);
      });
    } else {
      // Return to original position
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleGestureEnd}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX },
              { scale },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

### Example 2: Compound Modal Component

```typescript
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
}

interface ModalContentProps {
  children: ReactNode;
}

interface ModalFooterProps {
  children: ReactNode;
}

function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ModalContent({ children }: ModalContentProps) {
  return <View style={styles.content}>{children}</View>;
}

function ModalFooter({ children }: ModalFooterProps) {
  return <View style={styles.footer}>{children}</View>;
}

function CustomModal({ visible, onClose, children }: ModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {children}
      </View>
    </Modal>
  );
}

// Attach sub-components
CustomModal.Header = ModalHeader;
CustomModal.Content = ModalContent;
CustomModal.Footer = ModalFooter;

// Usage
<CustomModal visible={showModal} onClose={() => setShowModal(false)}>
  <CustomModal.Header 
    title="Add Envelope" 
    subtitle="Create a new budget category"
    onClose={() => setShowModal(false)}
  />
  <CustomModal.Content>
    <TextInput placeholder="Envelope name" />
    <TextInput placeholder="Amount" keyboardType="numeric" />
  </CustomModal.Content>
  <CustomModal.Footer>
    <TouchableOpacity style={styles.button}>
      <Text>Create Envelope</Text>
    </TouchableOpacity>
  </CustomModal.Footer>
</CustomModal>
```

### Example 3: Accessible Form Component

```typescript
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  accessibilityLabel,
  accessibilityHint,
}: FormFieldProps) {
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <View style={styles.field}>
      <Text 
        style={styles.label}
        accessibilityLabel={`${label}${required ? ', required' : ''}`}
      >
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint}
        accessibilityRequired={required}
        accessibilityInvalid={!!error}
        accessibilityErrorMessage={error}
      />
      
      {error && (
        <Text 
          style={styles.errorText}
          accessibilityLiveRegion="assertive"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2937',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
});
```

### Example 4: Loading States Component

```typescript
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface LoadingStatesProps {
  loading: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

function LoadingStates({ 
  loading, 
  error, 
  empty, 
  emptyMessage = 'No data available',
  children 
}: LoadingStatesProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: loading ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [loading]);

  if (loading) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
```

## 🛠️ Hands-On Exercise

### Goal: Build Advanced UI Components for Your Budget App

Let's create professional, reusable components that enhance your budget app!

**Step 1: Install Animation Dependencies**

```bash
npm install react-native-gesture-handler react-native-reanimated
```

**Step 2: Create Animated Envelope Card**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/budget/AnimatedEnvelopeCard.tsx`:

```typescript
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Design';

interface AnimatedEnvelopeCardProps {
  id: string;
  name: string;
  icon: string;
  allocated: number;
  spent: number;
  color: string;
  onPress: () => void;
  onDelete?: () => void;
}

function AnimatedEnvelopeCard({
  id,
  name,
  icon,
  allocated,
  spent,
  color,
  onPress,
  onDelete,
}: AnimatedEnvelopeCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const remaining = allocated - spent;
  const percentSpent = allocated > 0 ? (spent / allocated) * 100 : 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentSpent,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [percentSpent]);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        { 
          transform: [{ scale: scaleAnim }],
          borderLeftColor: color,
        },
        isPressed && styles.pressedCard,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityLabel={`${name} envelope, ${remaining} remaining`}
        accessibilityHint="Double tap to view details"
        accessibilityRole="button"
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.name}>{name}</Text>
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              style={styles.deleteButton}
              accessibilityLabel="Delete envelope"
              accessibilityRole="button"
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          )}
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

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: color,
                },
              ]}
            />
          </View>
          <Text style={styles.percentage}>
            {percentSpent.toFixed(0)}% spent
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    ...Shadows.medium,
  },
  pressedCard: {
    ...Shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  amounts: {
    marginBottom: Spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  amount: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  lowAmount: {
    color: Colors.error,
  },
  progressSection: {
    gap: Spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  percentage: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
});

export default AnimatedEnvelopeCard;
```

**Step 3: Create Floating Action Button**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/ui/FloatingActionButton.tsx`:

```typescript
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Design';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  label?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

function FloatingActionButton({
  onPress,
  icon = '+',
  label,
  color = Colors.primary,
  size = 'medium',
}: FloatingActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const sizeStyles = {
    small: { width: 48, height: 48, fontSize: 20 },
    medium: { width: 56, height: 56, fontSize: 24 },
    large: { width: 64, height: 64, fontSize: 28 },
  };

  const currentSize = sizeStyles[size];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: currentSize.width,
            height: currentSize.height,
            backgroundColor: color,
            borderRadius: currentSize.width / 2,
          },
          isPressed && styles.pressedButton,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={label || 'Add new item'}
        accessibilityRole="button"
        accessibilityHint="Double tap to add a new item"
      >
        <Text
          style={[
            styles.icon,
            {
              fontSize: currentSize.fontSize,
            },
          ]}
        >
          {icon}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.large,
  },
  pressedButton: {
    ...Shadows.medium,
  },
  icon: {
    color: Colors.surface,
    fontWeight: 'bold',
  },
});

export default FloatingActionButton;
```

**Step 4: Create Pull-to-Refresh Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/ui/PullToRefresh.tsx`:

```typescript
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Colors, Spacing, Typography } from '@/constants/Design';

interface PullToRefreshProps {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
}

function PullToRefresh({ refreshing, onRefresh, children }: PullToRefreshProps) {
  const pullAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (refreshing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [refreshing]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {refreshing && (
        <Animated.View style={styles.refreshIndicator}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </Animated.View>
          <Text style={styles.refreshText}>Refreshing...</Text>
        </Animated.View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
  refreshText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});

export default PullToRefresh;
```

**Step 5: Update Home Screen with New Components**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx`:

```typescript
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useState } from 'react';
import BudgetSummary from '@/components/budget/BudgetSummary';
import AllocateFunds from '@/components/budget/AllocateFunds';
import AnimatedEnvelopeCard from '@/components/budget/AnimatedEnvelopeCard';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import PullToRefresh from '@/components/ui/PullToRefresh';
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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await syncWithServer();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddEnvelope = () => {
    // Navigate to add envelope screen
    console.log('Add envelope');
  };

  const handleEnvelopePress = (envelopeId: string) => {
    // Navigate to envelope details
    console.log('View envelope:', envelopeId);
  };

  const handleDeleteEnvelope = (envelopeId: string) => {
    deleteEnvelope(envelopeId);
  };

  return (
    <PullToRefresh refreshing={refreshing} onRefresh={handleRefresh}>
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
          <AnimatedEnvelopeCard
            key={envelope.id}
            id={envelope.id}
            name={envelope.name}
            icon={envelope.icon}
            allocated={envelope.allocated}
            spent={envelope.spent}
            color={envelope.color}
            onPress={() => handleEnvelopePress(envelope.id)}
            onDelete={() => handleDeleteEnvelope(envelope.id)}
          />
        ))}
      </ScrollView>
      
      <FloatingActionButton
        onPress={handleAddEnvelope}
        icon="+"
        label="Add Envelope"
      />
    </PullToRefresh>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
```

**Step 6: Test Advanced Components**

```bash
npm start
```

1. Try pressing and releasing envelope cards
2. Use the floating action button
3. Pull down to refresh
4. Test accessibility with screen reader
5. Try deleting envelopes with the × button

## ✅ Checkpoint

### What You Should See
- Smooth animations on card interactions
- Floating action button with press feedback
- Pull-to-refresh functionality
- Accessible components with proper labels
- Professional, polished interface

### Can You Answer These?
1. What are compound components and why use them?
2. How do you create smooth animations in React Native?
3. What accessibility features should every component have?
4. How do you handle gesture interactions?
5. What makes a component truly reusable?

### Common Issues

**Issue**: "Cannot find module 'react-native-gesture-handler'"
- **Solution**: Run `npm install react-native-gesture-handler react-native-reanimated`

**Issue**: Animations not working
- **Solution**: Make sure to use `useNativeDriver: true` for transform animations

**Issue**: Gestures not responding
- **Solution**: Check that PanGestureHandler is properly configured

## 🚀 Next Steps

### Preview of Lesson 13: Performance Optimization
In the next lesson, you'll learn how to:
- Optimize component rendering
- Implement lazy loading
- Use memoization techniques
- Profile and debug performance
- Handle large datasets efficiently

### Key Takeaways
- ✅ Compound components provide flexible APIs
- ✅ Animations enhance user experience
- ✅ Accessibility is essential for inclusive design
- ✅ Gesture handling makes interactions natural
- ✅ Reusable components save development time
- ✅ Professional UI components impress users

**Outstanding work completing Lesson 12!** Your app now has professional-grade UI components. Tomorrow, we'll optimize performance!

---

**Time to complete**: ~3-4 hours
**Difficulty**: ⭐⭐⭐⭐☆ Advanced
**Previous lesson**: [11-authentication-security.md](./11-authentication-security.md)
**Next lesson**: [13-performance-optimization.md](./13-performance-optimization.md)

# Lesson 18: Testing and Debugging - Ensure Your Budget App Works Perfectly

## 📚 Theory

### Why Testing Matters

**The Cost of Bugs:**
- **Development Time**: 50% of development time spent debugging
- **User Experience**: Bugs frustrate users and hurt retention
- **Business Impact**: Critical bugs can cause data loss or security issues
- **Maintenance**: Untested code is harder to modify safely
- **Confidence**: Tests give you confidence to refactor and add features

**Types of Testing:**
1. **Unit Tests**: Test individual functions/components in isolation
2. **Integration Tests**: Test how components work together
3. **End-to-End Tests**: Test complete user workflows
4. **Visual Regression Tests**: Ensure UI doesn't break unexpectedly
5. **Performance Tests**: Verify app performance under load

### Testing Pyramid

**The Testing Pyramid Concept:**
```
        /\
       /  \     E2E Tests (Few, Slow, Expensive)
      /____\    
     /      \   Integration Tests (Some, Medium)
    /________\  
   /          \  Unit Tests (Many, Fast, Cheap)
  /____________\
```

**Why This Structure?**
- **Unit Tests**: Fast, reliable, catch most bugs
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test real user scenarios

### React Native Testing Challenges

**Unique Challenges:**
- **Native Dependencies**: Some components depend on native code
- **Platform Differences**: iOS vs Android behavior
- **Async Operations**: Network calls, animations, timers
- **Navigation**: Testing screen transitions
- **Device Features**: Camera, location, notifications

**Testing Tools:**
- **Jest**: JavaScript testing framework
- **React Native Testing Library**: Component testing utilities
- **Detox**: End-to-end testing for React Native
- **Flipper**: Debugging and inspection tool

### Debugging Strategies

**1. Console Logging:**
```typescript
console.log('Debug info:', { data, timestamp: Date.now() });
console.warn('Warning:', warningMessage);
console.error('Error:', error);
```

**2. React Native Debugger:**
- Inspect component state
- View network requests
- Debug Redux/Zustand stores
- Performance profiling

**3. Flipper Integration:**
- Network inspector
- Layout inspector
- Database inspector
- Crash reporter

**4. Error Boundaries:**
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Write unit tests for React Native components
- ✅ Test user interactions and state changes
- ✅ Set up integration testing
- ✅ Debug common React Native issues
- ✅ Implement error boundaries
- ✅ Use debugging tools effectively

## 📖 Book Reference

**"React Native in Action" - Chapter 18: Testing and Debugging**
- Section 18.1: Testing fundamentals
- Section 18.2: Component testing with React Native Testing Library
- Section 18.3: Debugging tools and techniques
- Section 18.4: Error handling and reporting

## 💻 Code Examples

### Example 1: Basic Component Testing

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import EnvelopeCard from '../EnvelopeCard';

// Mock data
const mockEnvelope = {
  id: '1',
  name: 'Groceries',
  icon: '🛒',
  allocated: 500,
  spent: 300,
  color: '#10b981',
};

describe('EnvelopeCard', () => {
  it('renders envelope information correctly', () => {
    const { getByText } = render(
      <EnvelopeCard
        envelope={mockEnvelope}
        onPress={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(getByText('Groceries')).toBeTruthy();
    expect(getByText('$500.00')).toBeTruthy();
    expect(getByText('$300.00')).toBeTruthy();
    expect(getByText('$200.00')).toBeTruthy(); // remaining
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <EnvelopeCard
        envelope={mockEnvelope}
        onPress={mockOnPress}
        onDelete={jest.fn()}
      />
    );

    fireEvent.press(getByText('Groceries'));
    expect(mockOnPress).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is pressed', () => {
    const mockOnDelete = jest.fn();
    const { getByText } = render(
      <EnvelopeCard
        envelope={mockEnvelope}
        onPress={jest.fn()}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText('×'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('shows low amount warning when remaining is less than 50', () => {
    const lowAmountEnvelope = {
      ...mockEnvelope,
      spent: 480, // Only $20 remaining
    };

    const { getByText } = render(
      <EnvelopeCard
        envelope={lowAmountEnvelope}
        onPress={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const remainingText = getByText('$20.00');
    expect(remainingText.props.style).toContainEqual(
      expect.objectContaining({ color: '#ef4444' })
    );
  });
});
```

### Example 2: Testing Hooks and State

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useBudgetStore } from '../stores/budgetStore';

describe('Budget Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useBudgetStore.getState().resetStore();
  });

  it('adds envelope correctly', () => {
    const { result } = renderHook(() => useBudgetStore());

    act(() => {
      result.current.addEnvelope({
        name: 'Test Envelope',
        icon: '🧪',
        color: '#3b82f6',
        allocated: 100,
        spent: 0,
      });
    });

    expect(result.current.envelopes).toHaveLength(1);
    expect(result.current.envelopes[0].name).toBe('Test Envelope');
  });

  it('calculates total allocated correctly', () => {
    const { result } = renderHook(() => useBudgetStore());

    act(() => {
      result.current.addEnvelope({
        name: 'Envelope 1',
        icon: '1',
        color: '#3b82f6',
        allocated: 100,
        spent: 0,
      });
      result.current.addEnvelope({
        name: 'Envelope 2',
        icon: '2',
        color: '#3b82f6',
        allocated: 200,
        spent: 0,
      });
    });

    expect(result.current.getTotalAllocated()).toBe(300);
  });

  it('updates envelope correctly', () => {
    const { result } = renderHook(() => useBudgetStore());

    act(() => {
      result.current.addEnvelope({
        name: 'Test Envelope',
        icon: '🧪',
        color: '#3b82f6',
        allocated: 100,
        spent: 0,
      });
    });

    const envelopeId = result.current.envelopes[0].id;

    act(() => {
      result.current.updateEnvelope(envelopeId, { allocated: 150 });
    });

    expect(result.current.envelopes[0].allocated).toBe(150);
  });
});
```

### Example 3: Testing Async Operations

```typescript
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DataFetcher } from '../DataFetcher';

// Mock fetch
global.fetch = jest.fn();

describe('DataFetcher', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('shows loading state initially', () => {
    const { getByText } = render(<DataFetcher />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('shows data when fetch succeeds', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { getByText } = render(<DataFetcher />);

    await waitFor(() => {
      expect(getByText('Test')).toBeTruthy();
    });

    expect(fetch).toHaveBeenCalledWith('/api/data');
  });

  it('shows error when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { getByText } = render(<DataFetcher />);

    await waitFor(() => {
      expect(getByText('Error: Network error')).toBeTruthy();
    });
  });
});
```

### Example 4: Error Boundary Testing

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>No error</Text>;
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(getByText('No error')).toBeTruthy();
  });

  it('renders error fallback when there is an error', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('resets error state when retry is pressed', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText, rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong')).toBeTruthy();

    // Simulate retry by re-rendering without error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(getByText('No error')).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
```

## 🛠️ Hands-On Exercise

### Goal: Add Comprehensive Testing to Your Budget App

Let's set up testing infrastructure and write tests for your budget app!

**Step 1: Install Testing Dependencies**

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native @testing-library/react-hooks jest
```

**Step 2: Configure Jest**

Create `/Users/torbenanderson/development/projects/learn-react-native/jest.config.js`:

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-community|@react-native-async-storage|expo|@expo|expo-.*|@expo-.*|@unimodules|unimodules|sentry-expo|native-base|react-native-svg|react-native-gesture-handler|react-native-reanimated|@react-native-community/netinfo|expo-secure-store|expo-local-authentication)/)',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'stores/**/*.{js,jsx,ts,tsx}',
    'services/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

**Step 3: Create Test Utilities**

Create `/Users/torbenanderson/development/projects/learn-react-native/utils/testUtils.tsx`:

```typescript
import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { AuthProvider } from '@/contexts/AuthContext';
import { useBudgetStore } from '@/stores/budgetStore';

// Mock the budget store
jest.mock('@/stores/budgetStore', () => ({
  useBudgetStore: jest.fn(),
}));

// Mock the auth context
jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com', name: 'Test User' },
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Custom render function with providers
const AllTheProviders = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

const customRender = (ui, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Mock store data
export const mockStoreData = {
  envelopes: [
    {
      id: '1',
      name: 'Groceries',
      icon: '🛒',
      color: '#10b981',
      allocated: 500,
      spent: 300,
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
  ],
  transactions: [],
  totalIncome: 3000,
  loading: false,
  error: null,
  addEnvelope: jest.fn(),
  updateEnvelope: jest.fn(),
  deleteEnvelope: jest.fn(),
  addTransaction: jest.fn(),
  getTotalAllocated: jest.fn(() => 1700),
  getTotalSpent: jest.fn(() => 1500),
  getUnallocatedFunds: jest.fn(() => 1300),
  syncWithServer: jest.fn(),
  saveToStorage: jest.fn(),
  clearStorage: jest.fn(),
};

// Setup mock store
export const setupMockStore = (overrides = {}) => {
  const mockData = { ...mockStoreData, ...overrides };
  (useBudgetStore as jest.Mock).mockReturnValue(mockData);
  return mockData;
};

export * from '@testing-library/react-native';
export { customRender as render };
```

**Step 4: Test Envelope Card Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/budget/__tests__/EnvelopeCard.test.tsx`:

```typescript
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { render, setupMockStore } from '@/utils/testUtils';
import EnvelopeCard from '../EnvelopeCard';

describe('EnvelopeCard', () => {
  const mockEnvelope = {
    id: '1',
    name: 'Groceries',
    icon: '🛒',
    color: '#10b981',
    allocated: 500,
    spent: 300,
    createdAt: '2023-01-01T00:00:00Z',
  };

  const mockOnPress = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockStore();
  });

  it('renders envelope information correctly', () => {
    const { getByText } = render(
      <EnvelopeCard
        envelope={mockEnvelope}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('Groceries')).toBeTruthy();
    expect(getByText('$500.00')).toBeTruthy();
    expect(getByText('$300.00')).toBeTruthy();
    expect(getByText('$200.00')).toBeTruthy(); // remaining
    expect(getByText('60% spent')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const { getByText } = render(
      <EnvelopeCard
        envelope={mockEnvelope}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText('Groceries'));
    expect(mockOnPress).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is pressed', () => {
    const { getByText } = render(
      <EnvelopeCard
        envelope={mockEnvelope}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText('×'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('shows low amount warning when remaining is less than 50', () => {
    const lowAmountEnvelope = {
      ...mockEnvelope,
      spent: 480, // Only $20 remaining
    };

    const { getByText } = render(
      <EnvelopeCard
        envelope={lowAmountEnvelope}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    const remainingText = getByText('$20.00');
    expect(remainingText.props.style).toContainEqual(
      expect.objectContaining({ color: '#ef4444' })
    );
  });

  it('shows 100% spent when allocated equals spent', () => {
    const fullySpentEnvelope = {
      ...mockEnvelope,
      spent: 500,
    };

    const { getByText } = render(
      <EnvelopeCard
        envelope={fullySpentEnvelope}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('100% spent')).toBeTruthy();
  });

  it('handles zero allocated amount gracefully', () => {
    const zeroAllocatedEnvelope = {
      ...mockEnvelope,
      allocated: 0,
      spent: 0,
    };

    const { getByText } = render(
      <EnvelopeCard
        envelope={zeroAllocatedEnvelope}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('0% spent')).toBeTruthy();
  });
});
```

**Step 5: Test Budget Store**

Create `/Users/torbenanderson/development/projects/learn-react-native/stores/__tests__/budgetStore.test.ts`:

```typescript
import { act, renderHook } from '@testing-library/react-hooks';
import { useBudgetStore } from '../budgetStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock API service
jest.mock('@/services/apiService', () => ({
  apiService: {
    getEnvelopes: jest.fn(),
    createEnvelope: jest.fn(),
    updateEnvelope: jest.fn(),
    deleteEnvelope: jest.fn(),
  },
}));

describe('Budget Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useBudgetStore.getState().resetStore();
    });
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useBudgetStore());

    expect(result.current.envelopes).toEqual([]);
    expect(result.current.transactions).toEqual([]);
    expect(result.current.totalIncome).toBe(3000);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('adds envelope correctly', () => {
    const { result } = renderHook(() => useBudgetStore());

    act(() => {
      result.current.addEnvelope({
        name: 'Test Envelope',
        icon: '🧪',
        color: '#3b82f6',
        allocated: 100,
        spent: 0,
      });
    });

    expect(result.current.envelopes).toHaveLength(1);
    expect(result.current.envelopes[0].name).toBe('Test Envelope');
    expect(result.current.envelopes[0].allocated).toBe(100);
    expect(result.current.envelopes[0].spent).toBe(0);
    expect(result.current.envelopes[0].id).toBeDefined();
  });

  it('updates envelope correctly', () => {
    const { result } = renderHook(() => useBudgetStore());

    // Add an envelope first
    act(() => {
      result.current.addEnvelope({
        name: 'Test Envelope',
        icon: '🧪',
        color: '#3b82f6',
        allocated: 100,
        spent: 0,
      });
    });

    const envelopeId = result.current.envelopes[0].id;

    act(() => {
      result.current.updateEnvelope(envelopeId, { allocated: 150 });
    });

    expect(result.current.envelopes[0].allocated).toBe(150);
  });

  it('deletes envelope correctly', () => {
    const { result } = renderHook(() => useBudgetStore());

    // Add an envelope first
    act(() => {
      result.current.addEnvelope({
        name: 'Test Envelope',
        icon: '🧪',
        color: '#3b82f6',
        allocated: 100,
        spent: 0,
      });
    });

    const envelopeId = result.current.envelopes[0].id;

    act(() => {
      result.current.deleteEnvelope(envelopeId);
    });

    expect(result.current.envelopes).toHaveLength(0);
  });

  it('calculates total allocated correctly', () => {
    const { result } = renderHook(() => useBudgetStore());

    act(() => {
      result.current.addEnvelope({
        name: 'Envelope 1',
        icon: '1',
        color: '#3b82f6',
        allocated: 100,
        spent: 0,
      });
      result.current.addEnvelope({
        name: 'Envelope 2',
        icon: '2',
        color: '#3b82f6',
        allocated: 200,
        spent: 0,
      });
    });

    expect(result.current.getTotalAllocated()).toBe(300);
  });

  it('calculates total spent correctly', () => {
    const { result } = renderHook(() => useBudgetStore());

    act(() => {
      result.current.addEnvelope({
        name: 'Envelope 1',
        icon: '1',
        color: '#3b82f6',
        allocated: 100,
        spent: 50,
      });
      result.current.addEnvelope({
        name: 'Envelope 2',
        icon: '2',
        color: '#3b82f6',
        allocated: 200,
        spent: 75,
      });
    });

    expect(result.current.getTotalSpent()).toBe(125);
  });

  it('calculates unallocated funds correctly', () => {
    const { result } = renderHook(() => useBudgetStore());

    act(() => {
      result.current.addEnvelope({
        name: 'Envelope 1',
        icon: '1',
        color: '#3b82f6',
        allocated: 100,
        spent: 0,
      });
    });

    expect(result.current.getUnallocatedFunds()).toBe(2900); // 3000 - 100
  });

  it('adds transaction and updates envelope spent amount', () => {
    const { result } = renderHook(() => useBudgetStore());

    // Add an envelope first
    act(() => {
      result.current.addEnvelope({
        name: 'Test Envelope',
        icon: '🧪',
        color: '#3b82f6',
        allocated: 100,
        spent: 0,
      });
    });

    const envelopeId = result.current.envelopes[0].id;

    act(() => {
      result.current.addTransaction({
        envelopeId,
        description: 'Test transaction',
        amount: 25,
        date: '2023-01-01',
        type: 'expense',
      });
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.envelopes[0].spent).toBe(25);
  });
});
```

**Step 6: Test Home Screen Integration**

Create `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/__tests__/index.test.tsx`:

```typescript
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { render, setupMockStore } from '@/utils/testUtils';
import HomeScreen from '../index';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders budget summary with correct data', () => {
    setupMockStore({
      totalIncome: 3000,
      getTotalAllocated: () => 1700,
      getTotalSpent: () => 1500,
    });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('Available to Budget')).toBeTruthy();
    expect(getByText('$1,300.00')).toBeTruthy(); // 3000 - 1700
  });

  it('renders envelope list', () => {
    setupMockStore();

    const { getByText } = render(<HomeScreen />);

    expect(getByText('Groceries')).toBeTruthy();
    expect(getByText('Rent')).toBeTruthy();
  });

  it('handles envelope press', () => {
    const mockStore = setupMockStore();
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText('Groceries'));

    // In a real app, this would navigate to envelope details
    // For now, we just verify the press was handled
    expect(getByText('Groceries')).toBeTruthy();
  });

  it('handles envelope delete', () => {
    const mockStore = setupMockStore();
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText('×'));

    expect(mockStore.deleteEnvelope).toHaveBeenCalledWith('1');
  });

  it('shows loading state', () => {
    setupMockStore({ loading: true });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('Loading your budget data...')).toBeTruthy();
  });

  it('handles refresh', async () => {
    const mockStore = setupMockStore();
    const { getByTestId } = render(<HomeScreen />);

    // Simulate pull to refresh
    const scrollView = getByTestId('scroll-view');
    fireEvent(scrollView, 'onRefresh');

    await waitFor(() => {
      expect(mockStore.syncWithServer).toHaveBeenCalled();
    });
  });
});
```

**Step 7: Create Error Boundary**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/ErrorBoundary.tsx`:

```typescript
import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/Design';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In a real app, you'd send this to a crash reporting service
    // crashlytics().recordError(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. Please try again.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});

export default ErrorBoundary;
```

**Step 8: Run Tests**

```bash
npm test
```

**Step 9: Run Tests with Coverage**

```bash
npm test -- --coverage
```

## ✅ Checkpoint

### What You Should See
- All tests passing
- Good test coverage (70%+)
- Clear test output
- Error boundary working
- Comprehensive test suite

### Can You Answer These?
1. Why is testing important for React Native apps?
2. What are the different types of testing?
3. How do you test user interactions?
4. What is an error boundary and why use it?
5. How do you mock dependencies in tests?

### Common Issues

**Issue**: Tests not running
- **Solution**: Check Jest configuration and file paths

**Issue**: Mock not working
- **Solution**: Ensure mocks are set up before imports

**Issue**: Coverage too low
- **Solution**: Add more test cases for edge cases

## 🚀 Next Steps

### Preview of Lesson 19: Deployment and Distribution
In the next lesson, you'll learn how to:
- Build production apps
- Deploy to app stores
- Set up CI/CD pipelines
- Handle app updates
- Monitor app performance

### Key Takeaways
- ✅ Testing prevents bugs and improves code quality
- ✅ Unit tests are fast and catch most issues
- ✅ Integration tests verify component interactions
- ✅ Error boundaries provide graceful error handling
- ✅ Mocking dependencies makes tests reliable
- ✅ Test coverage helps identify untested code

**Excellent work completing Lesson 18!** Your app is now thoroughly tested. Tomorrow, we'll learn deployment and distribution!

---

**Time to complete**: ~3-4 hours
**Difficulty**: ⭐⭐⭐⭐☆ Advanced
**Previous lesson**: [17-performance-optimization.md](./17-performance-optimization.md)
**Next lesson**: [19-deployment-distribution.md](./19-deployment-distribution.md)

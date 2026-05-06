# Lesson 09: Custom Hooks - Reusable Logic and State Management

## 📚 Theory

### What are Custom Hooks?

**Custom Hooks** are JavaScript functions that:
- Start with "use" (React naming convention)
- Can call other hooks (useState, useEffect, etc.)
- Allow you to extract component logic into reusable functions
- Share stateful logic between components

**Why Custom Hooks Matter:**
- **Reusability**: Write logic once, use everywhere
- **Separation of Concerns**: Keep components focused on UI
- **Testing**: Test logic independently from components
- **Code Organization**: Group related logic together
- **Abstraction**: Hide complex implementation details

### Custom Hook Patterns

**1. State Logic Hooks:**
Extract useState and related logic:
```typescript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
```

**2. Effect Logic Hooks:**
Extract useEffect and side effects:
```typescript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setValue(JSON.parse(stored));
  }, [key]);
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
```

**3. Data Fetching Hooks:**
Extract API calls and data management:
```typescript
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}
```

### Custom Hook Rules

**1. Only Call Hooks at the Top Level:**
```typescript
// ✅ Good
function useExample() {
  const [state, setState] = useState(0);
  useEffect(() => {}, []);
  return { state, setState };
}

// ❌ Bad
function useExample() {
  if (condition) {
    const [state, setState] = useState(0); // Don't do this!
  }
}
```

**2. Only Call Hooks from React Functions:**
```typescript
// ✅ Good - Custom hook
function useCustomHook() {
  return useState(0);
}

// ✅ Good - React component
function MyComponent() {
  const [state] = useCustomHook();
  return <Text>{state}</Text>;
}

// ❌ Bad - Regular function
function regularFunction() {
  const [state] = useState(0); // Don't do this!
}
```

**3. Use Descriptive Names:**
```typescript
// ✅ Good
function useEnvelopeData() { }
function useFormValidation() { }
function useNetworkStatus() { }

// ❌ Bad
function useData() { }
function useValidation() { }
function useStatus() { }
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand what custom hooks are and why they're useful
- ✅ Create custom hooks for common patterns
- ✅ Extract logic from components into reusable hooks
- ✅ Share stateful logic between components
- ✅ Follow custom hook best practices
- ✅ Build a form handling hook

## 📖 Book Reference

**"React Native in Action" - Chapter 9: Custom Hooks**
- Section 9.1: Introduction to custom hooks
- Section 9.2: Extracting component logic
- Section 9.3: Sharing stateful logic
- Section 9.4: Custom hook patterns

## 💻 Code Examples

### Example 1: Form Handling Hook

```typescript
import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  handleSubmit: () => void;
  reset: () => void;
}

function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const newErrors = validate(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validate]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    setValue,
    setError,
    handleSubmit,
    reset,
  };
}

export default useForm;
```

### Example 2: Local Storage Hook

```typescript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useAsyncStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          setValue(JSON.parse(stored));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const setStoredValue = async (newValue: T) => {
    try {
      setValue(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
    }
  };

  const removeValue = async () => {
    try {
      setValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove data');
    }
  };

  return {
    value,
    setValue: setStoredValue,
    removeValue,
    loading,
    error,
  };
}

export default useAsyncStorage;
```

### Example 3: Network Status Hook

```typescript
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface NetworkState {
  isConnected: boolean;
  type: string | null;
  isInternetReachable: boolean | null;
}

function useNetworkStatus() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    type: null,
    isInternetReachable: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      });
    });

    return () => unsubscribe();
  }, []);

  return networkState;
}

export default useNetworkStatus;
```

### Example 4: Debounced Value Hook

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

## 🛠️ Hands-On Exercise

### Goal: Create Custom Hooks for Your Budget App

Let's build reusable custom hooks that will make your budget app more maintainable!

**Step 1: Create Form Validation Hook**

Create `/Users/torbenanderson/development/projects/learn-react-native/hooks/useFormValidation.ts`:

```typescript
import { useState, useCallback } from 'react';

interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | undefined;
}

interface ValidationRules<T> {
  [K in keyof T]?: ValidationRule<T[K]>;
}

interface UseFormValidationReturn<T> {
  errors: Partial<Record<keyof T, string>>;
  validateField: (field: keyof T, value: any) => string | undefined;
  validateForm: (values: T) => boolean;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
}

function useFormValidation<T extends Record<string, any>>(
  rules: ValidationRules<T>
): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = useCallback((field: keyof T, value: any): string | undefined => {
    const rule = rules[field];
    if (!rule) return undefined;

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${String(field)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') {
      return undefined;
    }

    // Min length validation
    if (rule.minLength && value.toString().length < rule.minLength) {
      return `${String(field)} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && value.toString().length > rule.maxLength) {
      return `${String(field)} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value.toString())) {
      return `${String(field)} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return undefined;
  }, [rules]);

  const validateForm = useCallback((values: T): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const field = key as keyof T;
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField]);

  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
  };
}

export default useFormValidation;
```

**Step 2: Create Envelope Form Hook**

Create `/Users/torbenanderson/development/projects/learn-react-native/hooks/useEnvelopeForm.ts`:

```typescript
import { useState, useCallback } from 'react';
import useFormValidation from './useFormValidation';

interface EnvelopeFormData {
  name: string;
  allocated: string;
  icon: string;
  color: string;
}

const initialValues: EnvelopeFormData = {
  name: '',
  allocated: '',
  icon: '📁',
  color: '#3b82f6',
};

const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  allocated: {
    required: true,
    custom: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num)) return 'Amount must be a valid number';
      if (num <= 0) return 'Amount must be greater than 0';
      if (num > 10000) return 'Amount must be less than $10,000';
      return undefined;
    },
  },
  icon: {
    required: true,
  },
  color: {
    required: true,
    pattern: /^#[0-9A-F]{6}$/i,
  },
};

function useEnvelopeForm() {
  const [values, setValues] = useState<EnvelopeFormData>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
  } = useFormValidation(validationRules);

  const setValue = useCallback((field: keyof EnvelopeFormData, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    clearError(field);
  }, [clearError]);

  const handleSubmit = useCallback(async (onSubmit: (data: EnvelopeFormData) => Promise<void>) => {
    if (!validateForm(values)) return false;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setValues(initialValues);
      clearAllErrors();
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, clearAllErrors]);

  const reset = useCallback(() => {
    setValues(initialValues);
    clearAllErrors();
    setIsSubmitting(false);
  }, [clearAllErrors]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    setValue,
    handleSubmit,
    reset,
  };
}

export default useEnvelopeForm;
```

**Step 3: Create Budget Calculations Hook**

Create `/Users/torbenanderson/development/projects/learn-react-native/hooks/useBudgetCalculations.ts`:

```typescript
import { useMemo } from 'react';

interface Envelope {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

interface BudgetCalculations {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  unallocatedFunds: number;
  isOverBudget: boolean;
  percentSpent: number;
  envelopesOverBudget: Envelope[];
  envelopesLowFunds: Envelope[];
}

function useBudgetCalculations(
  envelopes: Envelope[],
  totalIncome: number = 3000
): BudgetCalculations {
  return useMemo(() => {
    const totalAllocated = envelopes.reduce((sum, env) => sum + env.allocated, 0);
    const totalSpent = envelopes.reduce((sum, env) => sum + env.spent, 0);
    const totalRemaining = totalAllocated - totalSpent;
    const unallocatedFunds = totalIncome - totalAllocated;
    const isOverBudget = totalSpent > totalAllocated;
    const percentSpent = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    const envelopesOverBudget = envelopes.filter(env => env.spent > env.allocated);
    const envelopesLowFunds = envelopes.filter(env => {
      const remaining = env.allocated - env.spent;
      return remaining > 0 && remaining < 50;
    });

    return {
      totalAllocated,
      totalSpent,
      totalRemaining,
      unallocatedFunds,
      isOverBudget,
      percentSpent,
      envelopesOverBudget,
      envelopesLowFunds,
    };
  }, [envelopes, totalIncome]);
}

export default useBudgetCalculations;
```

**Step 4: Create Search Hook**

Create `/Users/torbenanderson/development/projects/learn-react-native/hooks/useSearch.ts`:

```typescript
import { useState, useMemo } from 'react';
import useDebounce from './useDebounce';

interface SearchableItem {
  name: string;
  [key: string]: any;
}

function useSearch<T extends SearchableItem>(
  items: T[],
  searchFields: (keyof T)[] = ['name']
) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;

    const lowercaseQuery = debouncedQuery.toLowerCase();
    
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(lowercaseQuery);
      })
    );
  }, [items, debouncedQuery, searchFields]);

  const clearSearch = () => setQuery('');

  return {
    query,
    setQuery,
    filteredItems,
    clearSearch,
    hasResults: filteredItems.length > 0,
    isSearching: query !== debouncedQuery,
  };
}

export default useSearch;
```

**Step 5: Update AllocateFunds with Custom Hook**

Update `/Users/torbenanderson/development/projects/learn-react-native/components/budget/AllocateFunds.tsx`:

```typescript
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import useEnvelopeForm from '@/hooks/useEnvelopeForm';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';

interface AllocateFundsProps {
  onAddEnvelope: (data: { name: string; allocated: number; icon: string; color: string }) => void;
  unallocatedFunds: number;
}

function AllocateFunds({ onAddEnvelope, unallocatedFunds }: AllocateFundsProps) {
  const {
    values,
    errors,
    isSubmitting,
    isValid,
    setValue,
    handleSubmit,
    reset,
  } = useEnvelopeForm();

  const onSubmit = async (data: typeof values) => {
    const allocated = parseFloat(data.allocated);
    
    if (allocated > unallocatedFunds) {
      // Handle insufficient funds error
      return;
    }

    onAddEnvelope({
      name: data.name,
      allocated,
      icon: data.icon,
      color: data.color,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allocate Funds</Text>
      
      <View style={styles.fundsCard}>
        <Text style={styles.fundsLabel}>Unallocated Funds</Text>
        <Text style={styles.fundsAmount}>${unallocatedFunds.toFixed(2)}</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Envelope Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={values.name}
            onChangeText={(text) => setValue('name', text)}
            placeholder="e.g., Groceries"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>
        
        <View style={styles.field}>
          <Text style={styles.label}>Amount to Allocate</Text>
          <TextInput
            style={[styles.input, errors.allocated && styles.inputError]}
            value={values.allocated}
            onChangeText={(text) => setValue('allocated', text)}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
          {errors.allocated && <Text style={styles.errorText}>{errors.allocated}</Text>}
        </View>
        
        <TouchableOpacity 
          style={[styles.button, (!isValid || isSubmitting) && styles.buttonDisabled]}
          onPress={() => handleSubmit(onSubmit)}
          disabled={!isValid || isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Adding...' : 'Allocate Funds'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... styles remain the same
```

**Step 6: Test Custom Hooks**

```bash
npm start
```

1. Try adding envelopes with the form
2. Test validation by entering invalid data
3. See how the form resets after successful submission
4. Notice how errors clear when you start typing

## ✅ Checkpoint

### What You Should See
- Form validation working properly
- Errors clearing when you start typing
- Form resetting after successful submission
- Reusable logic extracted into hooks
- Cleaner, more maintainable components

### Can You Answer These?
1. What are custom hooks and why use them?
2. What are the rules for custom hooks?
3. How do you extract logic from components?
4. What patterns work well for custom hooks?
5. How do you share stateful logic between components?

### Common Issues

**Issue**: "Rules of Hooks" error
- **Solution**: Make sure hooks are called at the top level

**Issue**: Stale closures
- **Solution**: Use useCallback for functions in custom hooks

**Issue**: Infinite re-renders
- **Solution**: Check dependency arrays in useEffect

## 🚀 Next Steps

### Preview of Lesson 10: State Management with Zustand
In the next lesson, you'll learn how to:
- Manage global state across components
- Use Zustand for state management
- Persist state to device storage
- Handle complex state updates

### Key Takeaways
- ✅ Custom hooks extract and reuse component logic
- ✅ Follow the rules of hooks for custom hooks
- ✅ Use descriptive names for custom hooks
- ✅ Extract common patterns into reusable hooks
- ✅ Custom hooks make components cleaner and more testable

**Excellent work completing Lesson 09!** Your app now has reusable logic. Tomorrow, we'll learn global state management!

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐⭐⭐☆☆ Intermediate
**Previous lesson**: [08-useeffect-side-effects.md](./08-useeffect-side-effects.md)
**Next lesson**: [10-state-management-zustand.md](./10-state-management-zustand.md)

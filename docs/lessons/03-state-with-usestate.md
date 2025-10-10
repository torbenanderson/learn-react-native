# Lesson 03: State with useState - Add Interactive Envelope Allocation Forms

## 📚 Theory

### What is State?

**State** is data that can change over time. Unlike props (which are passed in and read-only), state is owned and managed by the component itself.

```typescript
// Props (read-only, from parent)
<EnvelopeCard name="Groceries" amount={500} />

// State (changeable, owned by component)
const [amount, setAmount] = useState(500);
// Can change: setAmount(600)
```

**Think of it like this:**
- **Props** = Settings you receive (like your birthdate - can't change)
- **State** = Things you control (like your bank balance - changes)

### The useState Hook

`useState` is a React Hook that lets you add state to functional components.

```typescript
import { useState } from 'react';

function Counter() {
  // [currentValue, functionToUpdateIt] = useState(initialValue)
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <Text>Count: {count}</Text>
      <Button onPress={() => setCount(count + 1)} title="Increment" />
    </View>
  );
}
```

**Anatomy of useState:**
- `count` → Current value
- `setCount` → Function to update the value
- `useState(0)` → Initial value is 0

### How State Updates Work

When you call the setter function, React:
1. Updates the state value
2. Re-renders the component
3. UI shows the new value

```typescript
const [name, setName] = useState("Torben");

// Later...
setName("Alice"); // Component re-renders with "Alice"
```

### Multiple State Variables

You can use multiple `useState` calls:

```typescript
function EnvelopeForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [color, setColor] = useState("#3b82f6");
  
  // Each has its own state!
}
```

### State vs Props

| Feature | Props | State |
|---------|-------|-------|
| Where from? | Parent component | Component itself |
| Can change? | No (read-only) | Yes (via setter) |
| Triggers re-render? | Yes (when parent updates) | Yes (when state updates) |
| Use case | Pass data down | Track changing data |

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand what state is and why it's needed
- ✅ Use the useState Hook
- ✅ Handle form inputs with state
- ✅ Update UI based on state changes
- ✅ Build an interactive envelope allocation form
- ✅ Manage multiple pieces of state

## 📖 Book Reference

**"React Native in Action" - Chapter 3: Building Your First React Native App**
- Section 3.2: Managing state with useState
- Section 3.3: Handling user input
- Section 3.4: Forms in React Native

## 💻 Code Examples

### Example 1: Simple Counter

```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <View style={styles.container}>
      <Text style={styles.count}>Count: {count}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(count + 1)}
      >
        <Text>Increment</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(count - 1)}
      >
        <Text>Decrement</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(0)}
      >
        <Text>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Example 2: Text Input with State

```typescript
import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';

function NameInput() {
  const [name, setName] = useState("");
  
  return (
    <View>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text>Hello, {name}!</Text>
    </View>
  );
}
```

### Example 3: Controlled Form

```typescript
import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';

function EnvelopeInput() {
  const [envelopeName, setEnvelopeName] = useState("");
  const [amount, setAmount] = useState("");
  
  const handleSubmit = () => {
    console.log("Envelope:", envelopeName, "Amount:", amount);
    // Reset form
    setEnvelopeName("");
    setAmount("");
  };
  
  return (
    <View>
      <TextInput
        value={envelopeName}
        onChangeText={setEnvelopeName}
        placeholder="Envelope name (e.g., Groceries)"
      />
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        keyboardType="numeric"
      />
      <Button title="Add Envelope" onPress={handleSubmit} />
    </View>
  );
}
```

### Example 4: Derived State

```typescript
function BudgetCalculator() {
  const [allocated, setAllocated] = useState(0);
  const [spent, setSpent] = useState(0);
  
  // Derived value - calculated from state
  const remaining = allocated - spent;
  const percentSpent = (spent / allocated) * 100 || 0;
  
  return (
    <View>
      <Text>Allocated: ${allocated}</Text>
      <Text>Spent: ${spent}</Text>
      <Text>Remaining: ${remaining}</Text>
      <Text>{percentSpent.toFixed(0)}% spent</Text>
    </View>
  );
}
```

## 🛠️ Hands-On Exercise

### Goal: Build an Interactive Envelope Allocation Form

Let's create a component where users can allocate money to an envelope and see the results in real-time!

**Step 1: Create AllocateFunds Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/budget/AllocateFunds.tsx`:

```typescript
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';

function AllocateFunds() {
  // State for form inputs
  const [envelopeName, setEnvelopeName] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  
  // State for unallocated funds
  const [unallocatedFunds, setUnallocatedFunds] = useState(1000);
  
  // State for created envelopes
  const [envelopes, setEnvelopes] = useState<Array<{name: string, amount: number}>>([]);
  
  const handleAllocate = () => {
    const amount = parseFloat(allocatedAmount);
    
    // Validation
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
    
    // Update unallocated funds
    setUnallocatedFunds(unallocatedFunds - amount);
    
    // Add new envelope
    setEnvelopes([...envelopes, { name: envelopeName, amount }]);
    
    // Reset form
    setEnvelopeName("");
    setAllocatedAmount("");
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allocate Funds</Text>
      
      {/* Unallocated Funds Display */}
      <View style={styles.fundsCard}>
        <Text style={styles.fundsLabel}>Unallocated Funds</Text>
        <Text style={styles.fundsAmount}>${unallocatedFunds.toFixed(2)}</Text>
      </View>
      
      {/* Allocation Form */}
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
      
      {/* Allocated Envelopes List */}
      {envelopes.length > 0 && (
        <View style={styles.envelopesList}>
          <Text style={styles.listTitle}>Allocated Envelopes</Text>
          {envelopes.map((envelope, index) => (
            <View key={index} style={styles.envelopeItem}>
              <Text style={styles.envelopeName}>{envelope.name}</Text>
              <Text style={styles.envelopeAmount}>
                ${envelope.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  fundsCard: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  fundsLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  fundsAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  envelopesList: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1f2937',
  },
  envelopeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  envelopeName: {
    fontSize: 16,
    color: '#374151',
  },
  envelopeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
});

export default AllocateFunds;
```

**Step 2: Add to Your App**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx`:

```typescript
import { ScrollView, StyleSheet } from 'react-native';
import AllocateFunds from '@/components/budget/AllocateFunds';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <AllocateFunds />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
});
```

**Step 3: Test Your Interactive Form**

```bash
npm start
```

**Try this:**
1. Enter "Groceries" as envelope name
2. Enter "300" as amount
3. Click "Allocate Funds"
4. Watch the unallocated funds decrease!
5. See your new envelope in the list
6. Add more envelopes!

## ✅ Checkpoint

### What You Should See
- Unallocated funds starting at $1,000
- A form with two input fields
- When you allocate funds:
  - Unallocated funds decreases
  - New envelope appears in the list
  - Form resets for next entry

### Can You Answer These?
1. What is the difference between state and props?
2. What does `useState` return?
3. How do you update state?
4. Why can't you directly modify state (e.g., `count = 5`)?
5. What happens when state changes?

### Common Issues

**Issue**: "Cannot update a component while rendering a different component"
- **Solution**: Don't call state setters directly in render. Use event handlers.

**Issue**: State not updating
- **Solution**: Make sure you're calling the setter function, not modifying state directly

**Issue**: Input not updating when typing
- **Solution**: Input needs both `value={state}` AND `onChangeText={setState}`

**Issue**: Numbers being treated as strings
- **Solution**: Use `parseFloat()` or `parseInt()` to convert strings to numbers

## 🚀 Next Steps

### Preview of Lesson 04: Lists and Keys
In the next lesson, you'll learn how to:
- Render dynamic lists efficiently
- Use the .map() function
- Understand keys in React
- Build a transaction history list
- Handle list interactions

### Optional Challenges
1. **Add income**: Create a button to add income to unallocated funds
2. **Delete envelopes**: Add a delete button next to each envelope
3. **Edit envelopes**: Allow clicking an envelope to edit its allocation
4. **Persist data**: Right now, data resets on refresh. We'll fix this in Lesson 10!
5. **Add validation**: Show error messages below inputs instead of alerts

**Example Challenge Solution (Add Income):**
```typescript
const [incomeAmount, setIncomeAmount] = useState("");

const handleAddIncome = () => {
  const amount = parseFloat(incomeAmount);
  if (!isNaN(amount) && amount > 0) {
    setUnallocatedFunds(unallocatedFunds + amount);
    setIncomeAmount("");
  }
};

// In your JSX:
<TextInput
  value={incomeAmount}
  onChangeText={setIncomeAmount}
  placeholder="Income amount"
  keyboardType="decimal-pad"
/>
<Button title="Add Income" onPress={handleAddIncome} />
```

### Key Takeaways
- ✅ State is data that changes over time
- ✅ useState Hook adds state to functional components
- ✅ State updates trigger re-renders
- ✅ Always use setter function, never modify state directly
- ✅ TextInput needs both value and onChangeText
- ✅ Forms can be controlled with state

**Amazing work completing Lesson 03!** You've unlocked interactivity! Your app can now respond to user input. Tomorrow, we'll learn how to efficiently display lists of data.

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐⭐⭐☆☆ Intermediate
**Previous lesson**: [02-props-and-composition.md](./02-props-and-composition.md)
**Next lesson**: [04-lists-and-keys.md](./04-lists-and-keys.md)


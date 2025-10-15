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

**What is a React Hook?**

A **Hook** is a special function that lets you "hook into" React features from functional components.

**Why "Hook"?** The name comes from the idea of "hooking into" React's internal features:

**1. `useState` hooks into React's state system**
- **What it is**: React's system for storing data that can change
- **How it works**: React keeps a hidden array of values in memory for each component
- **Use case**: Track things that change (user input, toggles, counters, form data)
- **Example**: `const [count, setCount] = useState(0)` - stores a number that can increment

**2. `useEffect` hooks into React's lifecycle** *(we'll learn in Lesson 12)*
- **What is "lifecycle"?**: The stages a component goes through: mount → update → unmount
  - **Mount** = Component appears on screen for first time
  - **Update** = Component re-renders when props/state change
  - **Unmount** = Component is removed from screen
- **How it works**: Runs code at specific lifecycle moments
- **Use case**: Load data when component appears, cleanup when it disappears, react to changes
- **Example**: `useEffect(() => { fetchUserData(); }, [])` - load data when component mounts

**3. `useContext` hooks into React's context system** *(we'll learn in Lesson 09)*
- **What is "context"?**: React's system for sharing data across multiple components without passing props through every level
- **How it works**: Creates a "global" data store that any component can access
- **Use case**: Share theme, user info, or settings across the entire app
- **Example**: `const theme = useContext(ThemeContext)` - access app-wide theme without props

**The "Hook" Metaphor:**
Each Hook **connects** to React's internal systems and does heavy lifting for you:

- `useState` → Connects to state storage AND:
  - Stores your value in memory
  - Tracks changes
  - Triggers re-renders when you update
  - Persists value between renders

- `useEffect` → Connects to lifecycle events AND:
  - Runs code when component mounts
  - Re-runs when dependencies change
  - Handles cleanup when component unmounts
  - Manages side effects (API calls, timers, subscriptions)

- `useContext` → Connects to shared data AND:
  - Retrieves global data
  - Subscribes to updates
  - Automatically re-renders when context changes
  - Avoids prop drilling through every component

**They're not passive "grabbers" - they're active managers!**

Hooks **manage the connection** between your code and React's internal systems, doing all the complex work so you don't have to.

**Do Hooks work in both React and React Native?**

Yes! **Hooks are part of React's core**, so they work identically in:
- ✅ React Web (browser apps)
- ✅ React Native (mobile apps)
- ✅ Any React-based platform

Remember from Lesson 01:
```
React (core library with Hooks)
├── React DOM → Web apps (uses same Hooks)
└── React Native → Mobile apps (uses same Hooks)
```

The Hooks (`useState`, `useEffect`, `useContext`) are in the **React library itself**, not in React DOM or React Native. This means:
- You import from `'react'`: `import { useState } from 'react'`
- Same code works on web and mobile
- You learn once, use everywhere!

For now, we'll focus on `useState`. The others come later!

**Architecture: How useState "Hooks Into" React**

Here's what actually happens behind the scenes:

```typescript
// You write this in your component:
const [count, setCount] = useState(0);

// Here's what's happening under the hood:
```

```
1. Component First Renders
   Your Code:              const [count, setCount] = useState(0);
         ↓
   useState Hook:          Calls React's internal state management
         ↓
   React Internal:         Creates state slot → stores 0
         ↓
   Returns to you:         [0, setterFunction]
         ↓
   Your component:         count = 0, setCount = function
         ↓
   Render UI:              <Text>Count: 0</Text>

2. User Clicks Button
   Your Code:              setCount(count + 1)  // setCount(1)
         ↓
   Setter Function:        Tells React "state changed to 1"
         ↓
   React Internal:         Updates state slot → now stores 1
         ↓
   React:                  "State changed! Re-render this component"
         ↓
   Component Re-runs:      const [count, setCount] = useState(0);
         ↓
   useState Hook:          Retrieves from state slot → returns 1 (not 0!)
         ↓
   Returns to you:         [1, setterFunction]
         ↓
   Your component:         count = 1, setCount = function
         ↓
   Render UI:              <Text>Count: 1</Text>  ← User sees update!
```

**The "Hook" Part:**
- `useState` **hooks into** React's internal state storage system
- React maintains a hidden array of state values for each component
- When you call `useState`, it grabs the next slot in that array
- When you call the setter, it **hooks back into** React to trigger a re-render

**Wait - What "storage" are we talking about?**

**Not a database or file!** This is **JavaScript memory** (RAM) while your app is running.

**Where state is actually stored:**
```
Your App Running in Memory:
├── JavaScript Engine (running your code)
├── React Library (JavaScript code)
│   └── Internal State Array:
│       ├── Component #1's states: [0, "Torben", true]
│       ├── Component #2's states: [100, "Groceries"]
│       └── Component #3's states: [500]
└── Native UI (the actual screen)
```

**Concrete example:**
```typescript
function MyComponent() {
  const [count, setCount] = useState(0);       // React stores: slot 0 = 0
  const [name, setName] = useState("Torben");  // React stores: slot 1 = "Torben"
  const [isActive, setIsActive] = useState(true); // React stores: slot 2 = true
  
  // React internally has: [0, "Torben", true]
}
```

**What happens on re-render:**
- Your component function runs again
- React says "Oh, this component has 3 state values stored"
- Each `useState` call retrieves from the next slot: slot 0, slot 1, slot 2
- **This is why order matters!** Hooks must be called in the same order every time

**When state is lost:**
- ❌ When you close the app (memory cleared)
- ❌ When you refresh the app (app restarts)
- ✅ State ONLY lives while app is running in memory

**In Lesson 10**, we'll learn AsyncStorage to save state permanently to the device's disk!

**Why this matters:**
- The state value persists between renders (stored in React's internal system)
- `useState(0)` only sets initial value on first render
- On re-renders, useState retrieves the current value from React's storage
- This is why your component "remembers" state even though the function re-runs!

**Key Rules of Hooks:**
- ✅ Always start with the word "use" (`useState`, `useEffect`, `useThemeColor`)
- ✅ Only call Hooks at the top level of your component (not inside loops, conditions, or nested functions)
- ✅ Only call Hooks from React functional components or custom Hooks

**Before Hooks (old way - class components):**
```typescript
// OLD WAY - Class component (we don't use this anymore)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  render() {
    return <Text>{this.state.count}</Text>;
  }
}
```

**With Hooks (modern way - functional components):**
```typescript
// MODERN WAY - Functional component with Hook (much simpler!)
function Counter() {
  const [count, setCount] = useState(0);
  return <Text>{count}</Text>;
}
```

Hooks made functional components as powerful as classes, but much simpler!

---

**Now, let's use the useState Hook:**

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

**Understanding the Syntax: `const [count, setCount] = useState(0);`**

This looks confusing at first! Let's break it down:

**1. What useState actually returns:**
```typescript
// useState returns an ARRAY with 2 items
const result = useState(0);
// result = [0, function]
//          ↑   ↑
//       value  setter function
```

**2. Array destructuring (JavaScript feature from Lesson 02):**
```typescript
// Without destructuring - access by index
const result = useState(0);
const count = result[0];      // Get first item (the value)
const setCount = result[1];   // Get second item (the function)

// With destructuring - extract both at once
const [count, setCount] = useState(0);
// Same result, much cleaner!
```

**3. Why square brackets `[]`?**
- Square brackets = **array destructuring** (extracting from an array)
- Curly braces `{}` = **object destructuring** (extracting from an object - Lesson 02)

```typescript
// Array destructuring (useState)
const [first, second] = [10, 20];
// first = 10, second = 20

// Object destructuring (props)
const { name, age } = { name: "Torben", age: 30 };
// name = "Torben", age = 30
```

**4. You can name the variables anything:**
```typescript
const [count, setCount] = useState(0);        // Common convention
const [x, setX] = useState(0);                 // Works, but unclear
const [elephantCount, updateElephants] = useState(0);  // Works!
```

**Convention:** Name them `[value, setValue]` where "value" describes what you're storing.

**Complete breakdown:**
```typescript
const [count, setCount] = useState(0);
  │     │       │           │        │
  │     │       │           │        └─ The actual initial value (number 0)
  │     │       │           └─ Function from 'react' library
  │     │       └─ Variable name for setter (we pick this name)
  │     └─ Variable name for the value (we pick this name)
  └─ const = these variable names won't be reassigned
```

**Important: Variable NAME vs VALUE:**
- `count` = the **variable name** (like a box's label - stays the same)
- `0` = the **value** inside that box (can change to 1, 5, 100, etc.)
- When you call `setCount(5)`, the variable name `count` stays the same, but it now holds `5` instead of `0`

**Anatomy of useState:**
- `count` → **Variable name** we choose (stores the current value)
- `setCount` → **Variable name** for the setter function (we choose this too)
- `useState(0)` → Returns array: [currentValue, setterFunction]
- `0` → The **actual initial value** stored in the `count` variable

**The key distinction:**
- `count` is the **variable name** (we pick it)
- `0` is the **actual value** stored in that variable (initially)
- Later, `count` might hold `1`, `2`, `100`, etc. as the value changes

```typescript
const [count, setCount] = useState(0);  
// count variable holds value: 0

setCount(5);  
// Now count variable holds value: 5

setCount(100);  
// Now count variable holds value: 100
```

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

**Visual UI Example - See the Update in Action:**

Here's a complete example showing how the UI changes when state updates:

```typescript
import { View, Text, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

function BalanceDisplay() {
  const [balance, setBalance] = useState(1000);
  
  return (
    <View style={styles.container}>
      {/* Displays current state value - updates automatically when state changes */}
      <Text style={styles.balance}>Balance: ${balance}</Text>
      
      {/* Buttons that update state using embedded arrow functions */}
      <Button 
        title="Add $50" 
        onPress={() => setBalance(balance + 50)}
      />
      <Button 
        title="Spend $25" 
        onPress={() => setBalance(balance - 25)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  balance: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
```

**Code Breakdown:**

**`${balance}` - Template Literal:**
- JavaScript syntax for embedding variables in strings
- If `balance = 1000`, this renders as: `"Balance: $1000"`
- When balance changes, this automatically re-renders with the new value

**`() => setBalance(balance + 50)` - Arrow Function:**
- `() =>` is an **embedded/inline function** - defined right where it's used
- JavaScript ES6 shorthand for creating functions

**Two ways to write functions for event handlers:**

```typescript
// Option 1: Embedded arrow function (for simple one-liners)
<Button onPress={() => setBalance(balance + 50)} />

// Option 2: Separate named function (for complex logic)
const handleAdd = () => {
  setBalance(balance + 50);
};
<Button onPress={handleAdd} />

// Old way (verbose):
<Button onPress={function() { setBalance(balance + 50); }} />
```

**When to use which:**
- ✅ Embedded arrow: Simple one-line actions (like this example)
- ✅ Separate function: Complex logic, multiple lines, reused handlers

**What happens step-by-step:**

```
Initial Render:
├── balance = 1000
├── UI shows: "Balance: $1000"
└── User sees: Balance: $1000

User Taps "Add $50" Button:
├── onPress fires → setBalance(1000 + 50)
├── React updates: balance → 1050
├── React re-renders component
├── UI updates: "Balance: $1050"
└── User sees: Balance: $1050  ← UI automatically updated!

User Taps "Spend $25" Button:
├── onPress fires → setBalance(1050 - 25)
├── React updates: balance → 1025
├── React re-renders component
├── UI updates: "Balance: $1025"
└── User sees: Balance: $1025  ← UI updated again!
```

**The Magic:** You just change the state value with `setBalance()`, and React automatically updates the UI! You don't manually update the `<Text>` component - React handles it for you.

**Bonus:** If you use the same state value in **multiple places**, they ALL update automatically:

```typescript
function BalanceDisplay() {
  const [balance, setBalance] = useState(1000);
  
  return (
    <View>
      <Text>Balance: ${balance}</Text>           {/* Updates */}
      <Text>Current: ${balance}</Text>           {/* Updates */}
      <Text>You have ${balance} dollars</Text>   {/* Updates */}
      <Button onPress={() => setBalance(balance + 50)} />
    </View>
  );
}
// When you tap the button, ALL THREE Text components update!
// One state change → Multiple UI updates
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

**Understanding the TypeScript Syntax: `useState<Array<{name: string, amount: number}>>([])`**

This looks complex! Let's break it down:

```typescript
useState<Array<{name: string, amount: number}>>([])
   │      │                                      │
   │      │                                      └─ Initial value (empty array)
   │      └─ TypeScript Type Parameter (what type of data this state will hold)
   └─ The useState function
```

**The Pieces:**

1. **`useState`** - The Hook function (we know this!)

2. **`<Array<{name: string, amount: number}>>`** - TypeScript Generic Type
   - The `< >` brackets tell TypeScript what type of data to expect
   - This state will hold an **Array** of objects
   - Each object has: `{ name: string, amount: number }`

3. **`[]`** - Initial value (empty array)

**Why use this syntax?**

Without the type, TypeScript can't help you:
```typescript
const [envelopes, setEnvelopes] = useState([]);
// TypeScript: "I don't know what's in this array! 🤷"
// Later: envelopes.map(e => e.name)  
// TypeScript: "Does 'e' have a 'name' property? I don't know!"
```

With the type, TypeScript knows exactly what to expect:
```typescript
const [envelopes, setEnvelopes] = useState<Array<{name: string, amount: number}>>([]);
// TypeScript: "This is an array of objects with 'name' (string) and 'amount' (number)"
// Later: envelopes.map(e => e.name)
// TypeScript: "✅ Yes, 'e' has a 'name' property! Autocomplete: e.name, e.amount"
```

**Simpler Alternative (same thing):**
```typescript
// Using type alias (cleaner)
type Envelope = { name: string; amount: number };
const [envelopes, setEnvelopes] = useState<Envelope[]>([]);

// Or using interface (from Lesson 02)
interface Envelope {
  name: string;
  amount: number;
}
const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
```

**The pattern:**
- `useState<TYPE>(initialValue)`
- Simple types: `useState<number>(0)`, `useState<string>("")`
- Complex types: `useState<Array<Object>>([])`

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


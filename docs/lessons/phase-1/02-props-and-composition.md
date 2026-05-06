# Lesson 02: Props and Component Composition - Create Reusable Envelope Cards

## 📚 Theory

### What are Props?

**Props** (short for "properties") are how you pass data from a parent component to a child component. Think of them like function parameters.

```typescript
// Passing props (like function arguments)
<EnvelopeCard name="Groceries" amount={500} />

// Receiving props (like function parameters)
function EnvelopeCard(props) {
  return <Text>{props.name}: ${props.amount}</Text>;
}
```

**Key Concepts:**
- Props flow **downward** (parent → child only)
- Props are **read-only** (can't be modified by child)
- Props make components **reusable** (same component, different data)

### Destructuring Props

**What is Destructuring?**

Destructuring is a **real JavaScript feature** (ES6) that extracts values from objects or arrays into separate variables.

**It's not React-specific - it works with any JavaScript object:**

```javascript
// Regular object destructuring (plain JavaScript)
const person = { name: "Torben", age: 30, city: "NYC" };

// Without destructuring - access properties one by one
const name = person.name;
const age = person.age;
const city = person.city;

// With destructuring - extract multiple properties at once
const { name, age, city } = person;
// Now you have: name = "Torben", age = 30, city = "NYC"
```

**In React components, props is just an object, so we destructure it the same way:**

```typescript
// Without destructuring - props is an object
function EnvelopeCard(props) {
  return <Text>{props.name}</Text>;  // Access with props.name
}

// With destructuring - extract name from props object
function EnvelopeCard({ name }) {
  return <Text>{name}</Text>;  // Use name directly
}

// This is the same as:
function EnvelopeCard(props) {
  const { name } = props;  // Destructure inside function
  return <Text>{name}</Text>;
}
```

**Why use it?**
- Less typing (`name` vs `props.name`)
- Clearer - you see what props the component uses
- Standard JavaScript - not React magic!

### Props vs Object-Oriented Programming (OOP)

**If you come from OOP (Java, C#, Python classes), here's how props relate:**

**Similarities:**
```typescript
// OOP: Constructor parameters
class Car {
  constructor(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }
}
const myCar = new Car("Toyota", "Camry", 2024);

// React: Component props (similar idea - passing data when creating)
function Car({ brand, model, year }) {
  return <Text>{brand} {model} ({year})</Text>;
}
<Car brand="Toyota" model="Camry" year={2024} />
```

**Key Differences:**

| OOP (Classes) | React (Props) |
|---------------|---------------|
| `this.brand` (mutable - can change) | `props.brand` (immutable - can't change) |
| Two-way: methods can modify internal state | One-way: parent passes down, child can't modify |
| Objects have methods (behavior) | Components just receive data (no "methods") |
| `new Car()` creates instance with state | `<Car />` is called each render, no persistent instance |

**React is NOT Object-Oriented Programming:**
- React uses **Functional Programming** principles
- Components are functions, not classes (we avoid class components now)
- Props are immutable (can't be changed by the child)
- Data flows one direction (parent → child only)

**Think of props like:**
- **Function parameters** (closest analogy) ✅
- ~~Object properties~~ (not quite - props are read-only)
- ~~Constructor arguments~~ (no instance is created)

**Example showing the difference:**
```typescript
// OOP - Object can modify itself
class BankAccount {
  constructor(balance) {
    this.balance = balance;
  }
  
  withdraw(amount) {
    this.balance -= amount;  // Modifies internal state
  }
}

// React - Component CANNOT modify props
function BankAccount({ balance }) {
  const handleWithdraw = () => {
    balance -= 100;  // ❌ ERROR! Can't modify props
    // Instead, you'd tell the parent to update (we'll learn this in Lesson 03)
  }
}
```

**Bottom line:** If you know OOP, think of props as **immutable function parameters**, not object properties.

### TypeScript and Props

TypeScript helps us define what props a component expects:

```typescript
interface EnvelopeCardProps {
  name: string;
  allocated: number;
  spent: number;
}

function EnvelopeCard({ name, allocated, spent }: EnvelopeCardProps) {
  return <Text>{name}</Text>;
}
```

**Why is it called "interface"?**

The word **interface** comes from programming terminology meaning "a contract that defines what something should look like."

**The concept:**
- An **interface** defines the **shape** of an object (what properties it has and their types)
- It's like a blueprint or contract that says "any object following this interface must have these properties"
- It doesn't create anything - it just describes what the object should look like

**Real-world analogy:**
Think of a **power outlet interface**:
- The outlet defines: 2 or 3 prongs, specific voltage, specific shape
- Any plug that matches this interface will work
- The interface doesn't create electricity - it defines the contract

**In TypeScript:**
```typescript
// Interface defines the contract: "Props must have these 3 properties"
interface EnvelopeCardProps {
  name: string;      // Must have a name (text)
  allocated: number; // Must have allocated amount (number)
  spent: number;     // Must have spent amount (number)
}

// This component MUST receive props matching that interface
function EnvelopeCard(props: EnvelopeCardProps) {
  // TypeScript guarantees props.name exists and is a string
  // TypeScript guarantees props.allocated exists and is a number
  // TypeScript guarantees props.spent exists and is a number
}
```

**Why not just call it "Props" or "Type"?**
- `interface` is a TypeScript/programming keyword (like `function`, `const`, `class`)
- It specifically means "defines the structure of an object"
- TypeScript also has `type` which is similar but slightly different (we'll use `interface` for props)

**The naming convention:**
```typescript
interface ComponentNameProps {
  // props definition
}
// Examples:
interface EnvelopeCardProps { ... }
interface ButtonProps { ... }
interface UserCardProps { ... }
```

**Bottom line:** `interface` = "contract defining what shape the props object must have" - it ensures you pass the right data with the right types!

### Component Composition

**Composition** means building complex UIs by combining simple components:

```typescript
<Dashboard>
  <Header />
  <EnvelopeCard />
  <EnvelopeCard />
  <EnvelopeCard />
  <Footer />
</Dashboard>
```

This is like building with LEGO blocks - small pieces combine to create something big!

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Pass data to components using props
- ✅ Use TypeScript interfaces for prop types
- ✅ Destructure props for cleaner code
- ✅ Create reusable components
- ✅ Build multiple envelope cards with different data
- ✅ Understand component composition

## 📖 Book Reference

**"React Native in Action" - Chapter 2: Understanding React**
- Section 2.1: Props and data flow
- Section 2.2: Component composition
- Section 2.3: Thinking in components

## 💻 Code Examples

### Example 1: Basic Props

```typescript
import { View, Text } from 'react-native';

// Component that accepts props
function Greeting({ name }) {
  return <Text>Hello, {name}!</Text>;
}

// Parent component passing props
function App() {
  return (
    <View>
      <Greeting name="Torben" />
      <Greeting name="Alice" />
      <Greeting name="Bob" />
    </View>
  );
}
```

**Result:**
- Hello, Torben!
- Hello, Alice!
- Hello, Bob!

### Example 2: Multiple Props with TypeScript

```typescript
import { View, Text } from 'react-native';

interface UserCardProps {
  name: string;
  age: number;
  isAdmin: boolean;
}

function UserCard({ name, age, isAdmin }: UserCardProps) {
  return (
    <View>
      <Text>{name}</Text>
      <Text>Age: {age}</Text>
      {isAdmin && <Text>👑 Admin</Text>}
    </View>
  );
}

// Usage
function App() {
  return (
    <View>
      <UserCard name="Torben" age={30} isAdmin={true} />
      <UserCard name="Alice" age={25} isAdmin={false} />
    </View>
  );
}
```

### Example 3: Calculated Props

```typescript
import { View, Text } from 'react-native';

interface EnvelopeProps {
  name: string;
  allocated: number;
  spent: number;
}

function EnvelopeCard({ name, allocated, spent }: EnvelopeProps) {
  const remaining = allocated - spent;
  const percentSpent = (spent / allocated) * 100;
  
  return (
    <View>
      <Text>{name}</Text>
      <Text>Allocated: ${allocated}</Text>
      <Text>Spent: ${spent}</Text>
      <Text>Remaining: ${remaining}</Text>
      <Text>Spent: {percentSpent.toFixed(0)}%</Text>
    </View>
  );
}
```

### Example 4: Default Props

```typescript
interface ButtonProps {
  title: string;
  color?: string; // Optional prop (note the ?)
}

function Button({ title, color = 'blue' }: ButtonProps) {
  return (
    <View style={{ backgroundColor: color }}>
      <Text>{title}</Text>
    </View>
  );
}

// Usage
<Button title="Save" />              // Uses default blue
<Button title="Delete" color="red" /> // Uses red
```

## 🛠️ Hands-On Exercise

### Goal: Create a Reusable Envelope Card Component

Let's rebuild the EnvelopeCard from Lesson 01 to accept props, making it truly reusable!

**Step 1: Update EnvelopeCard Component**

Update `/Users/torbenanderson/development/projects/learn-react-native/components/budget/EnvelopeCard.tsx`:

```typescript
import { View, Text, StyleSheet } from 'react-native';

// Define the props interface
interface EnvelopeCardProps {
  name: string;
  icon: string;
  allocated: number;
  spent: number;
  color?: string; // Optional color prop
}

function EnvelopeCard({ 
  name, 
  icon, 
  allocated, 
  spent, 
  color = '#3b82f6' 
}: EnvelopeCardProps) {
  // Calculate derived values
  const remaining = allocated - spent;
  const percentSpent = allocated > 0 ? (spent / allocated) * 100 : 0;
  
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.name}>{name}</Text>
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
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${percentSpent}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.percentage}>{percentSpent.toFixed(0)}% spent</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  amounts: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  lowAmount: {
    color: '#ef4444',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
});

export default EnvelopeCard;
```

**Step 2: Update Home Screen**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx`:

```typescript
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EnvelopeCard from '@/components/budget/EnvelopeCard';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Budget Envelopes</Text>
      
      {/* Multiple envelope cards with different data */}
      <EnvelopeCard
        name="Groceries"
        icon="🛒"
        allocated={500}
        spent={325.50}
        color="#10b981"
      />
      
      <EnvelopeCard
        name="Rent"
        icon="🏠"
        allocated={1200}
        spent={1200}
        color="#3b82f6"
      />
      
      <EnvelopeCard
        name="Gas"
        icon="⛽"
        allocated={150}
        spent={89.25}
        color="#f59e0b"
      />
      
      <EnvelopeCard
        name="Entertainment"
        icon="🎬"
        allocated={200}
        spent={175.80}
        color="#8b5cf6"
      />
      
      <EnvelopeCard
        name="Dining Out"
        icon="🍔"
        allocated={100}
        spent={95.50}
        color="#ef4444"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
});
```

**Step 3: Run Your App**

```bash
npm start
```

You should now see 5 beautiful envelope cards, each with different data!

## ✅ Checkpoint

### What You Should See
- A scrollable list of 5 envelope cards
- Each card shows:
  - Icon and name
  - Allocated, spent, and remaining amounts
  - A progress bar showing percentage spent
  - Different colors for each envelope
- The "Dining Out" remaining amount should be red (less than $50)

### Can You Answer These?
1. What are props and why are they useful?
2. How do you define prop types with TypeScript?
3. What's the difference between required and optional props?
4. Why is component reusability important?

### Common Issues

**Issue**: "Property 'name' does not exist on type '{}'"
- **Solution**: Make sure you defined the interface with all required props

**Issue**: "Type 'number' is not assignable to type 'string'"
- **Solution**: Check your prop types - make sure allocated/spent are `number` not `string`

**Issue**: Cards look wrong or overlapping
- **Solution**: Make sure your parent uses `<ScrollView>` not `<View>`

## 🚀 Next Steps

### Preview of Lesson 03: State with useState
In the next lesson, you'll learn how to:
- Add interactivity to components
- Manage changing data with useState
- Handle user input
- Update the UI when data changes
- Build an interactive envelope allocation form

### Optional Challenges
1. **Add more props**: Add a `lastTransaction` prop that shows the last expense
2. **Conditional icons**: Show ⚠️ icon if envelope is almost empty (< 10% remaining)
3. **Custom formatting**: Create a helper function to format currency consistently
4. **Add totals**: Create a `BudgetSummary` component that shows total allocated, spent, and remaining across all envelopes

**Example Challenge Solution:**
```typescript
// BudgetSummary component
interface BudgetSummaryProps {
  totalAllocated: number;
  totalSpent: number;
}

function BudgetSummary({ totalAllocated, totalSpent }: BudgetSummaryProps) {
  const totalRemaining = totalAllocated - totalSpent;
  
  return (
    <View style={styles.summary}>
      <Text style={styles.summaryTitle}>Budget Overview</Text>
      <Text>Total Allocated: ${totalAllocated}</Text>
      <Text>Total Spent: ${totalSpent}</Text>
      <Text>Total Remaining: ${totalRemaining}</Text>
    </View>
  );
}
```

### Key Takeaways
- ✅ Props make components reusable with different data
- ✅ TypeScript interfaces define prop types
- ✅ Optional props use `?` in the interface
- ✅ Default values can be set in the destructuring
- ✅ Props flow downward from parent to child
- ✅ Composition builds complex UIs from simple components

**Excellent work completing Lesson 02!** You now understand one of the most important concepts in React: props. Tomorrow, we'll add interactivity with state!

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐⭐☆☆☆ Beginner
**Previous lesson**: [01-jsx-and-components.md](./01-jsx-and-components.md)
**Next lesson**: [03-state-with-usestate.md](./03-state-with-usestate.md)


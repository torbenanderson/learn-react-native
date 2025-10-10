# Lesson 01: JSX and Components - Build Your First Envelope Budget Screen

## 📚 Theory

### What is JSX?

**JSX** (JavaScript XML) is a syntax extension for JavaScript that looks like HTML but lives in your JavaScript code. It's the primary way we describe user interfaces in React and React Native.

**Why is this the primary way?**

Without JSX, you'd have to create UI using nested function calls:
```typescript
// Without JSX - hard to read!
React.createElement(View, null,
  React.createElement(Text, null, "Hello"),
  React.createElement(Text, null, "World")
);

// With JSX - structure is immediately clear!
<View>
  <Text>Hello</Text>
  <Text>World</Text>
</View>
```

**Benefits:**
- **Visual clarity**: The nested structure matches how the UI actually looks on screen - parent/child relationships are obvious from indentation
- **HTML-like but more powerful**: You get the readability of HTML, but you can embed JavaScript logic, variables, and functions directly in the markup (which plain HTML can't do)
- **Type safety**: With TypeScript, you get autocomplete and error checking as you type
- **Compile-time errors**: Catches mistakes (like typos in component names) before your app runs
- **Less code**: Compare the two examples above - JSX is cleaner and easier to maintain

```typescript
// This is JSX - looks like HTML!
// We're creating a variable (const) that stores a React Native Text component
const greeting = <Text>Hello, World!</Text>;
```

**Key Differences from HTML:**

**1. Styling - Three different approaches:**

```html
<!-- HTML - uses class and CSS -->
<style>
  .button {
    background-color: blue;
    padding: 10px;
    border-radius: 5px;
  }
</style>
<div class="button">Click me</div>
```

```jsx
// React Web - uses className and CSS
<style>
  .button {
    background-color: blue;
    padding: 10px;
    border-radius: 5px;
  }
</style>
<div className="button">Click me</div>
```

```typescript
// React Native - uses style prop with JavaScript object (no CSS!)
<View style={{
  backgroundColor: 'blue',
  padding: 10,
  borderRadius: 5,
}}>
  <Text>Click me</Text>
</View>
```

Notice: React Native uses **camelCase** (`backgroundColor`) not **kebab-case** (`background-color`), and values are often **numbers** without units.

**2. Other Key Differences:**
- **Self-closing tags**: All tags must be closed: `<Image />` not just `<Image>`
- **Event names**: Uses camelCase for props: HTML's `onclick` becomes `onClick` in React Web, and `onPress` in React Native
- **JavaScript embedding**: Can embed JavaScript with `{curly braces}` directly in the markup

**Embedding JavaScript - HTML vs JSX:**

```html
<!-- Traditional HTML - JavaScript is separate from markup -->
<div id="greeting"></div>
<script>
  const userName = "Torben";
  const balance = 1250.50;
  document.getElementById('greeting').innerHTML = 
    `Welcome, ${userName}! Your balance: $${balance}`;
</script>
```

```typescript
// JSX - JavaScript lives right in the markup with {}
function Greeting() {
  const userName = "Torben";
  const balance = 1250.50;
  
  return (
    <View>
      <Text>Welcome, {userName}!</Text>
      <Text>Your balance: ${balance}</Text>
    </View>
  );
}
```

Notice how JSX lets you use `{userName}` and `{balance}` directly in the markup, while HTML requires separate script tags and DOM manipulation.

### What Happens to JSX at Compile Time?

**JSX is not valid JavaScript!** Browsers can't understand it directly. It gets compiled (transformed) into regular JavaScript before your app runs.

```typescript
// What you write (JSX):
<View>
  <Text>Hello, {userName}!</Text>
</View>

// What it compiles to (JavaScript):
React.createElement(View, null,
  React.createElement(Text, null, 'Hello, ', userName, '!')
);
```

**Understanding React and Browsers:**

**What is React?**
- React is a **JavaScript library** (collection of JavaScript code)
- It's not built into browsers - you include it in your project just like any other JavaScript file
- `React.createElement()` is just a regular JavaScript function from the React library

**How do browsers support React?**
They don't! Browsers only understand JavaScript, HTML, and CSS. Here's what actually happens:

1. **You write JSX** in your code files
2. **Babel compiles** JSX → `React.createElement()` calls (these are just regular JavaScript function calls)
3. **React library** (JavaScript code) runs in the browser and processes those `createElement()` calls
4. **React creates** actual DOM elements (the HTML that browsers understand)
5. **Browser displays** the HTML/CSS

```
JSX → Babel → JavaScript (React.createElement) → React Library → DOM → Browser Display
```

**The key point:** Browsers don't "support React" - they support JavaScript, and React IS JavaScript. When you include React in your project, you're just including more JavaScript code that happens to be really good at building UIs.

**Why does this matter?**
- JSX is just "syntactic sugar" - a nicer way to write `React.createElement()`
- Understanding this helps debug errors (error messages sometimes reference `createElement`)
- You can mix JSX and `createElement()` if needed (though JSX is almost always better)
- Knowing React is "just JavaScript" helps you understand that everything React does, you could do with vanilla JavaScript (it would just be much harder!)

### What are Components?

**Components** are the building blocks of React Native apps. Think of them as custom, reusable UI elements.

```typescript
// This is a component - a function that returns JSX
function Welcome() {
  return <Text>Welcome to Budget App!</Text>;
}
```

**Two Types of Components:**

1. **Functional Components** (we'll use these)
   ```typescript
   function MyComponent() {
     return <View><Text>Hello</Text></View>;
   }
   ```

2. **Class Components** (older style, we won't use)
   ```typescript
   class MyComponent extends React.Component {
     render() {
       return <View><Text>Hello</Text></View>;
     }
   }
   ```

### React Native vs React Web

**React Web (HTML):**
```jsx
<div>
  <h1>Title</h1>
  <p>Paragraph</p>
  <button>Click me</button>
</div>
```

**React Native (Mobile):**
```tsx
<View>
  <Text>Title</Text>
  <Text>Paragraph</Text>
  <TouchableOpacity><Text>Click me</Text></TouchableOpacity>
</View>
```

**Core React Native Components:**
- `<View>` → Like `<div>` - container for other components
- `<Text>` → All text must be in `<Text>` tags
- `<TouchableOpacity>` → Like `<button>` - makes things tappable
- `<Image>` → Displays images
- `<ScrollView>` → Makes content scrollable
- `<TextInput>` → Input fields

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand what JSX is and how it works
- ✅ Write your first functional component
- ✅ Use React Native's core components
- ✅ Embed JavaScript expressions in JSX
- ✅ Build a simple envelope budget screen

## 📖 Book Reference

**"React Native in Action" - Chapter 1: Getting Started with React Native**
- Section 1.3: Understanding JSX
- Section 1.4: Components in React Native

## 💻 Code Examples

### Example 1: Your First Component

```typescript
import { View, Text } from 'react-native';

function HelloWorld() {
  return (
    <View>
      <Text>Hello, World!</Text>
    </View>
  );
}

export default HelloWorld;
```

**Explanation:**
- `import`: Brings in React Native components we need
- `function HelloWorld()`: Declares a new component
- `return`: Returns the JSX to display
- `<View>`: Container component
- `<Text>`: Displays text
- `export default`: Makes component available to other files

### Example 2: Embedding JavaScript in JSX

```typescript
import { View, Text } from 'react-native';

function WelcomeMessage() {
  const userName = "Torben";
  const balance = 1250.50;
  
  return (
    <View>
      <Text>Welcome, {userName}!</Text>
      <Text>Your balance: ${balance}</Text>
    </View>
  );
}
```

**Explanation:**
- Use `{}` to embed JavaScript expressions in JSX
- Variables, calculations, function calls all work inside `{}`

**Why Embed JavaScript? When Would You Do This?**

**The Problem Without It:**
```typescript
// Without JavaScript embedding - STATIC and USELESS
function WelcomeMessage() {
  return (
    <View>
      <Text>Welcome, Torben!</Text>
      <Text>Your balance: $1250.50</Text>
    </View>
  );
}
// Problem: This is hardcoded! Every user sees "Torben" and "$1250.50"
```

**Design Reasons to Embed JavaScript:**

1. **Dynamic Data Display** (Most Common)
   - Display user-specific data (names, balances, preferences)
   - Show data from APIs or databases
   - Update UI when data changes
   ```typescript
   <Text>Welcome, {currentUser.name}!</Text>  // Different for each user
   ```

2. **Calculations & Formatting**
   - Perform math in real-time
   - Format dates, currency, percentages
   ```typescript
   <Text>Remaining: ${allocated - spent}</Text>  // Live calculation
   <Text>Due: {formatDate(dueDate)}</Text>       // Format function
   ```

3. **Conditional Display**
   - Show/hide content based on conditions
   - Display different messages based on state
   ```typescript
   <Text>{balance > 0 ? "You're good!" : "Low balance!"}</Text>
   ```

4. **Reusability**
   - Same component, different data
   ```typescript
   <WelcomeMessage userName="Torben" balance={1250} />
   <WelcomeMessage userName="Alice" balance={3400} />
   ```

**Architectural Decision:**
- **DON'T embed JavaScript**: When displaying truly static content (like app titles, labels)
- **DO embed JavaScript**: Whenever data can change, varies by user, or comes from outside the component

**Wait - Why Doesn't JSX Just Provide This Built-In?**

Great question! JSX is **intentionally minimal**. Here's why:

**JSX Philosophy:** JSX only handles the **structure** (what elements to create). JavaScript handles the **logic** (what data to show, when to show it).

**Compare to other template languages:**
```html
<!-- Angular Template - special template syntax -->
<div *ngIf="isLoggedIn">Welcome</div>
<div *ngFor="let item of items">{{item}}</div>

<!-- Vue Template - special template syntax -->
<div v-if="isLoggedIn">Welcome</div>
<div v-for="item in items">{{item}}</div>

<!-- JSX - just use JavaScript! -->
{isLoggedIn && <View><Text>Welcome</Text></View>}
{items.map(item => <Text key={item.id}>{item}</Text>)}
```

**Benefits of JSX's approach:**
- ✅ **No new syntax to learn** - if you know JavaScript, you know JSX logic
- ✅ **Full JavaScript power** - use any JavaScript feature (functions, destructuring, spread, etc.)
- ✅ **Better tooling** - IDEs understand JavaScript, so you get autocomplete and type checking
- ✅ **Simpler mental model** - JSX is just JavaScript, not a separate template language

**The trade-off:** You need to use `{}` to tell JSX "hey, this is JavaScript, not text". But in return, you get the full power of JavaScript instead of learning limited template syntax.

**Real-World Example for Budget App:**
```typescript
// Good architectural choice - data-driven UI
function EnvelopeSummary({ envelope }) {
  const remaining = envelope.allocated - envelope.spent;
  const percentUsed = (envelope.spent / envelope.allocated) * 100;
  const isLow = remaining < 50;
  
  return (
    <View>
      <Text>{envelope.name}</Text>
      <Text>Remaining: ${remaining.toFixed(2)}</Text>
      <Text>{percentUsed.toFixed(0)}% used</Text>
      {isLow && <Text style={{color: 'red'}}>⚠️ Low funds!</Text>}
    </View>
  );
}
```

This component is **reusable** (works for any envelope), **dynamic** (updates when data changes), and **smart** (shows warnings when needed).

### Example 3: Multiple Components

```typescript
import { View, Text } from 'react-native';

// Small component for displaying balance
function BalanceDisplay() {
  return <Text>Balance: $1,250.50</Text>;
}

// Main component that uses BalanceDisplay
function Dashboard() {
  return (
    <View>
      <Text>Budget Dashboard</Text>
      <BalanceDisplay />
    </View>
  );
}

export default Dashboard;
```

**Explanation:**
- Components can use other components
- This is called "composition"
- Keeps code organized and reusable

### Example 4: Conditional Rendering

```typescript
import { View, Text } from 'react-native';

function EnvelopeStatus() {
  const hasMoneyLeft = true;
  
  return (
    <View>
      {hasMoneyLeft ? (
        <Text>You have money left! ✅</Text>
      ) : (
        <Text>Envelope is empty ❌</Text>
      )}
    </View>
  );
}
```

**Explanation:**
- Use ternary operator `? :` for conditional rendering
- Show different UI based on data

## 🛠️ Hands-On Exercise

### Goal: Build Your First Envelope Card Component

Let's create a simple component that displays information about a budget envelope.

**Step 1: Create the Component File**

Create a new file: `/Users/torbenanderson/development/projects/learn-react-native/components/budget/EnvelopeCard.tsx`

```typescript
import { View, Text } from 'react-native';

function EnvelopeCard() {
  // Step 2: Define envelope data
  const envelopeName = "Groceries";
  const allocated = 500;
  const spent = 325;
  const remaining = allocated - spent;
  
  // Step 3: Return the UI
  return (
    <View>
      <Text>{envelopeName}</Text>
      <Text>Allocated: ${allocated}</Text>
      <Text>Spent: ${spent}</Text>
      <Text>Remaining: ${remaining}</Text>
    </View>
  );
}

export default EnvelopeCard;
```

**Step 2: Use Your Component**

Open `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx` and replace its contents:

```typescript
import { View, Text, StyleSheet } from 'react-native';
import EnvelopeCard from '@/components/budget/EnvelopeCard';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Budget Envelopes</Text>
      <EnvelopeCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
```

**Step 3: Run Your App**

```bash
npm start
# Press 'w' for web, 'i' for iOS, or 'a' for Android
```

**Step 4: Experiment!**

Try changing:
- The envelope name
- The allocated/spent amounts
- Add another `<EnvelopeCard />` to show multiple envelopes

## ✅ Checkpoint

### What You Should See
- A screen with the title "My Budget Envelopes"
- An envelope card showing:
  - Envelope name: "Groceries"
  - Allocated: $500
  - Spent: $325
  - Remaining: $175

### Can You Answer These?
1. What is JSX?
2. What's the difference between `<View>` and `<Text>`?
3. How do you embed JavaScript in JSX?
4. What does `export default` do?

### Common Issues

**Issue**: "Text strings must be rendered within a <Text> component"
- **Solution**: Wrap all text in `<Text>` tags, even single words

**Issue**: "Cannot find module '@/components/budget/EnvelopeCard'"
- **Solution**: Make sure you created the file in the correct location

**Issue**: "Adjacent JSX elements must be wrapped in an enclosing tag"
- **Solution**: Wrap multiple elements in a `<View>` or React Fragment `<>`

## 🚀 Next Steps

### Preview of Lesson 02: Props and Component Composition
In the next lesson, you'll learn how to:
- Pass data to components using props
- Make components reusable
- Create multiple envelope cards with different data
- Build a more flexible component architecture

### Optional Challenges
1. **Add more envelopes**: Create 3 different envelope cards with different names and amounts
2. **Add emoji icons**: Put emoji next to each envelope name (🏠 Rent, 🍔 Groceries, ⛽ Gas)
3. **Calculate percentage**: Show what percentage of the envelope has been spent
4. **Conditional styling**: Show "Remaining" in red if it's below $50

### Key Takeaways
- ✅ JSX is JavaScript that looks like HTML
- ✅ Components are reusable UI building blocks
- ✅ Use `{}` to embed JavaScript in JSX
- ✅ React Native uses `<View>` and `<Text>` instead of HTML tags
- ✅ Always export your components to use them elsewhere

**Great job completing Lesson 01!** You've taken your first step into React Native development. Tomorrow, we'll make these components truly reusable with props.

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐☆☆☆☆ Beginner
**Next lesson**: [02-props-and-composition.md](./02-props-and-composition.md)


# Lesson 01: JSX and Components - Build Your First Envelope Budget Screen

## 📚 Theory

### TypeScript vs JavaScript - What Are We Actually Writing?

Before we dive into JSX, let's clarify what language you're actually using in this project.

**JavaScript** is the programming language that runs in browsers and on servers (via Node.js). It's what powers the web and mobile apps.

**TypeScript** is a superset of JavaScript created by Microsoft. Think of it as "JavaScript with extra features."

**The Relationship:**
```
TypeScript = JavaScript + Optional Type Annotations + Extra Features
```

**Key Differences:**

```javascript
// JavaScript (.js or .jsx files)
function greet(name) {
  return "Hello, " + name;
}
greet("Torben");        // ✅ Works
greet(123);             // ✅ Also works (but might cause bugs!)
greet();                // ✅ Works but returns "Hello, undefined"
```

```typescript
// TypeScript (.ts or .tsx files)
function greet(name: string): string {
  return "Hello, " + name;
}
greet("Torben");        // ✅ Works
greet(123);             // ❌ ERROR: Argument must be a string
greet();                // ❌ ERROR: Missing required argument
```

**Why Use TypeScript?**

1. **Catch Errors Before Runtime**
   - JavaScript finds errors when code runs (too late!)
   - TypeScript finds errors as you type (save hours of debugging)

2. **Better Autocomplete**
   - Your editor knows what properties/methods are available
   - Suggests valid options as you type

3. **Self-Documenting Code**
   - Types show what data a function expects
   - Easier for others (and future you) to understand

4. **Refactoring Safety**
   - Rename a variable → TypeScript updates all uses
   - Change a function signature → TypeScript shows what breaks

**TypeScript in This Project:**

Notice your files end in `.tsx` (not `.jsx`):
- `.tsx` = TypeScript + JSX (React syntax)
- `.jsx` = JavaScript + JSX
- `.ts` = TypeScript (no JSX)
- `.js` = JavaScript (no JSX)

**The Good News:** You can write TypeScript that looks exactly like JavaScript! The type annotations are optional:

```typescript
// This is valid TypeScript (but you're not using TypeScript's features)
function add(a, b) {
  return a + b;
}

// This is BETTER TypeScript (using type safety)
function add(a: number, b: number): number {
  return a + b;
}
```

**For This Curriculum:** We'll start with minimal TypeScript (looks like JavaScript) and gradually add types as you get comfortable.

### What is JSX?

**JSX** (JavaScript XML) is a syntax extension for JavaScript that looks like HTML but lives in your JavaScript code. It's the primary way we describe user interfaces in React and React Native.

> **💡 JSX Philosophy:** JSX handles **structure** (elements), JavaScript handles **logic** (data/conditions)

This separation of concerns is the key to understanding JSX!

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

**JSX is not valid JavaScript!** Browsers and JavaScript engines can't understand it directly. It gets compiled (transformed) into regular JavaScript before your app runs.

**And if you're using TypeScript (`.tsx` files), there's an extra compilation step!**

```typescript
// What you write (TypeScript + JSX):
<View>
  <Text>Hello, {userName}!</Text>
</View>

// What it compiles to (JavaScript):
React.createElement(View, null,
  React.createElement(Text, null, 'Hello, ', userName, '!')
);
```

**The Full Compilation Pipeline:**

```
Your .tsx file (TypeScript + JSX)
        ↓
TypeScript Compiler (tsc)
        ↓
JavaScript with JSX (still needs more processing)
        ↓
Babel (JSX Transformer)
        ↓
Plain JavaScript (React.createElement calls)
        ↓
JavaScript Engine (Browser/React Native) runs it
```

**In Reality:** Modern build tools (like Metro for React Native, or Webpack for React Web) handle both steps automatically. You write `.tsx`, press save, and it just works!

**Understanding React and Browsers:**

**What is React?**
- React is a **JavaScript library** (collection of JavaScript code)
- It's not built into browsers - you include it in your project just like any other JavaScript file
- `React.createElement()` is just a regular JavaScript function from the React library
- React works with both JavaScript and TypeScript (TypeScript just compiles to JavaScript first)

**How do browsers support React?**
They don't! Browsers only understand JavaScript, HTML, and CSS. Here's what actually happens:

1. **You write TypeScript + JSX** in your `.tsx` files
2. **TypeScript compiler** strips away type annotations → produces JavaScript + JSX
3. **Babel compiles** JSX → `React.createElement()` calls (these are just regular JavaScript function calls)
4. **React library** (JavaScript code) runs in the browser and processes those `createElement()` calls
5. **React creates** actual DOM elements (the HTML that browsers understand)
6. **Browser displays** the HTML/CSS

```
For TypeScript + React:
.tsx → TypeScript Compiler → JavaScript + JSX → Babel → JavaScript (React.createElement) → React Library → DOM → Browser Display

For JavaScript + React (simpler):
.jsx → Babel → JavaScript (React.createElement) → React Library → DOM → Browser Display
```

**The key points:**
- Browsers don't "support React" or "support TypeScript" - they only support JavaScript
- React IS JavaScript (a library of JavaScript functions)
- TypeScript compiles TO JavaScript (types are removed at compile time)
- When you include React in your project, you're just including more JavaScript code that happens to be really good at building UIs

**Why does this matter?**
- JSX is just "syntactic sugar" - a nicer way to write `React.createElement()`
- TypeScript is also "syntactic sugar" - it adds type checking but compiles away to regular JavaScript
- Understanding this helps debug errors (error messages sometimes reference `createElement` or show JavaScript even though you wrote TypeScript)
- You can mix JSX and `createElement()` if needed (though JSX is almost always better)
- Knowing React is "just JavaScript" helps you understand that everything React does, you could do with vanilla JavaScript (it would just be much harder!)
- **Types only exist during development** - they're completely removed from the final app (no runtime cost!)

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

### React vs React Native - Understanding the Relationship

**What is React?**
- React is a **JavaScript library** for building user interfaces
- It provides concepts: components, JSX, hooks, state management
- React itself doesn't know about web OR mobile - it's just the core ideas
- **Works with both JavaScript and TypeScript**

**What is React Native?**
- React Native is a **framework** that adapts React's concepts for mobile
- Uses the same React concepts (components, JSX, hooks)
- But creates **native mobile UI** instead of HTML
- **Also works with both JavaScript and TypeScript** (this project uses TypeScript!)

**Where Does TypeScript Fit?**

TypeScript is a layer that sits on top of everything. You can use TypeScript with:
- ✅ Plain JavaScript projects
- ✅ React Web projects
- ✅ React Native projects (like this one!)
- ✅ Node.js backend projects
- ✅ Any JavaScript code

**The Technology Stacks:**

```
WEB APP (with TypeScript):
Your Code (React components in .tsx files)
└── TypeScript (type checking & compilation)
    └── React (JavaScript library)
        └── React DOM (web adapter)
            └── Browser (renders HTML/CSS)
                └── User sees web page

MOBILE APP (with Expo + TypeScript):
Your Code (React Native components in .tsx files)
└── TypeScript (type checking & compilation)
    └── React (same core concepts!)
        └── React Native (mobile adapter)
            └── JavaScript Bridge
                └── iOS (Swift/Obj-C) or Android (Kotlin/Java)
                    └── Native UI Components
                        └── User sees native mobile UI
```

**Key Insight:** TypeScript is not a framework or library - it's a **language** (JavaScript with types) that compiles to JavaScript. Everything else (React, React Native) runs on the compiled JavaScript output.

**Breaking Down the Pieces:**

**1. React Native (mobile adapter - What is this exactly?)**
- **It's not magic - it's actual JavaScript code!**
- React Native is a collection of JavaScript libraries and native code that:
  - Provides mobile components (`View`, `Text`, `Image`, etc.)
  - Maps each component to native platform equivalents
  - Contains the bridge code that communicates with iOS/Android

- **Example mapping**:
  ```
  You write:     <View>              (React Native component)
  React Native:  Maps it to...
  iOS:          UIView               (native Swift/Obj-C class)
  Android:      android.view.View    (native Kotlin/Java class)
  ```

- **Why "adapter"?**: It adapts (translates) React's concepts into native mobile components

**2. JavaScript Bridge (Runs at Runtime)**
- **When does this happen?** RUNTIME - while your app is running on a phone/simulator
- **The Problem**: Your JavaScript code runs in a JavaScript engine, but native UI runs in Swift/Kotlin - they can't talk directly
- **The Solution**: A bridge that passes messages back and forth **while the app is running**

- **How it works at runtime**:
  ```
  App is running on your phone...
  
  You tap a button →
  Native iOS:          "User tapped at coordinates (100, 200)"
  JavaScript Bridge:   [Passes message to JavaScript]
  Your JavaScript:     handlePress() function runs
  JavaScript:          "Update the UI - show a new screen"
  JavaScript Bridge:   [Passes message back to native]
  Native iOS:          Creates and shows the new screen
  
  All of this happens in milliseconds!
  ```

- **Think of it like**: A live translator at a meeting, constantly translating between two languages in real-time

**Visual Example:**
```
<View style={{backgroundColor: 'blue'}}>  ← Your JavaScript code
    ↓
React Native: "Create a View with blue background"
    ↓
JavaScript Bridge: [Sends message]
    ↓
iOS: Creates actual UIView (blue rectangle on screen)
```

**Key Points:**
- ✅ **React** = Core ideas (components, JSX, state, hooks)
- ✅ **React DOM** = Adapts React for browsers (creates HTML)
- ✅ **React Native** = Adapts React for mobile (creates native UI)
- ✅ **JavaScript Bridge** = Communication layer between JavaScript and native code
- ✅ **Expo** = Development tools on top of React Native
- ✅ You write JavaScript, but get **real native mobile components**!

**Why "React Native"?**
It's called "React Native" because it uses React's concepts to build **native** mobile apps (not web apps running in a mobile browser).

### React Native vs React Web - Code Comparison

**React Web (HTML):**
```jsx
<div>
  <h1>Title</h1>
  <p>Paragraph</p>
  <button>Click me</button>
</div>
```

**React Native (Mobile - Native UI):**
```tsx
<View>
  <Text>Title</Text>
  <Text>Paragraph</Text>
  <TouchableOpacity><Text>Click me</Text></TouchableOpacity>
</View>
```

Same React concepts, different components!

**Core React Native Components:**
- `<View>` → Like `<div>` - container for other components
- `<Text>` → All text must be in `<Text>` tags
- `<TouchableOpacity>` → Like `<button>` - makes things tappable
- `<Image>` → Displays images
- `<ScrollView>` → Makes content scrollable
- `<TextInput>` → Input fields

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand what TypeScript is and how it relates to JavaScript
- ✅ Understand what JSX is and how it works
- ✅ Know how TypeScript, JSX, React, and React Native work together
- ✅ Write your first functional component
- ✅ Use React Native's core components
- ✅ Embed JavaScript expressions in JSX
- ✅ Build a simple envelope budget screen

## 📖 Book Reference

**"React Native in Action" - Chapter 1: Getting Started with React Native**
- Section 1.3: Understanding JSX
- Section 1.4: Components in React Native

## 💻 Code Examples

**Note on Code Syntax:** All examples use TypeScript (`.tsx` files). Don't worry about the TypeScript-specific syntax yet - these examples look almost identical to JavaScript. We'll introduce type annotations gradually as you progress.

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

**This looks like JavaScript because:** We're not using TypeScript-specific features yet! The file is `.tsx`, but the code itself doesn't use type annotations. This is perfectly valid TypeScript.

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

### Example 5: Adding TypeScript Type Annotations (Preview)

Here's how the same component looks with TypeScript types added:

```typescript
import { View, Text } from 'react-native';

// TypeScript version - with type annotations
function EnvelopeStatus(): JSX.Element {
  const hasMoneyLeft: boolean = true;
  
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

**New TypeScript Features:**
- `: JSX.Element` - tells TypeScript this function returns JSX
- `: boolean` - tells TypeScript this variable is a boolean
- These annotations help catch errors and provide better autocomplete

**Don't worry about adding these yet!** We'll introduce type annotations gradually in later lessons. For now, just know that TypeScript lets you add these optional hints about what type of data you're working with.

## 🛠️ Hands-On Exercise

### Goal: Build Your First Envelope Card Component

Let's create a simple component that displays information about a budget envelope.

**Prerequisites: Is React Native Installed?**

Before you can use `import { View, Text } from 'react-native'`, React Native needs to be installed in your project.

**Check if it's already installed:**

```bash
# In your project root, check package.json
cat package.json | grep react-native
```

You should see something like:
```json
"react-native": "0.79.5"
```

**If React Native is NOT installed:**

This repo was set up with **Expo**, so React Native should already be in `package.json`.

**Wait - What is Expo? Does React Native still work with Expo?**

Yes! React Native absolutely still works. Here's how they relate:

**React Native** = The core framework for building mobile apps with JavaScript
- Provides components like `View`, `Text`, `Image`
- Handles the bridge between JavaScript and native iOS/Android code

**Expo** = A set of tools and services built ON TOP OF React Native
- Makes React Native development easier and faster
- Provides extra features (camera, location, notifications, etc.)
- Handles build configuration automatically
- You can develop without installing Xcode or Android Studio

**The Relationship:**
```
Expo
└── Uses React Native internally
    └── Communicates with iOS/Android native code
```

When you:
- Write `import { View, Text } from 'react-native'` - You're using React Native
- Run `npm start` (which runs `expo start`) - Expo provides the dev server
- Use `expo-camera` or `expo-location` - You're using Expo's extra features

**Think of it like:**
- **React Native** = The engine of a car
- **Expo** = The complete car with nice features, GPS, and easy controls

You get both! Expo makes React Native easier to use, but you still use `react-native` for your components.

If for some reason React Native is missing from `node_modules/`, install dependencies:

```bash
# Install ALL dependencies from package.json
npm install
# This installs everything listed in package.json, including:
# - react-native, react, expo, and all other dependencies
```

**npm install - Two Ways:**

```bash
# Option 1: Install everything from package.json (recommended)
npm install
# Reads package.json, installs ALL packages listed

# Option 2: Install individual packages
npm install react-native
npm install react
npm install expo
# Installs specific packages one at a time
# Also adds them to package.json if not already there
```

**Which to use?**
- **Use `npm install` (no package name)**: When working with an existing project (like this one)
- **Use `npm install <package-name>`**: When adding a NEW package to your project

**Why does this work?**
- When you import `'react-native'`, Node.js looks in `node_modules/react-native/`
- `npm install` downloads all packages listed in `package.json` into `node_modules/`
- Your imports will fail if the package isn't in `node_modules/`

**Verify it worked:**
```bash
ls node_modules/react-native
# Should show the react-native package files
```

Now you're ready to import from React Native! ✅

**Step 1: Create the Directory Structure**

First, make sure the `components/budget` folder exists. In your terminal:

```bash
# Navigate to your project root
cd /Users/torbenanderson/development/projects/learn-react-native

# Create the directory structure
mkdir -p components/budget
```

Or in your code editor:
- Right-click the project root
- Select "New Folder" 
- Create `components` folder
- Inside that, create `budget` folder

**Step 2: Create the Component File**

Create a new file: `/Users/torbenanderson/development/projects/learn-react-native/components/budget/EnvelopeCard.tsx`

In your code editor:
- Right-click the `components/budget` folder
- Select "New File"
- Name it `EnvelopeCard.tsx`

Now add this code to the file:

```typescript
import { View, Text } from 'react-native';

function EnvelopeCard() {
  // Step 3: Define envelope data
  const envelopeName = "Groceries";
  const allocated = 500;
  const spent = 325;
  const remaining = allocated - spent;
  
  // Step 4: Return the UI
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

**Why does `@/` work in imports?**

You might wonder about the `@/` in import paths (we'll use this next). This is a path alias configured in `tsconfig.json`:
- `@/` = project root
- `@/components/budget/EnvelopeCard` = `/Users/torbenanderson/development/projects/learn-react-native/components/budget/EnvelopeCard`
- Makes imports cleaner and easier to refactor

**Step 5: Use Your Component**

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

**Step 6: Run Your App**

```bash
npm start
# Press 'w' for web, 'i' for iOS, or 'a' for Android
```

**Troubleshooting:**
- If you see "Cannot find module '@/components/budget/EnvelopeCard'", make sure:
  - The file exists at the correct path
  - The filename is exactly `EnvelopeCard.tsx` (capital E, capital C)
  - You saved the file (Cmd+S / Ctrl+S)
- If the terminal shows errors, try stopping (Ctrl+C) and running `npm start` again

**Step 7: Experiment!**

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
5. What is TypeScript, and how does it relate to JavaScript?
6. Why does this project use `.tsx` files instead of `.jsx` files?
7. What happens to TypeScript code before it runs on a device?

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
- ✅ **TypeScript** is JavaScript with optional type annotations for better error catching
- ✅ **JSX** is JavaScript (or TypeScript) syntax that looks like HTML
- ✅ **Components** are reusable UI building blocks
- ✅ Use `{}` to embed JavaScript in JSX
- ✅ React Native uses `<View>` and `<Text>` instead of HTML tags
- ✅ `.tsx` files = TypeScript + JSX (what this project uses)
- ✅ TypeScript compiles to JavaScript before your app runs (types are removed)
- ✅ Always export your components to use them elsewhere
- ✅ You can write TypeScript that looks like plain JavaScript (type annotations are optional)

**Great job completing Lesson 01!** You've taken your first step into React Native development with TypeScript. Tomorrow, we'll make these components truly reusable with props.

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐☆☆☆☆ Beginner
**Next lesson**: [02-props-and-composition.md](./02-props-and-composition.md)


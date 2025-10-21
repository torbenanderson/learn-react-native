# Lesson 06: Navigation Basics - Navigate Between Budget Screens

## 📚 Theory

### What is Navigation?

**Navigation** is how users move between different screens in your app. In React Native, we use navigation libraries to handle this. With Expo, we use **Expo Router** which provides file-based routing (like Next.js).

```
app/
  (tabs)/
    index.tsx      → /               (Home)
    envelopes.tsx  → /envelopes      (Envelopes)
  envelope/
    [id].tsx       → /envelope/123   (Dynamic envelope detail)
```

### File-Based Routing

With Expo Router, the file structure **IS** the navigation structure:

```
app/
  _layout.tsx           → Root layout
  index.tsx             → Home screen (/)
  settings.tsx          → Settings screen (/settings)
  envelope/
    [id].tsx            → Dynamic route (/envelope/:id)
  (tabs)/
    _layout.tsx         → Tab navigator layout
    index.tsx           → Tab home
    transactions.tsx    → Tab transactions
```

### Understanding Special Folder Names

**Parentheses `(folder)` - Route Groups:**
Folders wrapped in parentheses create **route groups** that don't affect the URL structure but organize your navigation:

```
app/
  (tabs)/              → Route group (doesn't appear in URL)
    _layout.tsx        → Tab navigator
    index.tsx          → / (not /tabs)
    settings.tsx       → /settings (not /tabs/settings)
  (auth)/              → Another route group
    login.tsx          → /login
    register.tsx       → /register
```

**Why use route groups?**
- **Organization**: Group related screens together
- **Layouts**: Apply different layouts to different groups
- **No URL impact**: `(tabs)` doesn't add `/tabs` to your URLs
- **Clean URLs**: Your users see `/settings` not `/tabs/settings`

**Square brackets `[param]` - Dynamic Routes:**
Folders/files with square brackets create dynamic routes that accept parameters:

```
app/
  envelope/
    [id].tsx           → /envelope/123, /envelope/456, etc.
  user/
    [userId]/
      profile.tsx      → /user/123/profile
      settings.tsx     → /user/123/settings
```

**Accessing dynamic parameters:**
```typescript
import { useLocalSearchParams } from 'expo-router';

export default function EnvelopeDetail() {
  const { id } = useLocalSearchParams();
  // id will be "123" when visiting /envelope/123
}
```

**Underscore `_layout.tsx` - Layout Files:**
Files starting with underscore create layouts that wrap their children:

```
app/
  _layout.tsx          → Root layout (wraps entire app)
  (tabs)/
    _layout.tsx        → Tab layout (wraps tab screens)
    index.tsx          → Wrapped by tab layout
    settings.tsx       → Wrapped by tab layout
```

**Real Example - Your Budget App Structure:**
```
app/
  _layout.tsx                    → Root app layout
  (tabs)/                        → Route group for main app
    _layout.tsx                  → Tab navigator layout
    index.tsx                    → / (Home tab - main entry point)
    envelopes.tsx                → /envelopes (Envelopes tab)
    transactions.tsx             → /transactions (Transactions tab)
    settings.tsx                 → /settings (Settings tab)
    explore.tsx                  → /explore (Explore tab)
  envelope/                      → Regular folder (appears in URL)
    [id].tsx                     → /envelope/123 (Dynamic route)
  transaction/                   → Regular folder
    add.tsx                      → /transaction/add
  +not-found.tsx                 → 404 page for unknown routes
```

**What users see in URLs:**
- ✅ `/` - Home (served by `(tabs)/index.tsx`)
- ✅ `/envelopes` - Envelopes list
- ✅ `/envelope/123` - Specific envelope
- ✅ `/transaction/add` - Add transaction
- ❌ `/tabs/settings` - This would be wrong!
- ❌ `/tabs/` - This would be wrong!

### Navigation Types

**Stack Navigation** (Screens stack on top):
```
Home → Details → Edit
  ←      ←
```

**Tab Navigation** (Bottom tabs):
```
[Home]  [Transactions]  [Settings]
```

**Drawer Navigation** (Side menu):
```
☰ → [Menu]
    - Home
    - Settings
    - Logout
```

### Navigating Between Screens

**Using Expo Router hooks:**

```typescript
import { Link, useRouter } from 'expo-router';

// Declarative navigation with Link
<Link href="/envelope/123">View Envelope</Link>

// Programmatic navigation with useRouter
const router = useRouter();
router.push('/envelope/123');    // Push new screen
router.replace('/login');        // Replace current screen
router.back();                   // Go back
```

### Passing Data Between Screens

**Method 1: URL Parameters**
```typescript
// Navigate with param
router.push('/envelope/123');

// Receive param
import { useLocalSearchParams } from 'expo-router';
const { id } = useLocalSearchParams();
```

**Method 2: Query Parameters**
```typescript
// Navigate with query
router.push({
  pathname: '/envelope/[id]',
  params: { id: '123', name: 'Groceries' }
});

// Receive query
const { id, name } = useLocalSearchParams();
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand file-based routing
- ✅ Navigate between screens
- ✅ Create stack and tab navigation
- ✅ Pass data between screens
- ✅ Build a multi-screen budget app
- ✅ Use navigation hooks

## 📖 Book Reference

**"React Native in Action" - Chapter 6: Navigation**
- Section 6.1: Navigation concepts
- Section 6.2: React Navigation library
- Section 6.3: Stack navigation
- Section 6.4: Tab navigation

## 💻 Code Examples

### Example 1: Simple Navigation

```typescript
// app/index.tsx (Home screen)
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  
  return (
    <View>
      <Text>Home Screen</Text>
      <Button 
        title="Go to Settings" 
        onPress={() => router.push('/settings')}
      />
    </View>
  );
}

// app/settings.tsx (Settings screen)
export default function Settings() {
  return (
    <View>
      <Text>Settings Screen</Text>
    </View>
  );
}
```

### Example 2: Tab Navigation

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <Icon name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### Example 3: Dynamic Routes

```typescript
// app/envelope/[id].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function EnvelopeDetail() {
  const { id } = useLocalSearchParams();
  
  return (
    <View>
      <Text>Envelope ID: {id}</Text>
    </View>
  );
}

// Navigate to it:
router.push('/envelope/123');
```

### Example 4: Link Component

The **Link component** is a declarative way to navigate between screens. It's similar to HTML `<a>` tags but for React Native navigation.

**What is the Link component?**

**"Declarative" means what?**
Instead of writing "when this happens, do this" (imperative), you write "this IS a navigation element" (declarative).

```typescript
// IMPERATIVE (useRouter) - "When pressed, navigate"
<TouchableOpacity onPress={() => router.push('/envelope/123')}>
  <Text>View Envelope</Text>
</TouchableOpacity>

// DECLARATIVE (Link) - "This IS a navigation element"
<Link href="/envelope/123">
  <Text>View Envelope</Text>
</Link>
```

**What does each point actually mean?**

1. **"Handles navigation automatically"** - You don't write `onPress` handlers. The Link knows it should navigate when tapped.

2. **"Renders as a pressable element"** - Link creates a React Native `Pressable` component internally, which is like a TouchableOpacity but more modern and accessible. It handles touch events, focus states, and accessibility automatically.

   **What is Pressable?**
   - React Native's modern touchable component (replaces TouchableOpacity)
   - Handles press states (pressed, hovered, focused)
   - Built-in accessibility support
   - More customizable than TouchableOpacity
   
   **What is TouchableOpacity?**
   - React Native's older touchable component
   - Makes content tappable with a fade effect when pressed
   - Basic touch handling but limited customization
   - Still widely used but Pressable is preferred for new code
   
   **Example of TouchableOpacity:**
   ```typescript
   <TouchableOpacity onPress={() => console.log('Pressed!')}>
     <Text>Tap me!</Text>
   </TouchableOpacity>
   ```
   
   **So this:**
   ```typescript
   <Link href="/envelope/123">View Envelope</Link>
   ```
   
   **Is equivalent to:**
   ```typescript
   <Pressable onPress={() => router.push('/envelope/123')}>
     <Text>View Envelope</Text>
   </Pressable>
   ```

3. **"Can wrap custom components using asChild"** - Instead of Link creating its own pressable, you can make YOUR component pressable:
   ```typescript
   <Link href="/envelope/123" asChild>
     <MyCustomButton /> {/* This becomes the pressable element */}
   </Link>
   ```

4. **"Better accessibility and user experience"** - Link automatically adds:
   - Screen reader labels ("Navigate to envelope 123")
   - Proper focus management
   - Keyboard navigation support
   - Haptic feedback on supported devices

**Basic Link usage:**
```typescript
import { Link } from 'expo-router';

// Simple link that renders as text
<Link href="/envelope/123">View Envelope</Link>

// Link with custom styling
<Link href="/envelope/123" style={{ color: 'blue', fontSize: 16 }}>
  View Envelope
</Link>
```

**Link with custom components (asChild prop):**
```typescript
import { Link } from 'expo-router';

<Link href="/envelope/123" asChild>
  <TouchableOpacity>
    <Text>View Envelope</Text>
  </TouchableOpacity>
</Link>
```

**Key benefits of Link component:**

- **Declarative**: Navigation logic is in the JSX, not in event handlers
  ```typescript
  // Less code, clearer intent
  <Link href="/envelope/123">View</Link>
  // vs
  <TouchableOpacity onPress={() => router.push('/envelope/123')}>View</TouchableOpacity>
  ```

- **Accessibility**: Automatically handles screen reader support
  - Screen readers announce "Link, View Envelope" instead of just "View Envelope"
  - Proper focus management for keyboard users

- **Performance**: Optimized for navigation
  - Link preloads route information
  - Faster navigation transitions
  - Better memory management for large navigation stacks

- **Type safety**: TypeScript support for route parameters
  ```typescript
  // TypeScript knows these params exist
  <Link href="/envelope/[id]" params={{ id: "123" }} />
  ```

- **Custom styling**: Can wrap any component with `asChild`
  ```typescript
  <Link href="/envelope/123" asChild>
    <MyStyledCard /> {/* Your custom component becomes navigable */}
  </Link>
  ```

**When to use Link vs useRouter:**
- **Use Link** for: Simple navigation, buttons, list items, cards
- **Use useRouter** for: Complex logic, conditional navigation, form submissions

### Example 5: When to Use Link - List Items

**Perfect for Link**: Navigation cards in a list
```typescript
// app/(tabs)/envelopes.tsx
import { Link } from 'expo-router';

export default function EnvelopesScreen() {
  const envelopes = [
    { id: '1', name: 'Groceries', allocated: 500, spent: 325.50 },
    { id: '2', name: 'Rent', allocated: 1200, spent: 1200 },
    { id: '3', name: 'Gas', allocated: 150, spent: 89.25 },
  ];

  return (
    <ScrollView>
      {envelopes.map(envelope => (
        <Link 
          key={envelope.id}
          href={{
            pathname: '/envelope/[id]',
            params: { 
              id: envelope.id, 
              name: envelope.name,
              allocated: envelope.allocated.toString(),
              spent: envelope.spent.toString()
            }
          }}
          asChild
        >
          <View style={styles.envelopeCard}>
            <Text style={styles.envelopeName}>{envelope.name}</Text>
            <Text style={styles.envelopeAmount}>
              ${envelope.allocated - envelope.spent} remaining
            </Text>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}
```

**Why Link is perfect here:**
- Each card is a simple navigation action
- No complex logic needed
- Users expect list items to be tappable
- Automatic accessibility for screen readers
- Clean, readable code

**When you'd use useRouter instead:**
```typescript
// Complex logic - use useRouter
const handleEnvelopePress = (envelope) => {
  if (envelope.isLocked) {
    Alert.alert('Locked', 'This envelope is locked');
    return;
  }
  
  if (envelope.needsPassword) {
    // Show password modal first
    setShowPasswordModal(true);
    setSelectedEnvelope(envelope);
  } else {
    router.push(`/envelope/${envelope.id}`);
  }
};

<TouchableOpacity onPress={() => handleEnvelopePress(envelope)}>
  <Text>{envelope.name}</Text>
</TouchableOpacity>
```

**Does Link affect screen stacking or full screen updates?**

**Screen Stacking**: Both Link and useRouter do the same thing - they push screens onto the navigation stack. No difference here.

**Full Screen Updates**: Link doesn't change how screens render. The difference is in the navigation mechanism:

```typescript
// Both of these do the same navigation
<Link href="/envelope/123">View</Link>
<TouchableOpacity onPress={() => router.push('/envelope/123')}>View</TouchableOpacity>

// Both result in the same screen transition
// Both update the navigation stack the same way
// Both trigger the same screen lifecycle methods
```

**The real differences are:**
1. **Code clarity** - Link is more readable
2. **Accessibility** - Link adds screen reader support
3. **Performance** - Link can preload route data
4. **Developer experience** - Link has better TypeScript support

**Bottom line**: Link is just a more convenient way to do the same navigation that useRouter does. It doesn't change how screens stack or update.

## 🛠️ Hands-On Exercise

### Goal: Build Multi-Screen Envelope Budget App

Let's create a complete navigation flow for our budget app!

**Step 1: Create Envelope Detail Screen**

Create `/Users/torbenanderson/development/projects/learn-react-native/app/envelope/[id].tsx`:

```typescript
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Design';

export default function EnvelopeDetailScreen() {
  const { id, name, allocated, spent } = useLocalSearchParams();
  const router = useRouter();
  
  // Convert strings to numbers
  const allocatedAmount = parseFloat(allocated as string);
  const spentAmount = parseFloat(spent as string);
  const remaining = allocatedAmount - spentAmount;
  const percentSpent = (spentAmount / allocatedAmount) * 100;
  
  // Sample transactions for this envelope
  const transactions = [
    { id: '1', description: 'Whole Foods', amount: -85.43, date: '2025-10-09' },
    { id: '2', description: 'Trader Joes', amount: -52.18, date: '2025-10-07' },
    { id: '3', description: 'Farmers Market', amount: -32.50, date: '2025-10-05' },
  ];
  
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.header}>
        <Text style={styles.envelopeName}>{name}</Text>
        <View style={styles.amountCard}>
          <Text style={styles.remainingLabel}>Remaining</Text>
          <Text style={styles.remainingAmount}>${remaining.toFixed(2)}</Text>
          <Text style={styles.remainingSubtext}>
            of ${allocatedAmount.toFixed(2)} allocated
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(percentSpent, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {percentSpent.toFixed(0)}% spent
          </Text>
        </View>
      </View>
      
      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>💸 Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
          <Text style={styles.actionButtonTextSecondary}>💰 Add Funds</Text>
        </TouchableOpacity>
      </View>
      
      {/* Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map(transaction => (
          <View key={transaction.id} style={styles.transactionRow}>
            <View>
              <Text style={styles.transactionDesc}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={styles.transactionAmount}>
              ${Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  envelopeName: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.lg,
  },
  amountCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  remainingLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  remainingAmount: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  remainingSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.surface,
    opacity: 0.8,
  },
  progressSection: {
    gap: Spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: Typography.sizes.sm,
    color: Colors.surface,
    opacity: 0.9,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.surface,
  },
  actionButtonTextSecondary: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  transactionDesc: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.error,
  },
});
```

**Step 2: Update EnvelopeCard to Link to Detail**

Update `/Users/torbenanderson/development/projects/learn-react-native/components/budget/EnvelopeCard.tsx` to add navigation:

```typescript
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface EnvelopeCardProps {
  id: string; // Add id prop
  name: string;
  icon: string;
  allocated: number;
  spent: number;
  color?: string;
}

function EnvelopeCard({ 
  id,
  name, 
  icon, 
  allocated, 
  spent, 
  color = '#3b82f6' 
}: EnvelopeCardProps) {
  const router = useRouter();
  const remaining = allocated - spent;
  const percentSpent = allocated > 0 ? (spent / allocated) * 100 : 0;
  
  const handlePress = () => {
    router.push({
      pathname: '/envelope/[id]',
      params: { 
        id, 
        name, 
        allocated: allocated.toString(), 
        spent: spent.toString() 
      }
    });
  };
  
  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: color }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Rest of your existing EnvelopeCard code */}
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
          <Text style={[styles.amount, remaining < 50 && styles.lowAmount]}>
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
    </TouchableOpacity>
  );
}

// Keep your existing styles
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

**Step 3: Create Envelopes List Screen**

Create `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/envelopes.tsx`:

```typescript
import { ScrollView, Text, StyleSheet } from 'react-native';
import EnvelopeCard from '@/components/budget/EnvelopeCard';
import { Colors, Spacing, Typography } from '@/constants/Design';

export default function EnvelopesScreen() {
  const envelopes = [
    { id: '1', name: 'Groceries', icon: '🛒', allocated: 500, spent: 325.50, color: '#10b981' },
    { id: '2', name: 'Rent', icon: '🏠', allocated: 1200, spent: 1200, color: '#3b82f6' },
    { id: '3', name: 'Gas', icon: '⛽', allocated: 150, spent: 89.25, color: '#f59e0b' },
    { id: '4', name: 'Entertainment', icon: '🎬', allocated: 200, spent: 175.80, color: '#8b5cf6' },
    { id: '5', name: 'Dining Out', icon: '🍔', allocated: 100, spent: 95.50, color: '#ef4444' },
  ];
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>All Envelopes</Text>
      {envelopes.map(envelope => (
        <EnvelopeCard key={envelope.id} {...envelope} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
});
```

**Step 4: Add Envelopes Tab**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/_layout.tsx` to add the envelopes tab:

```typescript
<Tabs.Screen
  name="envelopes"
  options={{
    title: 'Envelopes',
    tabBarIcon: ({ color }) => <TabBarIcon name="wallet" color={color} />,
  }}
/>
```

**Step 5: Test Navigation**

```bash
npm start
```

Now:
1. Go to the Envelopes tab
2. Tap on any envelope card
3. See the detail screen!
4. Use the back button to return

## ✅ Checkpoint

### What You Should See
- Three tabs: Home, Envelopes, Transactions
- Tapping an envelope navigates to detail screen
- Detail screen shows envelope info and transactions
- Back button returns to previous screen

### Can You Answer These?
1. How does file-based routing work in Expo Router?
2. How do you navigate programmatically?
3. How do you pass data between screens?
4. What's the difference between push and replace?
5. What are dynamic routes?

### Common Issues

**Issue**: "Cannot find module '@/app/envelope/[id]'"
- **Solution**: Make sure you created the file in the correct location with brackets

**Issue**: Navigation not working
- **Solution**: Check that you're using `useRouter()` from 'expo-router', not 'react-navigation'

**Issue**: Parameters undefined
- **Solution**: Make sure you're passing params correctly and extracting with `useLocalSearchParams()`

## 🚀 Next Steps

### Preview of Lesson 07: Forms and Input Handling
In the next lesson, you'll learn how to:
- Build complex forms
- Validate user input
- Handle different input types
- Create transaction entry forms
- Manage form state effectively
- Show validation errors

### Optional Challenges
1. **Add envelope**: Create a screen to add new envelopes
2. **Edit envelope**: Add edit functionality to detail screen
3. **Delete confirmation**: Show alert before deleting
4. **Navigation transitions**: Customize screen transitions
5. **Deep linking**: Set up deep links to open specific envelopes

### Key Takeaways
- ✅ File structure defines routes in Expo Router
- ✅ useRouter() for programmatic navigation
- ✅ Link component for declarative navigation
- ✅ Dynamic routes use [param] syntax
- ✅ useLocalSearchParams() to read route parameters
- ✅ Tab navigation for main app sections

**Excellent work completing Lesson 06!** Your app now has proper navigation! Tomorrow, we'll finish Phase 1 by building comprehensive forms for data entry.

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐⭐⭐☆☆ Intermediate
**Previous lesson**: [05-styling-in-react-native.md](./05-styling-in-react-native.md)
**Next lesson**: [07-forms-and-input-handling.md](./07-forms-and-input-handling.md)


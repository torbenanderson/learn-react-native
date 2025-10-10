# Lesson 05: Styling in React Native - Style Your Minimal Budget UI

## 📚 Theory

### How Styling Works in React Native

React Native uses JavaScript objects for styling, not CSS. It's similar to inline styles in web development but with some differences.

```typescript
// React Native (JavaScript object)
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  }
});

// Web CSS (for comparison)
.container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}
```

**Key Differences from CSS:**
- camelCase property names: `backgroundColor` not `background-color`
- Number values (no units): `padding: 20` not `padding: 20px`
- Limited CSS properties (only what mobile supports)
- No cascading (styles don't inherit like CSS)

### StyleSheet.create()

Always use `StyleSheet.create()` to define styles:

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#333',
  }
});
```

**Benefits:**
- Performance optimization
- Validation (catches typos)
- Code completion in IDE
- Reusability

### Flexbox Layout

React Native uses Flexbox for layouts (default behavior is like `display: flex`):

```typescript
// Horizontal layout
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1 }} />  {/* Takes 1/3 */}
  <View style={{ flex: 2 }} />  {/* Takes 2/3 */}
</View>

// Vertical layout (default)
<View style={{ flexDirection: 'column' }}>
  <View />
  <View />
</View>
```

**Key Flexbox Properties:**
- `flexDirection`: `'row'` | `'column'` (default)
- `justifyContent`: Align along main axis
- `alignItems`: Align along cross axis
- `flex`: How much space to take
- `flexWrap`: Wrap items to new line

### Common Style Properties

**Layout:**
```typescript
{
  width: 100,
  height: 50,
  padding: 16,
  paddingHorizontal: 20,  // left + right
  paddingVertical: 10,    // top + bottom
  margin: 8,
  gap: 12,  // Space between flex children
}
```

**Colors & Borders:**
```typescript
{
  backgroundColor: '#3b82f6',
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 8,
  shadowColor: '#000',  // iOS shadow
  shadowOpacity: 0.1,
  elevation: 3,         // Android shadow
}
```

**Text:**
```typescript
{
  fontSize: 16,
  fontWeight: '600',  // String: '300', '400', '500', '600', '700', '800', '900'
  color: '#1f2937',
  textAlign: 'center',
  lineHeight: 24,
}
```

### Platform-Specific Styles

Use `Platform.select()` for platform-specific styling:

```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 4,
      },
    }),
  }
});
```

### Style Arrays

Combine multiple styles with arrays (later styles override earlier ones):

```typescript
<View style={[styles.button, styles.primaryButton, isDisabled && styles.disabledButton]} />
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Use StyleSheet.create() for organized styling
- ✅ Master Flexbox layouts
- ✅ Create responsive designs
- ✅ Apply colors, fonts, and spacing
- ✅ Handle platform-specific styles
- ✅ Build a professional-looking budget UI
- ✅ Follow design principles for minimal interfaces

## 📖 Book Reference

**"React Native in Action" - Chapter 5: Styling**
- Section 5.1: StyleSheet API
- Section 5.2: Flexbox layout
- Section 5.3: Platform-specific styling
- Section 5.4: Styling best practices

## 💻 Code Examples

### Example 1: Basic Styling

```typescript
import { View, Text, StyleSheet } from 'react-native';

function Card() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Budget Card</Text>
      <Text style={styles.subtitle}>$1,250.00</Text>
    </View>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
});
```

### Example 2: Flexbox Layouts

```typescript
// Horizontal row
<View style={styles.row}>
  <Text>Label:</Text>
  <Text style={styles.value}>$500</Text>
</View>

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontWeight: 'bold',
  },
});
```

### Example 3: Conditional Styling

```typescript
function StatusBadge({ status }) {
  return (
    <View style={[
      styles.badge,
      status === 'success' && styles.successBadge,
      status === 'error' && styles.errorBadge,
    ]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  successBadge: {
    backgroundColor: '#d1fae5',
  },
  errorBadge: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
```

### Example 4: Responsive Design

```typescript
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: windowWidth > 768 ? 40 : 20,
  },
  card: {
    width: windowWidth > 768 ? '48%' : '100%',
  },
});
```

## 🛠️ Hands-On Exercise

### Goal: Create a Styled Budget Dashboard

Let's build a beautiful, minimal dashboard that displays your budget overview with professional styling!

**Step 1: Create Design Tokens**

Create `/Users/torbenanderson/development/projects/learn-react-native/constants/Design.ts`:

```typescript
export const Colors = {
  // Primary
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',
  
  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Neutrals
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Background
  background: '#f3f4f6',
  surface: '#ffffff',
  
  // Text
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    normal: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};
```

**Step 2: Create Styled Budget Summary Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/budget/BudgetSummary.tsx`:

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Design';

interface BudgetSummaryProps {
  totalIncome: number;
  totalAllocated: number;
  totalSpent: number;
}

function BudgetSummary({ totalIncome, totalAllocated, totalSpent }: BudgetSummaryProps) {
  const unallocated = totalIncome - totalAllocated;
  const remaining = totalAllocated - totalSpent;
  
  return (
    <View style={styles.container}>
      {/* Main Balance Card */}
      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Available to Budget</Text>
        <Text style={styles.mainAmount}>
          ${unallocated.toFixed(2)}
        </Text>
        <Text style={styles.mainSubtext}>
          {unallocated > 0 ? 'Ready to allocate' : 'All funds allocated'}
        </Text>
      </View>
      
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: Colors.success + '20' }]}>
            <Text style={styles.statEmoji}>💰</Text>
          </View>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            ${totalIncome.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
            <Text style={styles.statEmoji}>📊</Text>
          </View>
          <Text style={styles.statLabel}>Allocated</Text>
          <Text style={[styles.statValue, { color: Colors.primary }]}>
            ${totalAllocated.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: Colors.error + '20' }]}>
            <Text style={styles.statEmoji}>💸</Text>
          </View>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={[styles.statValue, { color: Colors.error }]}>
            ${totalSpent.toFixed(2)}
          </Text>
        </View>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Budget Progress</Text>
          <Text style={styles.progressPercent}>
            {totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(0) : 0}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%`,
                backgroundColor: totalSpent > totalAllocated ? Colors.error : Colors.primary,
              }
            ]} 
          />
        </View>
        <Text style={styles.progressSubtext}>
          ${remaining.toFixed(2)} remaining in envelopes
        </Text>
      </View>
    </View>
  );
}

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
    ...Shadows.medium,
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
    ...Shadows.small,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statEmoji: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  progressSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
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

export default BudgetSummary;
```

**Step 3: Update Home Screen**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx`:

```typescript
import { ScrollView, StyleSheet } from 'react-native';
import BudgetSummary from '@/components/budget/BudgetSummary';
import { Colors } from '@/constants/Design';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <BudgetSummary 
        totalIncome={3000}
        totalAllocated={2500}
        totalSpent={1850}
      />
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

**Step 4: Run and Admire**

```bash
npm start
```

You now have a beautifully styled budget dashboard!

## ✅ Checkpoint

### What You Should See
- A blue main card showing "Available to Budget"
- Three stat cards with icons (Income, Allocated, Spent)
- A progress bar showing budget usage
- Clean, minimal design with consistent spacing
- Subtle shadows and rounded corners

### Can You Answer These?
1. What is StyleSheet.create() and why use it?
2. What is Flexbox and how does it work?
3. How do you combine multiple styles?
4. What's the difference between margin and padding?
5. How do you handle platform-specific styles?

### Common Issues

**Issue**: Styles not applying
- **Solution**: Check for typos in property names (must be camelCase)

**Issue**: Layout looks wrong
- **Solution**: Use Flexbox debugger: add `borderWidth: 1, borderColor: 'red'` temporarily

**Issue**: Shadows not showing on Android
- **Solution**: Use `elevation` instead of shadow properties

## 🚀 Next Steps

### Preview of Lesson 06: Navigation Basics
In the next lesson, you'll learn how to:
- Navigate between screens with Expo Router
- Pass data between screens
- Create stack navigation
- Build a multi-screen budget app
- Handle navigation state

### Optional Challenges
1. **Dark mode**: Create a dark theme version of the design tokens
2. **Custom fonts**: Add a custom font family
3. **Animations**: Add fade-in animation when component mounts (preview of Lesson 15!)
4. **Responsive**: Make stats stack vertically on small screens
5. **Theming**: Create a context for switching between light/dark themes

**Example Challenge Solution (Responsive Stats):**
```typescript
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const isSmallScreen = windowWidth < 375;

<View style={[
  styles.statsRow,
  isSmallScreen && { flexDirection: 'column' }
]}>
  {/* stats */}
</View>
```

### Key Takeaways
- ✅ StyleSheet.create() for organized, performant styles
- ✅ Flexbox is the primary layout system
- ✅ Use design tokens for consistent styling
- ✅ Combine styles with arrays
- ✅ Platform.select() for platform-specific styles
- ✅ Keep designs minimal and clean

**Outstanding work completing Lesson 05!** Your app now looks professional and polished. Tomorrow, we'll add navigation to create a multi-screen experience!

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐⭐⭐☆☆ Intermediate
**Previous lesson**: [04-lists-and-keys.md](./04-lists-and-keys.md)
**Next lesson**: [06-navigation-basics.md](./06-navigation-basics.md)


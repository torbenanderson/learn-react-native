# React Native Learning Machine 🚀

Welcome to your personalized React Native learning platform! This repo is designed to teach you React Native by building a **real personal budgeting app** based on the envelope budgeting system.

## What is This?

This is both:
1. **A comprehensive learning curriculum** with 28 structured lessons
2. **A real app** you'll build (envelope budget tracker)
3. **A fundable business** ready for app store deployment

By the end, you'll have mastered React Native AND built a complete, professional app ready to launch!

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Learning!
```bash
npm start
# Press 'w' for web, 'i' for iOS, or 'a' for Android
```

### 3. Follow the Curriculum
Start with [Lesson 01: JSX and Components](./docs/lessons/01-jsx-and-components.md)

## Learning Path

### 📚 [View Full Curriculum](./docs/curriculum-overview.md)

**Phase 1: Core Concepts (Days 1-7)** ✅ *AVAILABLE NOW*
- Lesson 01: JSX and Components
- Lesson 02: Props and Composition
- Lesson 03: State with useState
- Lesson 04: Lists and Keys
- Lesson 05: Styling in React Native
- Lesson 06: Navigation Basics
- Lesson 07: Forms and Input Handling

**Phase 2: Data & APIs (Days 8-14)** 🚧 *Coming Soon*
- State management with Zustand
- Data persistence with AsyncStorage
- Custom hooks
- Error handling

**Phase 3: Advanced UI (Days 15-20)** 🚧 *Coming Soon*
- Animations and gestures
- Charts and visualizations
- Dark mode and theming

**Phase 4: Production Ready (Days 21-28)** 🚧 *Coming Soon*
- Authentication
- Cloud sync
- App store deployment

## What You'll Build

A **Digital Envelope Budget App** featuring:
- 💰 Envelope budgeting system (allocate income to categories)
- 💸 Track expenses from each envelope
- 📊 Beautiful, minimal interface
- 📱 Works 100% offline
- 🎨 Professional design

**Core Philosophy**: Simplicity first, visual clarity, quick actions.

## Resources

- 📖 **Curriculum**: [docs/curriculum-overview.md](./docs/curriculum-overview.md)
- 💡 **Learning Guide**: [docs/learning-guide.md](./docs/learning-guide.md)
- 📚 **Lessons**: [docs/lessons/](./docs/lessons/)
- 📘 **Book Reference**: "React Native in Action" by Nader Dabit

## Architecture Decisions

- **Period Management**: Monthly only (simple MVP)
- **Initial Setup**: Empty slate (users create envelopes)
- **Unallocated Funds**: Flexible (allocate anytime)
- **Transaction Entry**: Quick entry + full form
- **Currency**: USD only initially

## Project Structure

```
learn-react-native/
├── docs/
│   ├── curriculum-overview.md
│   ├── learning-guide.md
│   └── lessons/
│       ├── 01-jsx-and-components.md
│       ├── 02-props-and-composition.md
│       └── ... (28 lessons total)
├── app/                    # Your budget app screens
│   ├── (tabs)/
│   ├── envelope/
│   └── transaction/
├── components/
│   ├── budget/            # Budget-specific components
│   └── ui/                # Reusable UI components
├── types/
│   └── budget.ts          # TypeScript types
├── constants/
│   ├── Colors.ts
│   └── Design.ts          # Design tokens
└── stores/                # State management (Phase 2)
```

## Daily Learning Routine

1. **Read lesson** (15-20 min)
2. **Study examples** (15-20 min)
3. **Complete exercise** (30-60 min)
4. **Test your work** (10-15 min)
5. **Review checkpoint** (5 min)

**Total: 1-2 hours per day**

You can go faster or slower - learn at your own pace!

## Support

- ✅ Checkpoints in every lesson
- ✅ Common issues and solutions
- ✅ Code examples you can copy
- ✅ Step-by-step instructions
- ✅ Book references for deeper learning

---

# Technical Documentation

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app), now configured as a React Native Learning Machine!

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

## Running Your App 📱💻🖥️

Once the development server is running, you can test your app in multiple ways:

### 🌐 Web Browser (Easiest)
Press `w` in your terminal to open the app in your web browser.

### 📱 Expo Go on Your Phone
1. Install **Expo Go** from App Store (iOS) or Google Play (Android)
2. Make sure your phone and computer are on the same WiFi network
3. Open Expo Go and scan the QR code from your terminal
4. Your app will open on your phone with live reload

### 🖥️ iOS Simulator (Mac only)
Press `i` in your terminal to open the iOS Simulator.

### 🤖 Android Emulator
Press `a` in your terminal to open the Android Emulator.

### 🔧 Development Builds (Advanced)
For testing with native modules:
```bash
npx expo run:ios     # iOS device/simulator
npx expo run:android # Android device/emulator
```

### 📱 Direct USB Connection (iPhone/Android)
For the most reliable connection:

**For iPhone:**
1. Connect your iPhone to your Mac via USB cable
2. Trust the computer when prompted on your iPhone
3. Run: `npx expo run:ios --device`
4. Your app will install and open directly on your iPhone

**For Android:**
1. Enable USB debugging on your Android device
2. Connect via USB cable
3. Run: `npx expo run:android --device`
4. Your app will install and open directly on your Android device

### 🌐 Tunnel Mode (Alternative)
If you have network issues with Expo Go:
```bash
npx expo start --tunnel
```

## Troubleshooting 🔧

### Expo Go Not Working?
- Make sure your phone and computer are on the same WiFi
- Try refreshing the Expo Go app (pull down to refresh)
- Check that the terminal shows "Using Expo Go" (not "Using development build")

### Development Build Issues?
- If you see "Using development build" but want to use Expo Go, make sure `expo-dev-client` is not installed
- Remove it with: `npm uninstall expo-dev-client`

### Network Issues?
- Try tunnel mode: `npx expo start --tunnel`
- Or use web version: press `w` in terminal

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure & Atomic Design 🏗️

This project follows the **Atomic Design** methodology, organizing components into a hierarchical structure from simple to complex:

| **Atomic Design Level** | **Components** | **Description** | **Examples from Your Project** |
|------------------------|----------------|-----------------|-------------------------------|
| **Atoms** | `components/ui/` | Basic building blocks, single responsibility, platform-specific | `IconSymbol.tsx`, `TabBarBackground.tsx` |
| **Molecules** | `components/` (simple) | Simple combinations of atoms with minimal logic | `ThemedText.tsx`, `ThemedView.tsx`, `ExternalLink.tsx` |
| **Organisms** | `components/` (complex) | Complex components with state, business logic, multiple molecules | `Collapsible.tsx`, `ParallaxScrollView.tsx`, `HelloWave.tsx` |
| **Templates** | `app/` layout files | Page layouts and routing structure | `app/_layout.tsx`, `app/(tabs)/_layout.tsx` |
| **Pages** | `app/` content files | Complete screens/pages | `app/(tabs)/index.tsx`, `app/(tabs)/explore.tsx` |

### **Detailed Component Mapping:**

#### **Atoms** (`components/ui/`)
- **IconSymbol.tsx** - Basic icon primitive with platform-specific implementations
- **TabBarBackground.tsx** - Basic background primitive for tab navigation
- **IconSymbol.ios.tsx** - iOS-specific SF Symbols implementation

#### **Molecules** (`components/`)
- **ThemedText.tsx** - Text component with theme support and typography variants
- **ThemedView.tsx** - View component with theme support
- **ExternalLink.tsx** - Link component with external URL handling
- **HapticTab.tsx** - Tab component with haptic feedback integration

#### **Organisms** (`components/`)
- **Collapsible.tsx** - Complex component combining multiple molecules (ThemedText + ThemedView + IconSymbol) with state management
- **ParallaxScrollView.tsx** - Advanced scroll component with parallax effects and multiple child components
- **HelloWave.tsx** - Interactive component with animations, theming, and user interactions

#### **Templates** (`app/`)
- **app/_layout.tsx** - Root layout structure and navigation setup
- **app/(tabs)/_layout.tsx** - Tab navigation structure and styling

#### **Pages** (`app/`)
- **app/(tabs)/index.tsx** - Home screen with main content
- **app/(tabs)/explore.tsx** - Explore screen with additional features

### **Benefits of This Structure:**
- **Reusability**: Atoms can be reused across multiple molecules and organisms
- **Maintainability**: Clear separation of concerns makes debugging easier
- **Scalability**: Easy to add new components following the established pattern
- **Consistency**: Platform-specific implementations ensure consistent behavior across devices
- **Type Safety**: TypeScript integration provides compile-time error checking

## Constants & Configuration 📋

The `constants/` folder contains static values that remain unchanged throughout your application's lifecycle. These are used for configuration data, theme values, API endpoints, and other static information.

### **What Goes in the constants/ Folder?**

The `constants/` folder is often broken down into sub-files to keep things organized. A typical structure would look something like this:

```
src/
└── constants/
    ├── api.ts           // API endpoints, API keys, etc.
    ├── colors.ts        // App-wide color palette
    ├── dimensions.ts    // Dimensions for responsive design (e.g., header height)
    ├── fonts.ts         // Font families and sizes
    ├── strings.ts       // UI text, titles, button labels, etc.
    └── index.ts         // A single point of export for all constants
```

### **Examples of Content in Each File:**

#### **api.ts:**
```typescript
export const BASE_URL = 'https://api.yourapp.com/v1';
export const API_KEY = 'your_super_secret_key';
export const ENDPOINTS = {
  LOGIN: '/auth/login',
  PRODUCTS: '/products',
  USER_PROFILE: '/user',
};
```

#### **colors.ts:**
```typescript
export const COLORS = {
  primary: '#007BFF',
  secondary: '#6c757d',
  success: '#28a745',
  error: '#dc3545',
  background: '#f8f9fa',
  text: '#212529',
};
```

#### **strings.ts:**
```typescript
export const AppStrings = {
  loginTitle: 'Welcome Back!',
  loginButton: 'Log In',
  registerButton: 'Create an Account',
  loading: 'Loading...',
};
```

### **How to Use the constants/ Folder**

By creating an `index.ts` file in your `constants/` folder, you can export all your constants from a single file, making your imports cleaner:

**src/constants/index.ts:**
```typescript
import * as Colors from './colors';
import * as Strings from './strings';
import * as Api from './api';

export {
  Colors,
  Strings,
  Api
};
```

Then, in any component where you need to use a constant, you can import it like this:

**src/screens/LoginScreen.tsx:**
```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Colors, Strings } from '../constants';

const LoginScreen = () => {
  return (
    <View style={{ backgroundColor: Colors.background }}>
      <Text>{Strings.loginTitle}</Text>
      <Button title={Strings.loginButton} color={Colors.primary} />
    </View>
  );
};
```

### **Current Constants in Your Project:**

Your project currently has a well-organized `Colors.ts` constant that supports both light and dark themes:

```typescript
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};
```

### **Benefits of Using Constants:**

- **DRY Principle**: Define once, use everywhere
- **Easy Updates**: Change in one place, affects entire app
- **Type Safety**: TypeScript catches errors
- **Performance**: No repeated object creation
- **Testing**: Easy to mock and test
- **Maintainability**: Clean, organized, and scalable codebase

### **Best Practices:**

1. **Group related constants** (like your Colors object)
2. **Use descriptive names** (`Colors.light.text` not `c.l.t`)
3. **Export as objects** for better organization
4. **Add TypeScript types** for better IntelliSense
5. **Keep them in a dedicated folder** (`constants/`)
6. **Use an index file** for clean imports

This approach helps maintain a clean, organized, and scalable codebase, which is a hallmark of good software development practice.

## Hooks & Custom Logic 🪝

**Hooks** are functions that allow you to "hook into" React state and lifecycle features from function components. They enable you to use state and other React features without writing a class component.

### **What Are Hooks?**

Hooks are functions that:
- **Manage state** (`useState`, `useReducer`)
- **Handle side effects** (`useEffect`, `useLayoutEffect`)
- **Access context** (`useContext`)
- **Optimize performance** (`useMemo`, `useCallback`)
- **Create custom logic** (custom hooks like `useThemeColor`)

### **Hooks in Your Project:**

Your project contains custom hooks that handle theme management and color schemes:

#### **useColorScheme.ts** - Platform Color Scheme Detection
```typescript
export { useColorScheme } from 'react-native';
```

**Purpose**: Detects the user's preferred color scheme (light/dark mode) on native platforms (iOS/Android).

**How it works**: 
- Re-exports React Native's built-in `useColorScheme` hook
- Returns `'light'`, `'dark'`, or `null` based on system settings
- Used by components to adapt to user's theme preference

#### **useColorScheme.web.ts** - Web-Specific Color Scheme
```typescript
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
```

**Purpose**: Handles color scheme detection specifically for web platforms.

**Key Features**:
- **Hydration Safety**: Prevents hydration mismatches during server-side rendering
- **Fallback**: Returns `'light'` as default until client-side hydration completes
- **Platform-Specific**: Only used on web platforms (React Native Web)

#### **useThemeColor.ts** - Theme Color Management
```typescript
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
```

**Purpose**: Provides theme-aware color selection for components.

**How it works**:
1. **Accepts props**: Optional light/dark color overrides
2. **Detects theme**: Uses `useColorScheme()` to get current theme
3. **Prioritizes props**: Uses prop colors if provided
4. **Falls back to constants**: Uses `Colors` constant as default
5. **Type-safe**: TypeScript ensures valid color names

### **How Hooks Are Used in Your Project:**

#### **In Components:**
```typescript
// ThemedText.tsx
import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemedText({ lightColor, darkColor, ...rest }) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    'text'
  );
  
  return <Text style={{ color }} {...rest} />;
}
```

#### **In Layout Files:**
```typescript
// app/_layout.tsx
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Use colorScheme to set theme
}
```

### **Benefits of Custom Hooks:**

- **Reusability**: Share logic between components
- **Separation of Concerns**: Keep components focused on UI
- **Testing**: Easy to test business logic separately
- **Type Safety**: TypeScript provides compile-time checks
- **Platform Compatibility**: Handle platform differences gracefully

### **Hook Naming Conventions:**

- **Start with "use"**: `useThemeColor`, `useColorScheme`
- **Descriptive names**: Clearly indicate what the hook does
- **Platform suffixes**: `.web.ts` for web-specific implementations
- **Consistent exports**: Export as named functions

### **Best Practices:**

1. **Keep hooks focused**: One responsibility per hook
2. **Handle platform differences**: Use platform-specific files when needed
3. **Provide defaults**: Always have fallback values
4. **Type everything**: Use TypeScript for better IntelliSense
5. **Document purpose**: Add comments explaining complex logic
6. **Test thoroughly**: Hooks should be well-tested since they're reused

This hook architecture provides a clean, maintainable way to handle theme management across your React Native application.

## Project Structure & Folder Organization 📁

Understanding the folder structure is crucial for maintaining a clean and scalable React Native application. Here's the recommended project structure:

```
my-app/
├── app/                  // All of your routes and screen components go here
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   └── explore.tsx
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   └── ...
├── assets/               // Your images, fonts, and other static files
├── components/           // Reusable UI components (buttons, cards, etc.)
├── hooks/                // Your custom React hooks (useAuth, useTheme, etc.)
├── state/                // Your global state management files (context or Zustand)
├── utils/                // Utility functions and constants
├── types/                // All of your TypeScript types and interfaces
├── package.json
└── ...
```

### **Folder Structure Breakdown:**

#### **app/** - Routes and Screens
- **File-based routing** with Expo Router
- **`_layout.tsx`** - Root layout and navigation structure
- **`(tabs)/`** - Tab-based navigation screens
- **`+not-found.tsx`** - 404 error page
- **Other route files** - Additional screens and nested routes

#### **assets/** - Static Resources
- **Images** - Icons, logos, backgrounds
- **Fonts** - Custom typography files
- **Other static files** - Videos, audio, documents

#### **components/** - Reusable UI Components
- **Atomic Design structure** (atoms, molecules, organisms)
- **Platform-specific components** (`components/ui/`)
- **Feature-specific components** (forms, cards, modals)

#### **hooks/** - Custom React Hooks
- **`useThemeColor.ts`** - Theme management
- **`useColorScheme.ts`** - Platform color detection
- **Custom business logic hooks** (useAuth, useApi, etc.)

#### **state/** - Global State Management
- **Context providers** - React Context for global state
- **Zustand stores** - Lightweight state management
- **Redux slices** - If using Redux Toolkit

#### **utils/** - Utility Functions
- **Helper functions** - Date formatting, validation, etc.
- **Constants** - App-wide constants and configuration
- **API utilities** - HTTP client setup, interceptors

#### **types/** - TypeScript Definitions
- **Interface definitions** - Component props, API responses
- **Type declarations** - Custom types and enums
- **Global types** - App-wide type definitions

### **Benefits of This Structure:**

- **Scalability**: Easy to add new features without cluttering
- **Maintainability**: Clear separation of concerns
- **Team collaboration**: Consistent structure across team members
- **Code organization**: Logical grouping of related functionality
- **Type safety**: Centralized TypeScript definitions

### **Best Practices:**

1. **Keep it flat**: Avoid deeply nested folders when possible
2. **Group by feature**: Organize related files together
3. **Use clear naming**: Descriptive folder and file names
4. **Separate concerns**: Keep UI, logic, and data separate
5. **Follow conventions**: Stick to established patterns

This structure provides a solid foundation for building scalable React Native applications with clear organization and maintainable code.

## Scripts & Automation 🔧

The `scripts/` folder contains utility scripts that automate common development tasks. These scripts help streamline your workflow and reduce manual, error-prone processes.

### **What Are Scripts?**

Scripts are Node.js files that automate repetitive tasks like:
- **Project setup** and initialization
- **Code generation** and scaffolding
- **Build processes** and deployment
- **Testing** and quality checks
- **Project maintenance** and cleanup

### **Scripts in Your Project:**

Your project includes a **reset-project.js** script that demonstrates how to create a clean, minimal project state from a starter template.

#### **reset-project.js** - Project Reset Utility
```javascript
#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants 
 * directories to /app-example based on user input and creates a new /app directory 
 * with an index.tsx and _layout.tsx file.
 */
```

**Purpose**: Resets a project to a clean, minimal state by removing example code and creating a blank slate for development.

### **Why Use a Reset Script?**

This script is designed for **starter templates, boilerplates, or frameworks** that come with example code. When starting a new project, developers often want a clean slate rather than all the template examples.

#### **The Context: A Starter Template**

This script is included in a **React Native starter template** that comes with:
- Example components and layouts
- Pre-defined folder structure
- Sample code demonstrating best practices
- Theme management examples

However, when building a real application, developers need a clean slate. This script provides an automated way to get that clean slate.

### **How the Reset Script Works:**

#### **1. User Prompt**
```javascript
rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    // Process user choice
  }
);
```

**Purpose**: Asks the user whether to preserve example code for reference or delete it entirely.

- **'Y' (default)**: Moves example code to `/app-example` directory for reference
- **'N'**: Permanently deletes example code for a truly clean slate

#### **2. Directory Management**
```javascript
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
```

**Process**:
- Defines directories to be moved/deleted
- Creates new clean `app` directory
- Handles both move and delete operations

#### **3. Minimal Content Creation**
```javascript
const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}`;
```

**Purpose**: Creates minimal, working files to start development immediately.

### **Script Breakdown:**

#### **Shebang Declaration**
```javascript
#!/usr/bin/env node
```
Makes the script executable from command line using Node.js.

#### **Core Logic**
1. **User Input Handling**: Prompts for move vs delete decision
2. **Directory Processing**: Loops through directories to move/delete
3. **New Structure Creation**: Creates clean `app` directory
4. **Minimal Files**: Generates basic `index.tsx` and `_layout.tsx`

#### **Error Handling**
```javascript
try {
  // Script operations
} catch (error) {
  console.error(`❌ Error during script execution: ${error.message}`);
}
```

### **Benefits of Using Scripts:**

- **Speed and Efficiency**: Single command vs manual multi-step process
- **Accuracy**: Eliminates human error in repetitive tasks
- **Standardization**: Consistent setup across team members
- **Automation**: Reduces tedious manual work
- **Documentation**: Scripts serve as executable documentation

### **How to Use the Reset Script:**

```bash
# Run the reset script
npm run reset-project

# Or run directly
node scripts/reset-project.js
```

**After running**:
1. Choose whether to preserve example code
2. Script creates clean project structure
3. Start development with `npx expo start`
4. Edit new files in `app/` directory

### **Script Best Practices:**

1. **Clear Purpose**: Each script should have a single, well-defined purpose
2. **User-Friendly**: Provide clear prompts and feedback
3. **Error Handling**: Graceful error handling with helpful messages
4. **Documentation**: Include comments explaining complex logic
5. **Safety**: Ask for confirmation before destructive operations
6. **Flexibility**: Provide options (like move vs delete)

### **Creating Your Own Scripts:**

When creating custom scripts:
- **Use shebang**: `#!/usr/bin/env node`
- **Handle errors**: Wrap in try-catch blocks
- **Provide feedback**: Console logs for user guidance
- **Make configurable**: Accept parameters or prompts
- **Document purpose**: Clear comments and README entries

This script demonstrates how automation can significantly improve the developer experience by turning complex manual processes into simple, reliable commands.

## Additional Resources 📚

### **Authentication Guide**
For comprehensive information about implementing authentication in React Native applications, see our [Authentication Guide](AUTHENTICATION.md).

This guide covers:
- **Backend-as-a-Service solutions** (Firebase, AWS Amplify, Auth0)
- **Custom backend authentication** with JWT tokens
- **Social and passwordless authentication** methods
- **Best practices** for secure authentication
- **Implementation examples** with code samples
- **Recommended libraries** for different authentication needs

### **Best Practices Guide**
For comprehensive React Native development best practices, see our [Best Practices Guide](BEST_PRACTICES.md).

This guide covers:
- **Performance optimization** (FlatList, memoization, asset management)
- **Code reusability** (atomic components, custom hooks, TypeScript)
- **Navigation and routing** (Expo Router best practices)
- **Dependency management** (updates, maintenance, cleanup)
- **Testing and quality assurance** (component testing, error boundaries)
- **Security practices** (secure storage, input validation)
- **Accessibility** (labels, color contrast, screen readers)

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

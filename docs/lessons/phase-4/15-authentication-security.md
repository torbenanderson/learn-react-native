# Lesson 15: Authentication and Security - Secure Your Budget App

## 📚 Theory

### Why Authentication Matters

**The Problem:**
Without authentication, anyone can:
- Access your budget data
- Modify your envelopes
- Delete your transactions
- See your financial information

**The Solution:**
Authentication ensures only authorized users can access their data:

```typescript
// ❌ No authentication - anyone can access
const envelopes = await fetch('/api/envelopes');

// ✅ With authentication - only logged-in users
const envelopes = await fetch('/api/envelopes', {
  headers: {
    'Authorization': 'Bearer user_token_here'
  }
});
```

### Authentication vs Authorization

**Authentication (Who are you?):**
- Verifies user identity
- Login with email/password
- Biometric authentication
- Social login (Google, Apple)

**Authorization (What can you do?):**
- Determines user permissions
- Role-based access control
- Resource ownership
- Feature access levels

```typescript
// Authentication: Verify user is logged in
if (!user.isAuthenticated) {
  redirectToLogin();
}

// Authorization: Check if user can access this data
if (envelope.userId !== user.id) {
  throw new Error('Not authorized to access this envelope');
}
```

### Token-Based Authentication

**How it works:**
1. User logs in with credentials
2. Server validates credentials
3. Server returns a JWT (JSON Web Token)
4. Client stores token securely
5. Client sends token with each request
6. Server validates token for each request

**JWT Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.signature
│                                    │                                                                  │
│                                    │                                                                  └─ Signature (verifies token)
│                                    └─ Payload (user data)
└─ Header (algorithm info)
```

**Token Storage Options:**
- **AsyncStorage**: Easy but less secure
- **Keychain (iOS)**: Most secure
- **Keystore (Android)**: Most secure
- **SecureStore (Expo)**: Cross-platform secure storage

### Security Best Practices

**1. Never Store Sensitive Data in Plain Text:**
```typescript
// ❌ Never do this
const password = 'user123';
await AsyncStorage.setItem('password', password);

// ✅ Hash passwords
const hashedPassword = await bcrypt.hash(password, 10);
```

**2. Use HTTPS for All API Calls:**
```typescript
// ❌ Insecure
const response = await fetch('http://api.budgetapp.com/envelopes');

// ✅ Secure
const response = await fetch('https://api.budgetapp.com/envelopes');
```

**3. Implement Token Refresh:**
```typescript
// When token expires, refresh it automatically
if (response.status === 401) {
  const newToken = await refreshToken();
  // Retry request with new token
}
```

**4. Validate Input on Both Client and Server:**
```typescript
// Client-side validation
if (!email || !isValidEmail(email)) {
  throw new Error('Invalid email');
}

// Server also validates (never trust client)
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand authentication vs authorization
- ✅ Implement JWT-based authentication
- ✅ Store tokens securely
- ✅ Handle login/logout flows
- ✅ Add biometric authentication
- ✅ Implement proper security practices

## 📖 Book Reference

**"React Native in Action" - Chapter 15: Authentication and Security**
- Section 15.1: Authentication concepts
- Section 15.2: JWT tokens and secure storage
- Section 15.3: Login/logout flows
- Section 15.4: Biometric authentication

## 💻 Code Examples

### Example 1: Authentication Service

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class AuthService {
  private tokens: AuthTokens | null = null;
  private user: User | null = null;

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch('https://api.budgetapp.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store tokens securely
      await this.storeTokens(data.tokens);
      this.user = data.user;
      
      return data.user;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.tokens?.accessToken) {
        await fetch('https://api.budgetapp.com/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.tokens.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearTokens();
      this.user = null;
    }
  }

  async refreshToken(): Promise<boolean> {
    if (!this.tokens?.refreshToken) return false;

    try {
      const response = await fetch('https://api.budgetapp.com/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.tokens.refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      await this.storeTokens(data.tokens);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.user !== null && this.tokens !== null;
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }

  private async storeTokens(tokens: AuthTokens): Promise<void> {
    this.tokens = tokens;
    await SecureStore.setItemAsync('auth_tokens', JSON.stringify(tokens));
  }

  private async clearTokens(): Promise<void> {
    this.tokens = null;
    await SecureStore.deleteItemAsync('auth_tokens');
  }

  async loadStoredTokens(): Promise<boolean> {
    try {
      const stored = await SecureStore.getItemAsync('auth_tokens');
      if (stored) {
        this.tokens = JSON.parse(stored);
        
        // Check if token is expired
        if (this.tokens.expiresAt < Date.now()) {
          // Try to refresh
          const refreshed = await this.refreshToken();
          if (!refreshed) {
            await this.clearTokens();
            return false;
          }
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load stored tokens:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
```

### Example 2: Secure API Client

```typescript
class SecureApiClient {
  private baseUrl: string;
  private authService: AuthService;

  constructor(baseUrl: string, authService: AuthService) {
    this.baseUrl = baseUrl;
    this.authService = authService;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.authService.getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    // Handle token expiration
    if (response.status === 401) {
      const refreshed = await this.authService.refreshToken();
      if (refreshed) {
        // Retry with new token
        return this.makeRequest(endpoint, options);
      } else {
        throw new Error('Authentication expired');
      }
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async getEnvelopes(): Promise<Envelope[]> {
    return this.makeRequest<Envelope[]>('/envelopes');
  }

  async createEnvelope(envelope: Omit<Envelope, 'id'>): Promise<Envelope> {
    return this.makeRequest<Envelope>('/envelopes', {
      method: 'POST',
      body: JSON.stringify(envelope),
    });
  }
}
```

### Example 3: Biometric Authentication

```typescript
import * as LocalAuthentication from 'expo-local-authentication';

class BiometricAuth {
  async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  async authenticate(reason: string = 'Authenticate to access your budget'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });
      
      return result.success;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }

  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    return LocalAuthentication.supportedAuthenticationTypesAsync();
  }
}

export const biometricAuth = new BiometricAuth();
```

### Example 4: Authentication Context

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const hasStoredTokens = await authService.loadStoredTokens();
      if (hasStoredTokens) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const user = await authService.login(credentials);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    const refreshed = await authService.refreshToken();
    if (refreshed) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } else {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## 🛠️ Hands-On Exercise

### Goal: Add Authentication to Your Budget App

Let's secure your budget app with user authentication!

**Step 1: Install Dependencies**

```bash
npm install expo-secure-store expo-local-authentication
```

**Step 2: Create Authentication Screens**

Create `/Users/torbenanderson/development/projects/learn-react-native/app/auth/login.tsx`:

```typescript
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to access your budget</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  form: {
    gap: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.sizes.base,
    backgroundColor: Colors.surface,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray400,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});
```

**Step 3: Create Auth Context**

Create `/Users/torbenanderson/development/projects/learn-react-native/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        // In a real app, validate token with server
        const userData = await SecureStore.getItemAsync('user_data');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Mock authentication - replace with real API call
    if (email === 'test@example.com' && password === 'password') {
      const userData: User = {
        id: '1',
        email,
        name: 'Test User',
      };
      
      await SecureStore.setItemAsync('auth_token', 'mock_token');
      await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
      setUser(userData);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

**Step 4: Update App Layout with Auth**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/_layout.tsx`:

```typescript
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginScreen from './auth/login';
import LoadingScreen from '@/components/LoadingScreen';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
```

**Step 5: Add Logout to Settings**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/settings.tsx`:

```typescript
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  userInfo: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  userName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.surface,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});
```

**Step 6: Test Authentication**

```bash
npm start
```

1. Try logging in with `test@example.com` / `password`
2. Navigate around the app
3. Go to settings and logout
4. Verify you're redirected to login screen

## ✅ Checkpoint

### What You Should See
- Login screen on first app launch
- Successful login redirects to main app
- User info displayed in settings
- Logout functionality works
- App remembers login state

### Can You Answer These?
1. What's the difference between authentication and authorization?
2. How do JWT tokens work?
3. Why is secure storage important for tokens?
4. What are the benefits of biometric authentication?
5. How do you handle token expiration?

### Common Issues

**Issue**: "Cannot find module 'expo-secure-store'"
- **Solution**: Run `npm install expo-secure-store`

**Issue**: Login not working
- **Solution**: Check that you're using the correct credentials (test@example.com / password)

**Issue**: App crashes on startup
- **Solution**: Make sure AuthProvider wraps your app

## 🚀 Next Steps

### Preview of Lesson 16: Advanced UI Components
In the next lesson, you'll learn how to:
- Create custom animated components
- Build complex form components
- Implement advanced navigation patterns
- Add gesture handling
- Create reusable UI libraries

### Key Takeaways
- ✅ Authentication verifies user identity
- ✅ JWT tokens provide stateless authentication
- ✅ Secure storage protects sensitive data
- ✅ Biometric auth improves user experience
- ✅ Always validate input and handle errors
- ✅ Implement proper logout functionality

**Excellent work completing Lesson 15!** Your app is now secure and user-friendly. Tomorrow, we'll build advanced UI components!

---

**Time to complete**: ~3-4 hours
**Difficulty**: ⭐⭐⭐⭐☆ Advanced
**Previous lesson**: [14-api-integration.md](./14-api-integration.md)
**Next lesson**: [16-advanced-ui-components.md](./16-advanced-ui-components.md)

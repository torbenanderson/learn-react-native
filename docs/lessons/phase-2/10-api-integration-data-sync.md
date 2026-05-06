# Lesson 10: API Integration and Data Sync - Connect Your Budget to the Cloud

## 📚 Theory

### Why API Integration?

**The Problem with Local-Only Apps:**
- Data only exists on one device
- No backup if device is lost
- Can't access data from other devices
- No real-time collaboration
- Limited to device storage

**The Solution: Cloud Integration**
- Data backed up automatically
- Access from any device
- Real-time synchronization
- Collaborative features
- Unlimited storage

### Understanding REST APIs

**What is a REST API?**
REST (Representational State Transfer) is an architectural style for designing web services. It uses HTTP methods to perform operations on resources.

**HTTP Methods:**
- `GET` - Retrieve data (read)
- `POST` - Create new data
- `PUT` - Update existing data (replace)
- `PATCH` - Update existing data (partial)
- `DELETE` - Remove data

**API Endpoints:**
```
GET    /api/envelopes          - Get all envelopes
POST   /api/envelopes          - Create new envelope
GET    /api/envelopes/123      - Get specific envelope
PUT    /api/envelopes/123      - Update envelope
DELETE /api/envelopes/123      - Delete envelope
```

### Network Request Lifecycle

**1. Request Phase:**
```typescript
// 1. Create request
const request = {
  method: 'POST',
  url: 'https://api.budgetapp.com/envelopes',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({
    name: 'Groceries',
    allocated: 500
  })
};

// 2. Send request
const response = await fetch(request.url, {
  method: request.method,
  headers: request.headers,
  body: request.body
});
```

**2. Response Phase:**
```typescript
// 3. Check response status
if (response.ok) {
  // 4. Parse response data
  const data = await response.json();
  console.log('Success:', data);
} else {
  // 5. Handle error
  console.error('Error:', response.status, response.statusText);
}
```

### Error Handling Strategies

**Network Errors:**
- No internet connection
- Server down
- Timeout
- DNS resolution failed

**HTTP Errors:**
- 400 Bad Request (client error)
- 401 Unauthorized (authentication)
- 403 Forbidden (permission)
- 404 Not Found (resource doesn't exist)
- 500 Internal Server Error (server error)

**Error Handling Pattern:**
```typescript
try {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  if (error.name === 'TypeError') {
    // Network error (no internet, server down)
    throw new Error('Network error. Please check your connection.');
  } else {
    // HTTP error or other error
    throw error;
  }
}
```

### Data Synchronization Strategies

**1. Optimistic Updates:**
Update UI immediately, sync in background:

```typescript
const addEnvelope = async (envelope) => {
  // 1. Update UI immediately (optimistic)
  setEnvelopes(prev => [...prev, envelope]);
  
  try {
    // 2. Sync to server in background
    await api.createEnvelope(envelope);
  } catch (error) {
    // 3. Revert on failure
    setEnvelopes(prev => prev.filter(e => e.id !== envelope.id));
    showError('Failed to save envelope');
  }
};
```

**2. Pessimistic Updates:**
Wait for server confirmation before updating UI:

```typescript
const addEnvelope = async (envelope) => {
  try {
    // 1. Save to server first
    const savedEnvelope = await api.createEnvelope(envelope);
    
    // 2. Update UI only after success
    setEnvelopes(prev => [...prev, savedEnvelope]);
  } catch (error) {
    showError('Failed to save envelope');
  }
};
```

**3. Conflict Resolution:**
Handle conflicts when data changes on multiple devices:

```typescript
const syncEnvelope = async (localEnvelope) => {
  try {
    const serverEnvelope = await api.getEnvelope(localEnvelope.id);
    
    if (serverEnvelope.updatedAt > localEnvelope.updatedAt) {
      // Server has newer version, use server data
      return serverEnvelope;
    } else {
      // Local has newer version, update server
      await api.updateEnvelope(localEnvelope);
      return localEnvelope;
    }
  } catch (error) {
    // Handle conflict resolution
    return resolveConflict(localEnvelope, serverEnvelope);
  }
};
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand REST API concepts and HTTP methods
- ✅ Make network requests with proper error handling
- ✅ Implement data synchronization strategies
- ✅ Handle offline/online states
- ✅ Add authentication to API requests
- ✅ Build a robust API service layer

## 📖 Book Reference

**"React Native in Action" - Chapter 10: API Integration**
- Section 10.1: REST API fundamentals
- Section 10.2: Making HTTP requests
- Section 10.3: Error handling and retry logic
- Section 10.4: Data synchronization patterns

## 💻 Code Examples

### Example 1: Basic API Service

```typescript
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  // Envelope endpoints
  async getEnvelopes(): Promise<Envelope[]> {
    return this.request<Envelope[]>('/envelopes');
  }

  async createEnvelope(envelope: Omit<Envelope, 'id'>): Promise<Envelope> {
    return this.request<Envelope>('/envelopes', {
      method: 'POST',
      body: JSON.stringify(envelope),
    });
  }

  async updateEnvelope(id: string, envelope: Partial<Envelope>): Promise<Envelope> {
    return this.request<Envelope>(`/envelopes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(envelope),
    });
  }

  async deleteEnvelope(id: string): Promise<void> {
    return this.request<void>(`/envelopes/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService('https://api.budgetapp.com');
```

### Example 2: Retry Logic with Exponential Backoff

```typescript
class ApiService {
  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.request<T>(endpoint, options);
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error.message.includes('HTTP 4')) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}
```

### Example 3: Offline Detection and Queue

```typescript
import NetInfo from '@react-native-community/netinfo';

class OfflineQueue {
  private queue: Array<() => Promise<void>> = [];
  private isOnline: boolean = true;

  constructor() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      
      if (this.isOnline) {
        this.processQueue();
      }
    });
  }

  addToQueue(operation: () => Promise<void>) {
    this.queue.push(operation);
    
    if (this.isOnline) {
      this.processQueue();
    }
  }

  private async processQueue() {
    while (this.queue.length > 0 && this.isOnline) {
      const operation = this.queue.shift();
      try {
        await operation();
      } catch (error) {
        console.error('Queue operation failed:', error);
        // Re-add to queue for retry
        this.queue.unshift(operation);
        break;
      }
    }
  }
}

export const offlineQueue = new OfflineQueue();
```

### Example 4: Data Synchronization Hook

```typescript
function useDataSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected ?? false;
      setIsOnline(online);
      
      if (online) {
        syncData();
      }
    });

    return unsubscribe;
  }, []);

  const syncData = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      // Sync envelopes
      const localEnvelopes = await StorageService.loadData();
      const serverEnvelopes = await apiService.getEnvelopes();
      
      // Merge and resolve conflicts
      const mergedEnvelopes = mergeData(localEnvelopes.envelopes, serverEnvelopes);
      
      // Update local storage
      await StorageService.saveData({
        ...localEnvelopes,
        envelopes: mergedEnvelopes,
      });
      
      setLastSync(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    lastSync,
    syncData,
  };
}
```

## 🛠️ Hands-On Exercise

### Goal: Add Cloud Sync to Your Budget App

Let's connect your budget app to a mock API and add synchronization!

**Step 1: Install Dependencies**

```bash
npm install @react-native-community/netinfo
```

**Step 2: Create API Service**

Create `/Users/torbenanderson/development/projects/learn-react-native/services/apiService.ts`:

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface ApiError {
  message: string;
  code: number;
  details?: any;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'https://jsonplaceholder.typicode.com') {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError({
          message: errorData.message || `HTTP ${response.status}`,
          code: response.status,
          details: errorData,
        });
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new ApiError({
          message: 'Network error. Please check your connection.',
          code: 0,
        });
      }
      throw error;
    }
  }

  // Envelope endpoints
  async getEnvelopes(): Promise<Envelope[]> {
    // For demo, we'll use a mock endpoint
    return this.request<Envelope[]>('/posts?_limit=5');
  }

  async createEnvelope(envelope: Omit<Envelope, 'id'>): Promise<Envelope> {
    return this.request<Envelope>('/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: envelope.name,
        body: JSON.stringify(envelope),
        userId: 1,
      }),
    });
  }

  async updateEnvelope(id: string, envelope: Partial<Envelope>): Promise<Envelope> {
    return this.request<Envelope>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: envelope.name,
        body: JSON.stringify(envelope),
        userId: 1,
      }),
    });
  }

  async deleteEnvelope(id: string): Promise<void> {
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export { ApiError };
```

**Step 3: Create Network Status Hook**

Create `/Users/torbenanderson/development/projects/learn-react-native/hooks/useNetworkStatus.ts`:

```typescript
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      setConnectionType(state.type);
    });

    return unsubscribe;
  }, []);

  return {
    isOnline,
    connectionType,
  };
}
```

**Step 4: Update Budget Store with Sync**

Update `/Users/torbenanderson/development/projects/learn-react-native/stores/budgetStore.ts`:

```typescript
import { create } from 'zustand';
import { apiService } from '@/services/apiService';
import { StorageService } from '@/services/storageService';

// ... existing interfaces ...

const useBudgetStore = create<BudgetStore>((set, get) => ({
  // ... existing state ...

  // Add sync actions
  syncWithServer: async () => {
    set({ loading: true, error: null });
    try {
      // Get server data
      const serverEnvelopes = await apiService.getEnvelopes();
      
      // Get local data
      const localData = await StorageService.loadData();
      
      // Merge data (server wins for conflicts)
      const mergedEnvelopes = mergeEnvelopes(
        localData?.envelopes || [],
        serverEnvelopes
      );
      
      // Update local state
      set({
        envelopes: mergedEnvelopes,
        loading: false,
      });
      
      // Save merged data
      await StorageService.saveData({
        envelopes: mergedEnvelopes,
        transactions: localData?.transactions || [],
        totalIncome: localData?.totalIncome || 3000,
      });
      
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  pushToServer: async () => {
    const state = get();
    try {
      // Push local changes to server
      for (const envelope of state.envelopes) {
        if (envelope.id.startsWith('local_')) {
          // This is a local-only envelope, create on server
          await apiService.createEnvelope(envelope);
        }
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Update existing actions to sync
  addEnvelope: (envelope) => {
    set((state) => {
      const newEnvelope = {
        ...envelope,
        id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      const newState = {
        envelopes: [...state.envelopes, newEnvelope]
      };
      
      // Auto-save and sync
      setTimeout(async () => {
        await get().saveToStorage();
        await get().pushToServer();
      }, 0);
      
      return newState;
    });
  },
}));

// Helper function to merge envelopes
function mergeEnvelopes(local: Envelope[], server: any[]): Envelope[] {
  const serverMap = new Map(server.map(env => [env.id, env]));
  const localMap = new Map(local.map(env => [env.id, env]));
  
  const merged: Envelope[] = [];
  
  // Add all server envelopes
  for (const [id, env] of serverMap) {
    merged.push(env);
  }
  
  // Add local-only envelopes
  for (const [id, env] of localMap) {
    if (!serverMap.has(id)) {
      merged.push(env);
    }
  }
  
  return merged;
}
```

**Step 5: Add Sync Status Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/SyncStatus.tsx`:

```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useBudgetStore } from '@/stores/budgetStore';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';

function SyncStatus() {
  const { isOnline, connectionType } = useNetworkStatus();
  const { syncWithServer, isSyncing, lastSync } = useBudgetStore();

  const handleSync = () => {
    syncWithServer();
  };

  const getStatusText = () => {
    if (isSyncing) return 'Syncing...';
    if (!isOnline) return 'Offline';
    if (lastSync) {
      const minutesAgo = Math.floor((Date.now() - lastSync.getTime()) / 60000);
      return `Last sync: ${minutesAgo}m ago`;
    }
    return 'Ready to sync';
  };

  const getStatusColor = () => {
    if (isSyncing) return Colors.warning;
    if (!isOnline) return Colors.error;
    return Colors.success;
  };

  return (
    <View style={styles.container}>
      <View style={styles.status}>
        <View style={[styles.indicator, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
      
      {isOnline && (
        <TouchableOpacity 
          style={styles.syncButton}
          onPress={handleSync}
          disabled={isSyncing}
        >
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    margin: Spacing.md,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  syncButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  syncButtonText: {
    color: Colors.surface,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});

export default SyncStatus;
```

**Step 6: Add Sync to Home Screen**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx`:

```typescript
import { ScrollView, StyleSheet } from 'react-native';
import BudgetSummary from '@/components/budget/BudgetSummary';
import AllocateFunds from '@/components/budget/AllocateFunds';
import EnvelopeCard from '@/components/budget/EnvelopeCard';
import SyncStatus from '@/components/SyncStatus';
import { useBudgetStore } from '@/stores/budgetStore';
import { Colors } from '@/constants/Design';

export default function HomeScreen() {
  const { 
    envelopes, 
    getTotalAllocated, 
    getTotalSpent, 
    totalIncome,
    syncWithServer 
  } = useBudgetStore();
  
  const totalAllocated = getTotalAllocated();
  const totalSpent = getTotalSpent();
  
  return (
    <ScrollView style={styles.container}>
      <SyncStatus />
      
      <BudgetSummary
        totalIncome={totalIncome}
        totalAllocated={totalAllocated}
        totalSpent={totalSpent}
      />
      
      <AllocateFunds />
      
      {envelopes.map(envelope => (
        <EnvelopeCard
          key={envelope.id}
          id={envelope.id}
          name={envelope.name}
          icon={envelope.icon}
          allocated={envelope.allocated}
          spent={envelope.spent}
          color={envelope.color}
        />
      ))}
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

**Step 7: Test API Integration**

```bash
npm start
```

1. Add some envelopes
2. Check the sync status
3. Try going offline and online
4. Watch the sync indicator change

## ✅ Checkpoint

### What You Should See
- Sync status indicator showing online/offline state
- "Sync Now" button when online
- Last sync time display
- Automatic sync when coming back online
- Error handling for network failures

### Can You Answer These?
1. What are the main HTTP methods and when do you use them?
2. How do you handle network errors gracefully?
3. What's the difference between optimistic and pessimistic updates?
4. How do you implement offline/online detection?
5. What is data synchronization and why is it important?

### Common Issues

**Issue**: "Cannot find module '@react-native-community/netinfo'"
- **Solution**: Run `npm install @react-native-community/netinfo`

**Issue**: API requests failing
- **Solution**: Check network connection and API endpoint URLs

**Issue**: Sync not working
- **Solution**: Verify that the API service is properly configured

## 🚀 Next Steps

### Preview of Lesson 11: Authentication and Security
In the next lesson, you'll learn how to:
- Implement user authentication
- Secure API requests with tokens
- Handle login/logout flows
- Store sensitive data securely
- Add biometric authentication

### Key Takeaways
- ✅ REST APIs use HTTP methods for CRUD operations
- ✅ Always handle network errors and timeouts
- ✅ Implement retry logic for failed requests
- ✅ Use optimistic updates for better UX
- ✅ Sync data when coming back online
- ✅ Show clear status indicators to users

**Outstanding work completing Lesson 10!** Your app now has cloud connectivity. Tomorrow, we'll add security and authentication!

---

**Time to complete**: ~3-4 hours
**Difficulty**: ⭐⭐⭐⭐☆ Advanced
**Previous lesson**: [09-asyncstorage-data-persistence.md](./09-asyncstorage-data-persistence.md)
**Next lesson**: [11-authentication-security.md](./11-authentication-security.md)

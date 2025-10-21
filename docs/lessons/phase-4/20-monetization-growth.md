# Lesson 20: Monetization and Growth - Turn Your Budget App Into a Business

## 📚 Theory

### Why Monetization Matters

**The Reality**: Building apps costs money and time
- **Development Time**: Months of work
- **Server Costs**: Hosting, APIs, databases
- **App Store Fees**: 30% to Apple/Google
- **Maintenance**: Updates, bug fixes, support
- **Marketing**: User acquisition costs

**The Opportunity**: Successful apps can generate significant revenue
- **Passive Income**: Apps can earn while you sleep
- **Scalability**: One app can serve millions of users
- **Recurring Revenue**: Subscriptions provide predictable income
- **Portfolio Value**: Successful apps enhance your career

### Monetization Strategies

**1. Freemium Model:**
- Free basic features
- Premium features for paid users
- Most common for productivity apps

**2. Subscription Model:**
- Monthly/yearly recurring revenue
- Predictable income stream
- Best for apps with ongoing value

**3. One-Time Purchase:**
- Pay once, use forever
- Simple for users to understand
- Lower revenue potential

**4. In-App Purchases:**
- Buy additional features/content
- Flexible pricing options
- Can combine with other models

**5. Advertising:**
- Free app with ads
- Revenue from ad impressions
- Can reduce user experience

### Growth Strategies

**1. App Store Optimization (ASO):**
- Optimize app title and description
- Use relevant keywords
- High-quality screenshots
- Positive reviews and ratings

**2. User Acquisition:**
- Social media marketing
- Content marketing
- Influencer partnerships
- Paid advertising

**3. User Retention:**
- Onboarding experience
- Push notifications
- Regular updates
- Customer support

**4. Viral Growth:**
- Share features
- Referral programs
- Social integration
- Word-of-mouth

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Understand different monetization models
- ✅ Implement in-app purchases
- ✅ Set up subscription billing
- ✅ Track user engagement metrics
- ✅ Optimize for app store discovery
- ✅ Plan a growth strategy

## 📖 Book Reference

**"React Native in Action" - Chapter 20: Monetization and Growth**
- Section 20.1: Monetization strategies
- Section 20.2: In-app purchases and subscriptions
- Section 20.3: App store optimization
- Section 20.4: Growth and retention

## 💻 Code Examples

### Example 1: In-App Purchase Setup

```typescript
import { Platform } from 'react-native';
import { initConnection, getProducts, requestPurchase, finishTransaction } from 'react-native-iap';

interface Product {
  productId: string;
  price: string;
  currency: string;
  title: string;
  description: string;
}

class InAppPurchaseService {
  private products: Product[] = [];
  private isInitialized = false;

  async initialize() {
    try {
      const result = await initConnection();
      this.isInitialized = result;
      
      if (this.isInitialized) {
        await this.loadProducts();
      }
      
      return this.isInitialized;
    } catch (error) {
      console.error('IAP initialization failed:', error);
      return false;
    }
  }

  private async loadProducts() {
    const productIds = [
      'premium_monthly',
      'premium_yearly',
      'unlimited_envelopes',
      'cloud_sync',
    ];

    try {
      const products = await getProducts({ skus: productIds });
      this.products = products;
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  async purchaseProduct(productId: string) {
    try {
      const result = await requestPurchase({ skus: [productId] });
      
      if (result.responseCode === 'OK') {
        await finishTransaction({ purchase: result, isConsumable: false });
        return { success: true, purchase: result };
      }
      
      return { success: false, error: 'Purchase failed' };
    } catch (error) {
      console.error('Purchase failed:', error);
      return { success: false, error: error.message };
    }
  }

  getProducts() {
    return this.products;
  }

  isProductPurchased(productId: string): boolean {
    // Check if product is already purchased
    // This would typically check against your backend or local storage
    return false;
  }
}

export const iapService = new InAppPurchaseService();
```

### Example 2: Subscription Management

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Subscription {
  productId: string;
  purchaseDate: string;
  expiryDate: string;
  isActive: boolean;
  isTrial: boolean;
}

class SubscriptionService {
  private subscription: Subscription | null = null;

  async initialize() {
    try {
      const stored = await AsyncStorage.getItem('subscription');
      if (stored) {
        this.subscription = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  }

  async activateSubscription(productId: string, purchaseData: any) {
    const subscription: Subscription = {
      productId,
      purchaseDate: new Date().toISOString(),
      expiryDate: this.calculateExpiryDate(productId),
      isActive: true,
      isTrial: productId.includes('trial'),
    };

    this.subscription = subscription;
    await this.saveSubscription();
  }

  private calculateExpiryDate(productId: string): string {
    const now = new Date();
    
    if (productId.includes('monthly')) {
      now.setMonth(now.getMonth() + 1);
    } else if (productId.includes('yearly')) {
      now.setFullYear(now.getFullYear() + 1);
    } else if (productId.includes('trial')) {
      now.setDate(now.getDate() + 7); // 7-day trial
    }
    
    return now.toISOString();
  }

  isSubscriptionActive(): boolean {
    if (!this.subscription) return false;
    
    const now = new Date();
    const expiry = new Date(this.subscription.expiryDate);
    
    return this.subscription.isActive && now < expiry;
  }

  getSubscriptionTier(): 'free' | 'premium' {
    return this.isSubscriptionActive() ? 'premium' : 'free';
  }

  private async saveSubscription() {
    try {
      await AsyncStorage.setItem('subscription', JSON.stringify(this.subscription));
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  }
}

export const subscriptionService = new SubscriptionService();
```

### Example 3: Feature Gating

```typescript
import { subscriptionService } from './subscriptionService';

interface FeatureGate {
  name: string;
  freeLimit: number;
  premiumUnlimited: boolean;
}

const FEATURES: Record<string, FeatureGate> = {
  envelopes: {
    name: 'Envelopes',
    freeLimit: 3,
    premiumUnlimited: true,
  },
  cloudSync: {
    name: 'Cloud Sync',
    freeLimit: 0,
    premiumUnlimited: true,
  },
  analytics: {
    name: 'Analytics',
    freeLimit: 0,
    premiumUnlimited: true,
  },
  export: {
    name: 'Export Data',
    freeLimit: 1,
    premiumUnlimited: true,
  },
};

class FeatureGateService {
  canUseFeature(featureName: string, currentUsage: number = 0): boolean {
    const feature = FEATURES[featureName];
    if (!feature) return true;

    const isPremium = subscriptionService.getSubscriptionTier() === 'premium';
    
    if (isPremium && feature.premiumUnlimited) {
      return true;
    }
    
    return currentUsage < feature.freeLimit;
  }

  getFeatureLimit(featureName: string): number {
    const feature = FEATURES[featureName];
    if (!feature) return -1;

    const isPremium = subscriptionService.getSubscriptionTier() === 'premium';
    
    if (isPremium && feature.premiumUnlimited) {
      return -1; // Unlimited
    }
    
    return feature.freeLimit;
  }

  getUpgradeMessage(featureName: string): string {
    const feature = FEATURES[featureName];
    if (!feature) return '';

    const isPremium = subscriptionService.getSubscriptionTier() === 'premium';
    
    if (isPremium) return '';

    if (feature.premiumUnlimited) {
      return `Unlock ${feature.name} with Premium subscription`;
    }
    
    return `You've reached the limit for ${feature.name}. Upgrade to Premium for unlimited access.`;
  }
}

export const featureGate = new FeatureGateService();
```

### Example 4: Analytics and Tracking

```typescript
import { Platform } from 'react-native';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !__DEV__; // Only enable in production
  }

  track(eventName: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        platform: Platform.OS,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    this.events.push(event);
    console.log('Analytics Event:', event);

    // In production, send to your analytics service
    // this.sendToAnalytics(event);
  }

  trackScreenView(screenName: string) {
    this.track('screen_view', {
      screen_name: screenName,
    });
  }

  trackUserAction(action: string, category: string, value?: number) {
    this.track('user_action', {
      action,
      category,
      value,
    });
  }

  trackPurchase(productId: string, price: number, currency: string) {
    this.track('purchase', {
      product_id: productId,
      price,
      currency,
    });
  }

  trackSubscription(subscriptionTier: string, isTrial: boolean) {
    this.track('subscription', {
      tier: subscriptionTier,
      is_trial: isTrial,
    });
  }

  trackFeatureUsage(featureName: string, usageCount: number) {
    this.track('feature_usage', {
      feature_name: featureName,
      usage_count: usageCount,
    });
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    // Send to your analytics service (Firebase, Mixpanel, etc.)
    // await analytics().logEvent(event.name, event.properties);
  }
}

export const analytics = new AnalyticsService();
```

## 🛠️ Hands-On Exercise

### Goal: Add Monetization to Your Budget App

Let's implement a freemium model with premium features!

**Step 1: Install In-App Purchase Dependencies**

```bash
npm install react-native-iap
```

**Step 2: Create Premium Features Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/PremiumFeatures.tsx`:

```typescript
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { iapService } from '@/services/iapService';
import { subscriptionService } from '@/services/subscriptionService';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';

function PremiumFeatures() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    await subscriptionService.initialize();
    await iapService.initialize();
    
    const iapProducts = iapService.getProducts();
    setProducts(iapProducts);
    
    const premium = subscriptionService.isSubscriptionActive();
    setIsPremium(premium);
  };

  const handlePurchase = async (productId: string) => {
    setIsLoading(true);
    try {
      const result = await iapService.purchaseProduct(productId);
      
      if (result.success) {
        await subscriptionService.activateSubscription(productId, result.purchase);
        setIsPremium(true);
        Alert.alert('Success', 'Premium features unlocked!');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPremium) {
    return (
      <View style={styles.premiumContainer}>
        <Text style={styles.premiumTitle}>🎉 Premium Active</Text>
        <Text style={styles.premiumText}>
          You have access to all premium features!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Premium Features</Text>
      <Text style={styles.subtitle}>
        Get unlimited envelopes, cloud sync, and more
      </Text>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📁</Text>
          <Text style={styles.featureText}>Unlimited Envelopes</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>☁️</Text>
          <Text style={styles.featureText}>Cloud Sync</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📊</Text>
          <Text style={styles.featureText}>Advanced Analytics</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📤</Text>
          <Text style={styles.featureText}>Export Data</Text>
        </View>
      </View>

      <View style={styles.pricing}>
        {products.map(product => (
          <TouchableOpacity
            key={product.productId}
            style={styles.pricingCard}
            onPress={() => handlePurchase(product.productId)}
            disabled={isLoading}
          >
            <Text style={styles.pricingTitle}>
              {product.title}
            </Text>
            <Text style={styles.pricingPrice}>
              {product.price}
            </Text>
            <Text style={styles.pricingDescription}>
              {product.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    margin: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  features: {
    marginBottom: Spacing.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  pricing: {
    gap: Spacing.md,
  },
  pricingCard: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  pricingPrice: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  pricingDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.surface,
    opacity: 0.8,
    textAlign: 'center',
  },
  premiumContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.lg,
    margin: Spacing.md,
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
    marginBottom: Spacing.sm,
  },
  premiumText: {
    fontSize: Typography.sizes.base,
    color: Colors.surface,
    opacity: 0.9,
  },
});

export default PremiumFeatures;
```

**Step 3: Add Feature Gates to Components**

Update `/Users/torbenanderson/development/projects/learn-react-native/components/budget/AllocateFunds.tsx`:

```typescript
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { featureGate } from '@/services/featureGateService';
import { subscriptionService } from '@/services/subscriptionService';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';

function AllocateFunds() {
  const [envelopeName, setEnvelopeName] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [envelopeCount, setEnvelopeCount] = useState(0); // Track current count

  const handleAllocate = () => {
    const amount = parseFloat(allocatedAmount);
    
    if (!envelopeName.trim()) {
      Alert.alert("Error", "Please enter an envelope name");
      return;
    }
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    // Check if user can create more envelopes
    if (!featureGate.canUseFeature('envelopes', envelopeCount)) {
      const message = featureGate.getUpgradeMessage('envelopes');
      Alert.alert(
        "Envelope Limit Reached",
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {/* Navigate to premium */} }
        ]
      );
      return;
    }
    
    // Create envelope logic here
    console.log('Creating envelope:', envelopeName, amount);
    setEnvelopeCount(prev => prev + 1);
    setEnvelopeName("");
    setAllocatedAmount("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allocate Funds</Text>
      
      <View style={styles.limitInfo}>
        <Text style={styles.limitText}>
          Envelopes: {envelopeCount}/{featureGate.getFeatureLimit('envelopes')}
        </Text>
        {!subscriptionService.isSubscriptionActive() && (
          <Text style={styles.upgradeText}>
            Upgrade for unlimited envelopes
          </Text>
        )}
      </View>
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    margin: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  limitInfo: {
    backgroundColor: Colors.gray100,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  limitText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  upgradeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  form: {
    gap: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.base,
    backgroundColor: Colors.background,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});

export default AllocateFunds;
```

**Step 4: Add Premium Tab to Settings**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/settings.tsx`:

```typescript
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import PremiumFeatures from '@/components/PremiumFeatures';
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <PremiumFeatures />

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginTop: Spacing.xl,
  },
  logoutButtonText: {
    color: Colors.surface,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});
```

**Step 5: Add Analytics Tracking**

Update `/Users/torbenanderson/development/projects/learn-react-native/app/(tabs)/index.tsx`:

```typescript
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import BudgetSummary from '@/components/budget/BudgetSummary';
import AllocateFunds from '@/components/budget/AllocateFunds';
import EnvelopeCard from '@/components/budget/EnvelopeCard';
import { useBudgetStore } from '@/stores/budgetStore';
import { analytics } from '@/services/analyticsService';
import { Colors } from '@/constants/Design';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { 
    envelopes, 
    getTotalAllocated, 
    getTotalSpent, 
    totalIncome,
    syncWithServer,
    deleteEnvelope 
  } = useBudgetStore();
  
  const totalAllocated = getTotalAllocated();
  const totalSpent = getTotalSpent();

  useEffect(() => {
    // Track screen view
    analytics.trackScreenView('home');
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await syncWithServer();
      analytics.trackUserAction('refresh', 'data_sync');
    } finally {
      setRefreshing(false);
    }
  }, [syncWithServer]);

  const handleEnvelopePress = useCallback((envelopeId: string) => {
    analytics.trackUserAction('envelope_view', 'navigation');
    // Navigate to envelope details
    console.log('View envelope:', envelopeId);
  }, []);

  const handleEnvelopeDelete = useCallback((envelopeId: string) => {
    analytics.trackUserAction('envelope_delete', 'envelope_management');
    deleteEnvelope(envelopeId);
  }, [deleteEnvelope]);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.primary}
        />
      }
    >
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
          onPress={() => handleEnvelopePress(envelope.id)}
          onDelete={() => handleEnvelopeDelete(envelope.id)}
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

**Step 6: Test Monetization Features**

```bash
npm start
```

1. Try creating more than 3 envelopes (free limit)
2. See the upgrade prompt
3. Test the premium features screen
4. Check analytics tracking in console

## ✅ Checkpoint

### What You Should See
- Premium features screen with pricing
- Envelope limit enforcement
- Upgrade prompts when limits reached
- Analytics tracking in console
- Subscription status display

### Can You Answer These?
1. What are the different monetization models?
2. How do you implement in-app purchases?
3. What is feature gating and why use it?
4. How do you track user engagement?
5. What metrics should you monitor for growth?

### Common Issues

**Issue**: In-app purchases not working
- **Solution**: Check product IDs and store configuration

**Issue**: Feature gates not working
- **Solution**: Ensure subscription service is properly initialized

**Issue**: Analytics not tracking
- **Solution**: Check if analytics is enabled and properly configured

## 🚀 Next Steps

### Congratulations! You've Completed the Full Curriculum!

You now have:
- ✅ A complete, production-ready budget app
- ✅ Advanced React Native skills
- ✅ Knowledge of state management, APIs, and security
- ✅ Experience with testing and deployment
- ✅ Understanding of monetization and growth

### Your Next Steps:
1. **Deploy your app** to the app stores
2. **Gather user feedback** and iterate
3. **Add more features** based on user needs
4. **Build your next app** using these skills
5. **Share your success** with the community

### Key Takeaways
- ✅ Monetization is essential for sustainable apps
- ✅ Freemium models work well for productivity apps
- ✅ Feature gating encourages upgrades
- ✅ Analytics help understand user behavior
- ✅ Growth requires both product and marketing efforts

**🎉 Congratulations on completing the entire React Native curriculum!** You've built a complete, professional budget app and learned all the skills needed to create amazing mobile applications. Now go out there and build something incredible!

---

**Time to complete**: ~3-4 hours
**Difficulty**: ⭐⭐⭐⭐☆ Advanced
**Previous lesson**: [19-deployment-distribution.md](./19-deployment-distribution.md)
**Final lesson**: Complete! 🎉

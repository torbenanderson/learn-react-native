# Lesson 19: Deployment and Distribution - Launch Your Budget App

## 📚 Theory

### Why Deployment Matters

**The Goal**: Get your app into users' hands and app stores
- **App Store Distribution**: Reach millions of users
- **Professional Credibility**: Published apps look more legitimate
- **User Feedback**: Real users provide valuable insights
- **Monetization**: Start earning from your app
- **Portfolio Value**: Published apps enhance your resume

### Deployment Options

**1. App Store Distribution:**
- **Apple App Store**: iOS apps
- **Google Play Store**: Android apps
- **Both**: Maximum reach

**2. Alternative Distribution:**
- **TestFlight** (iOS): Beta testing
- **Google Play Internal Testing**: Android beta
- **Direct APK**: Android sideloading
- **Enterprise Distribution**: Internal company apps

### Build Types

**1. Development Builds:**
- Debug mode
- Hot reloading enabled
- Larger file size
- Not for production

**2. Production Builds:**
- Optimized code
- Smaller file size
- No debug features
- Ready for app stores

### App Store Requirements

**Apple App Store:**
- App Store Review Guidelines compliance
- Privacy policy required
- App icons in multiple sizes
- Screenshots for different devices
- App description and keywords
- Age rating

**Google Play Store:**
- Content rating questionnaire
- Privacy policy (if collecting data)
- App icons and screenshots
- Store listing details
- Target API level requirements

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Build production-ready apps
- ✅ Configure app metadata and icons
- ✅ Deploy to app stores
- ✅ Set up CI/CD pipelines
- ✅ Handle app updates
- ✅ Monitor app performance

## 📖 Book Reference

**"React Native in Action" - Chapter 19: Deployment and Distribution**
- Section 19.1: Building production apps
- Section 19.2: App store preparation
- Section 19.3: CI/CD setup
- Section 19.4: Monitoring and updates

## 💻 Code Examples

### Example 1: App Configuration

```typescript
// app.json
{
  "expo": {
    "name": "Budget Envelope",
    "slug": "budget-envelope",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.budgetenvelope",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.budgetenvelope",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### Example 2: EAS Build Configuration

```typescript
// eas.json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Example 3: App Store Metadata

```typescript
// app-store-config.json
{
  "ios": {
    "appName": "Budget Envelope",
    "subtitle": "Simple envelope budgeting",
    "description": "Take control of your finances with the proven envelope budgeting method. Allocate money to categories, track spending, and stay on budget with this simple, beautiful app.",
    "keywords": ["budget", "money", "finance", "envelope", "tracking"],
    "category": "FINANCE",
    "ageRating": "4+",
    "screenshots": [
      "./assets/screenshots/ios/1.png",
      "./assets/screenshots/ios/2.png",
      "./assets/screenshots/ios/3.png"
    ]
  },
  "android": {
    "appName": "Budget Envelope",
    "shortDescription": "Simple envelope budgeting app",
    "fullDescription": "Take control of your finances with the proven envelope budgeting method. Allocate money to categories, track spending, and stay on budget with this simple, beautiful app.",
    "keywords": "budget,money,finance,envelope,tracking",
    "category": "FINANCE",
    "contentRating": "EVERYONE",
    "screenshots": [
      "./assets/screenshots/android/1.png",
      "./assets/screenshots/android/2.png",
      "./assets/screenshots/android/3.png"
    ]
  }
}
```

### Example 4: CI/CD Pipeline

```yaml
# .github/workflows/build-and-deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Run linting
      run: npm run lint
    
    - name: Build for production
      run: npx expo build --platform all --type production
      env:
        EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts
        path: |
          *.apk
          *.ipa
```

## 🛠️ Hands-On Exercise

### Goal: Deploy Your Budget App to App Stores

Let's prepare and deploy your budget app for production!

**Step 1: Install EAS CLI**

```bash
npm install -g @expo/eas-cli
```

**Step 2: Configure App Metadata**

Update `/Users/torbenanderson/development/projects/learn-react-native/app.json`:

```json
{
  "expo": {
    "name": "Budget Envelope",
    "slug": "budget-envelope-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.budgetenvelope",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs access to camera to scan receipts",
        "NSPhotoLibraryUsageDescription": "This app needs access to photo library to save receipt images"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.budgetenvelope",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    },
    "plugins": [
      "expo-secure-store",
      "expo-local-authentication"
    ]
  }
}
```

**Step 3: Create EAS Build Configuration**

Create `/Users/torbenanderson/development/projects/learn-react-native/eas.json`:

```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      },
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

**Step 4: Create App Icons and Assets**

Create `/Users/torbenanderson/development/projects/learn-react-native/assets/icon.png`:
- Size: 1024x1024 pixels
- Format: PNG
- Design: Simple envelope icon with budget theme

Create `/Users/torbenanderson/development/projects/learn-react-native/assets/adaptive-icon.png`:
- Size: 1024x1024 pixels
- Format: PNG
- Design: Same as icon but optimized for Android adaptive icons

Create `/Users/torbenanderson/development/projects/learn-react-native/assets/splash.png`:
- Size: 1242x2436 pixels (iPhone X)
- Format: PNG
- Design: App logo centered on white background

**Step 5: Set Up Environment Variables**

Create `/Users/torbenanderson/development/projects/learn-react-native/.env.production`:

```bash
# API Configuration
API_BASE_URL=https://api.budgetenvelope.com
API_TIMEOUT=10000

# Analytics
ANALYTICS_ENABLED=true
ANALYTICS_KEY=your-analytics-key

# Error Reporting
SENTRY_DSN=your-sentry-dsn

# Feature Flags
ENABLE_BIOMETRIC_AUTH=true
ENABLE_CLOUD_SYNC=true
ENABLE_NOTIFICATIONS=true
```

**Step 6: Create Build Scripts**

Update `/Users/torbenanderson/development/projects/learn-react-native/package.json`:

```json
{
  "scripts": {
    "build:ios": "eas build --platform ios --profile production",
    "build:android": "eas build --platform android --profile production",
    "build:all": "eas build --platform all --profile production",
    "submit:ios": "eas submit --platform ios --profile production",
    "submit:android": "eas submit --platform android --profile production",
    "submit:all": "eas submit --platform all --profile production",
    "update:ios": "eas update --platform ios --branch production",
    "update:android": "eas update --platform android --branch production",
    "update:all": "eas update --platform all --branch production"
  }
}
```

**Step 7: Create App Store Screenshots**

Create screenshots for different device sizes:

**iOS Screenshots:**
- iPhone 6.7" (iPhone 14 Pro Max): 1290x2796 pixels
- iPhone 6.5" (iPhone 11 Pro Max): 1242x2688 pixels
- iPhone 5.5" (iPhone 8 Plus): 1242x2208 pixels
- iPad Pro 12.9": 2048x2732 pixels

**Android Screenshots:**
- Phone: 1080x1920 pixels
- Tablet: 1200x1920 pixels

**Step 8: Create Privacy Policy**

Create `/Users/torbenanderson/development/projects/learn-react-native/PRIVACY_POLICY.md`:

```markdown
# Privacy Policy for Budget Envelope

## Information We Collect
- Financial data you input (envelopes, transactions)
- Device information for app functionality
- Usage analytics to improve the app

## How We Use Your Information
- To provide budgeting functionality
- To sync data across your devices
- To improve app performance and features

## Data Storage
- Your data is stored locally on your device
- Optional cloud sync stores encrypted data on secure servers
- You can delete your data at any time

## Third-Party Services
- We use secure cloud storage for optional sync
- Analytics services to understand app usage
- No data is sold to third parties

## Contact Us
If you have questions about this privacy policy, contact us at privacy@budgetenvelope.com
```

**Step 9: Build for Production**

```bash
# Login to EAS
eas login

# Configure project
eas build:configure

# Build for iOS
npm run build:ios

# Build for Android
npm run build:android

# Build for both platforms
npm run build:all
```

**Step 10: Submit to App Stores**

```bash
# Submit to iOS App Store
npm run submit:ios

# Submit to Google Play Store
npm run submit:android

# Submit to both
npm run submit:all
```

**Step 11: Set Up Monitoring**

Create `/Users/torbenanderson/development/projects/learn-react-native/services/analytics.ts`:

```typescript
import { Platform } from 'react-native';

class AnalyticsService {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = __DEV__ ? false : true;
  }

  track(eventName: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    console.log('Analytics Event:', eventName, properties);
    
    // In production, send to your analytics service
    // analytics().logEvent(eventName, properties);
  }

  setUserProperties(properties: Record<string, any>) {
    if (!this.isEnabled) return;

    console.log('User Properties:', properties);
    
    // In production, set user properties
    // analytics().setUserProperties(properties);
  }

  trackScreenView(screenName: string) {
    this.track('screen_view', {
      screen_name: screenName,
      platform: Platform.OS,
    });
  }

  trackEnvelopeCreated(envelopeName: string, amount: number) {
    this.track('envelope_created', {
      envelope_name: envelopeName,
      amount,
    });
  }

  trackTransactionAdded(amount: number, category: string) {
    this.track('transaction_added', {
      amount,
      category,
    });
  }
}

export const analytics = new AnalyticsService();
```

**Step 12: Test Production Build**

```bash
# Install the production build on your device
# Test all features thoroughly
# Verify performance and stability
```

## ✅ Checkpoint

### What You Should See
- Production build created successfully
- App icons and splash screen working
- App submitted to app stores
- Monitoring and analytics set up
- Privacy policy published

### Can You Answer These?
1. What are the requirements for app store submission?
2. How do you create production builds?
3. What metadata is needed for app stores?
4. How do you set up CI/CD pipelines?
5. What monitoring should you implement?

### Common Issues

**Issue**: Build fails
- **Solution**: Check EAS configuration and dependencies

**Issue**: App rejected by store
- **Solution**: Review store guidelines and fix issues

**Issue**: Icons not displaying
- **Solution**: Ensure correct sizes and formats

## 🚀 Next Steps

### Preview of Lesson 20: Monetization and Growth
In the next lesson, you'll learn how to:
- Implement in-app purchases
- Add subscription models
- Track user engagement
- Optimize for app store discovery
- Plan feature roadmap

### Key Takeaways
- ✅ Production builds are optimized and secure
- ✅ App store metadata is crucial for discovery
- ✅ CI/CD pipelines automate deployment
- ✅ Monitoring helps track app performance
- ✅ Privacy policies are required for data collection

**Congratulations on completing Lesson 19!** Your app is now ready for the app stores. Tomorrow, we'll learn about monetization and growth!

---

**Time to complete**: ~4-5 hours
**Difficulty**: ⭐⭐⭐⭐☆ Advanced
**Previous lesson**: [18-testing-debugging.md](./18-testing-debugging.md)
**Next lesson**: [20-monetization-growth.md](./20-monetization-growth.md)

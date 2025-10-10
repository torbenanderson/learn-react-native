# Lesson 07: Forms and Input Handling - Build Transaction Entry Forms

## 📚 Theory

### Forms in React Native

Forms in React Native work differently than web forms. There's no `<form>` tag or submit event. Instead, you manage form state and handle submission manually.

```typescript
// Web HTML form
<form onSubmit={handleSubmit}>
  <input name="email" />
  <button type="submit">Submit</button>
</form>

// React Native form
const [email, setEmail] = useState('');
<TextInput value={email} onChangeText={setEmail} />
<Button onPress={handleSubmit} title="Submit" />
```

### TextInput Component

`TextInput` is the primary input component in React Native:

```typescript
<TextInput
  value={value}                    // Current value
  onChangeText={setValue}          // Update handler
  placeholder="Enter text"         // Placeholder text
  keyboardType="email-address"     // Keyboard type
  autoCapitalize="none"            // Capitalization
  secureTextEntry={true}           // Password input
  multiline={true}                 // Multiple lines
  maxLength={100}                  // Character limit
/>
```

**Keyboard Types:**
- `default` - Standard keyboard
- `email-address` - Email keyboard
- `numeric` - Number pad
- `decimal-pad` - Decimal number pad
- `phone-pad` - Phone number pad
- `number-pad` - Number pad (integers only)

### Form Validation

Validate input before submitting:

```typescript
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const handleSubmit = () => {
  if (!validateEmail(email)) {
    setError('Invalid email address');
    return;
  }
  // Submit form...
};
```

### Controlled vs Uncontrolled Inputs

**Controlled** (recommended in React):
```typescript
const [value, setValue] = useState('');
<TextInput value={value} onChangeText={setValue} />
```

**Uncontrolled** (not recommended):
```typescript
<TextInput onChangeText={(text) => console.log(text)} />
```

### Form State Management

For complex forms, use objects to manage state:

```typescript
const [form, setForm] = useState({
  envelopeName: '',
  amount: '',
  description: '',
  date: new Date().toISOString(),
});

const updateForm = (field: string, value: string) => {
  setForm(prev => ({ ...prev, [field]: value }));
};

<TextInput
  value={form.envelopeName}
  onChangeText={(text) => updateForm('envelopeName', text)}
/>
```

## 🎯 Learning Objectives

By the end of this lesson, you will:
- ✅ Build complex forms with multiple inputs
- ✅ Validate user input
- ✅ Handle different input types
- ✅ Manage form state effectively
- ✅ Show validation errors
- ✅ Create transaction entry forms
- ✅ Format currency input

## 📖 Book Reference

**"React Native in Action" - Chapter 7: Forms and User Input**
- Section 7.1: TextInput component
- Section 7.2: Form validation
- Section 7.3: Keyboard handling
- Section 7.4: Form submission

## 💻 Code Examples

### Example 1: Basic Form

```typescript
import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = () => {
    console.log('Email:', email, 'Password:', password);
  };
  
  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleSubmit} />
    </View>
  );
}
```

### Example 2: Form with Validation

```typescript
function SignupForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const validateEmail = (text: string) => {
    setEmail(text);
    if (text.length === 0) {
      setEmailError('');
      return;
    }
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
    setEmailError(isValid ? '' : 'Invalid email address');
  };
  
  return (
    <View>
      <TextInput
        value={email}
        onChangeText={validateEmail}
        placeholder="Email"
      />
      {emailError ? <Text style={{color: 'red'}}>{emailError}</Text> : null}
    </View>
  );
}
```

### Example 3: Currency Input

```typescript
function CurrencyInput({ value, onChangeValue }) {
  const [display, setDisplay] = useState('');
  
  const handleChange = (text: string) => {
    // Remove non-numeric characters except decimal
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    const formatted = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
    
    setDisplay(formatted);
    onChangeValue(parseFloat(formatted) || 0);
  };
  
  return (
    <TextInput
      value={display}
      onChangeText={handleChange}
      placeholder="0.00"
      keyboardType="decimal-pad"
    />
  );
}
```

### Example 4: Multi-Field Form

```typescript
interface FormData {
  name: string;
  email: string;
  amount: string;
}

function MultiFieldForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    amount: '',
  });
  
  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <View>
      <TextInput
        value={form.name}
        onChangeText={(text) => updateField('name', text)}
        placeholder="Name"
      />
      <TextInput
        value={form.email}
        onChangeText={(text) => updateField('email', text)}
        placeholder="Email"
      />
      <TextInput
        value={form.amount}
        onChangeText={(text) => updateField('amount', text)}
        placeholder="Amount"
        keyboardType="decimal-pad"
      />
    </View>
  );
}
```

## 🛠️ Hands-On Exercise

### Goal: Build a Complete Transaction Entry Form

Let's create a professional transaction entry form with validation!

**Step 1: Create Form Input Component**

Create `/Users/torbenanderson/development/projects/learn-react-native/components/ui/FormInput.tsx`:

```typescript
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Design';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  multiline?: boolean;
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  error,
  multiline = false,
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

export default FormInput;
```

**Step 2: Create Transaction Form Screen**

Create `/Users/torbenanderson/development/projects/learn-react-native/app/transaction/add.tsx`:

```typescript
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import FormInput from '@/components/ui/FormInput';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Design';

interface TransactionForm {
  description: string;
  amount: string;
  envelopeId: string;
  envelopeName: string;
  date: string;
  notes: string;
}

interface FormErrors {
  description?: string;
  amount?: string;
  envelopeId?: string;
}

export default function AddTransactionScreen() {
  const router = useRouter();
  
  const [form, setForm] = useState<TransactionForm>({
    description: '',
    amount: '',
    envelopeId: '',
    envelopeName: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Sample envelopes (will come from store in Lesson 10)
  const envelopes = [
    { id: '1', name: 'Groceries' },
    { id: '2', name: 'Gas' },
    { id: '3', name: 'Entertainment' },
    { id: '4', name: 'Dining Out' },
  ];
  
  const updateField = (field: keyof TransactionForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Enter a valid amount';
    }
    
    if (!form.envelopeId) {
      newErrors.envelopeId = 'Select an envelope';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    // In Lesson 10, we'll save this to the store
    Alert.alert(
      'Success',
      `Added expense: ${form.description} - $${parseFloat(form.amount).toFixed(2)}`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };
  
  const selectEnvelope = (envelope: { id: string; name: string }) => {
    setForm(prev => ({
      ...prev,
      envelopeId: envelope.id,
      envelopeName: envelope.name,
    }));
    if (errors.envelopeId) {
      setErrors(prev => ({ ...prev, envelopeId: undefined }));
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Add Expense</Text>
        
        {/* Description Input */}
        <FormInput
          label="Description"
          value={form.description}
          onChangeText={(text) => updateField('description', text)}
          placeholder="e.g., Whole Foods, Gas Station"
          error={errors.description}
        />
        
        {/* Amount Input */}
        <FormInput
          label="Amount"
          value={form.amount}
          onChangeText={(text) => updateField('amount', text)}
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.amount}
        />
        
        {/* Envelope Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Envelope</Text>
          {errors.envelopeId && (
            <Text style={styles.errorText}>{errors.envelopeId}</Text>
          )}
          <View style={styles.envelopeGrid}>
            {envelopes.map(envelope => (
              <TouchableOpacity
                key={envelope.id}
                style={[
                  styles.envelopeButton,
                  form.envelopeId === envelope.id && styles.envelopeButtonActive,
                ]}
                onPress={() => selectEnvelope(envelope)}
              >
                <Text style={[
                  styles.envelopeButtonText,
                  form.envelopeId === envelope.id && styles.envelopeButtonTextActive,
                ]}>
                  {envelope.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Date Input */}
        <FormInput
          label="Date"
          value={form.date}
          onChangeText={(text) => updateField('date', text)}
          placeholder="YYYY-MM-DD"
        />
        
        {/* Notes Input */}
        <FormInput
          label="Notes (Optional)"
          value={form.notes}
          onChangeText={(text) => updateField('notes', text)}
          placeholder="Add any additional notes..."
          multiline
        />
        
        {/* Summary */}
        {form.amount && form.envelopeName && (
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              ${parseFloat(form.amount || '0').toFixed(2)} from {form.envelopeName}
            </Text>
          </View>
        )}
        
        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Add Expense</Text>
        </TouchableOpacity>
        
        {/* Cancel Button */}
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
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
  section: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  envelopeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  envelopeButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.gray300,
  },
  envelopeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  envelopeButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  envelopeButtonTextActive: {
    color: Colors.surface,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  summary: {
    backgroundColor: Colors.primary + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  summaryText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.primary,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.medium,
  },
  submitButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.surface,
  },
  cancelButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
});
```

**Step 3: Add Quick Access Button**

Update your home screen to add a floating "Add Transaction" button (or add a link from your transactions screen).

**Step 4: Test Your Form**

```bash
npm start
```

Navigate to `/transaction/add` and test:
1. Try submitting empty form (see validation errors)
2. Fill in all fields
3. See the summary update as you type
4. Submit successfully!

## ✅ Checkpoint

### What You Should See
- A complete transaction entry form
- Input validation with error messages
- Envelope selection with visual feedback
- A summary showing what will be added
- Submit button that validates before saving
- Cancel button to go back

### Can You Answer These?
1. What is a controlled input?
2. How do you validate form data?
3. How do you show validation errors?
4. What keyboard types are available?
5. How do you manage multi-field form state?

### Common Issues

**Issue**: Keyboard covers input fields
- **Solution**: Use `KeyboardAvoidingView` with `behavior="padding"` on iOS

**Issue**: Validation not working
- **Solution**: Make sure you're calling `validateForm()` before submission

**Issue**: Input not updating
- **Solution**: Verify you have both `value` and `onChangeText` props

**Issue**: Can't dismiss keyboard
- **Solution**: Wrap in `TouchableWithoutFeedback` and call `Keyboard.dismiss()`

## 🚀 Next Steps

### Preview of Phase 2: Data & State Management
Congratulations! You've completed Phase 1 (Core Concepts)! 

In Phase 2 (Lessons 8-14), you'll learn:
- **Lesson 08**: State management patterns (useState vs Context vs Zustand)
- **Lesson 09**: Context API for global state
- **Lesson 10**: AsyncStorage for data persistence
- **Lesson 11**: Data fetching and async operations
- **Lesson 12**: useEffect and lifecycle management
- **Lesson 13**: Custom hooks for reusable logic
- **Lesson 14**: Error handling and loading states

### Optional Challenges
1. **Date picker**: Add a date picker component
2. **Receipt photo**: Allow attaching a photo to transactions
3. **Recurring transactions**: Add option for recurring expenses
4. **Categories**: Add sub-categories within envelopes
5. **Currency formatting**: Auto-format as user types (e.g., "100" → "$1.00")

**Example Challenge Solution (Auto-format Currency):**
```typescript
const formatCurrency = (text: string) => {
  const cleaned = text.replace(/[^0-9]/g, '');
  const number = parseInt(cleaned) || 0;
  const formatted = (number / 100).toFixed(2);
  return formatted;
};

const handleAmountChange = (text: string) => {
  const formatted = formatCurrency(text);
  setForm(prev => ({ ...prev, amount: formatted }));
};
```

### Phase 1 Review - What You've Learned
- ✅ JSX and Components
- ✅ Props and Composition
- ✅ State with useState
- ✅ Lists and Keys
- ✅ Styling in React Native
- ✅ Navigation
- ✅ Forms and Input Handling

**You now have:**
- A multi-screen budget app
- Beautiful UI with professional styling
- Navigation between screens
- Forms with validation
- The foundation for a real product!

### Key Takeaways from Lesson 07
- ✅ TextInput is the primary input component
- ✅ Forms require manual state management
- ✅ Always validate user input
- ✅ Show clear error messages
- ✅ Use appropriate keyboard types
- ✅ KeyboardAvoidingView prevents keyboard overlap
- ✅ Controlled inputs are the React way

**Outstanding work completing Phase 1!** You've built a solid foundation. Take a day to review and practice, then continue to Phase 2 where you'll add real data persistence and state management!

---

**Time to complete**: ~1-2 hours
**Difficulty**: ⭐⭐⭐☆☆ Intermediate
**Previous lesson**: [06-navigation-basics.md](./06-navigation-basics.md)
**Next lesson**: [08-understanding-state-management.md](./08-understanding-state-management.md) (Phase 2)

🎉 **Phase 1 Complete!** 🎉


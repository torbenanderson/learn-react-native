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
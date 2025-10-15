import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';

function AllocateFunds() {
  // State for form inputs
  const [envelopeName, setEnvelopeName] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  
  // State for unallocated funds
  const [unallocatedFunds, setUnallocatedFunds] = useState(1000);
  
  // State for created envelopes
  const [envelopes, setEnvelopes] = useState<{name: string, amount: number}[]>([]);
  
  const handleAllocate = () => {
    const amount = parseFloat(allocatedAmount);
    
    // Validation
    if (!envelopeName.trim()) {
      alert("Please enter an envelope name");
      return;
    }
    
    if (Number.isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    if (amount > unallocatedFunds) {
      alert("Not enough unallocated funds!");
      return;
    }
    
    // Update unallocated funds
    setUnallocatedFunds(unallocatedFunds - amount);
    
    // Add new envelope
    setEnvelopes([...envelopes, { name: envelopeName, amount }]);
    
    // Reset form
    setEnvelopeName("");
    setAllocatedAmount("");
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allocate Funds</Text>
      
      {/* Unallocated Funds Display */}
      <View style={styles.fundsCard}>
        <Text style={styles.fundsLabel}>Unallocated Funds</Text>
        <Text style={styles.fundsAmount}>${unallocatedFunds.toFixed(2)}</Text>
      </View>
      
      {/* Allocation Form */}
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
      
      {/* Allocated Envelopes List */}
      {envelopes.length > 0 && (
        <View style={styles.envelopesList}>
          <Text style={styles.listTitle}>Allocated Envelopes</Text>
          {envelopes.map((envelope) => (
            <View key={envelope.name} style={styles.envelopeItem}>
              <Text style={styles.envelopeName}>{envelope.name}</Text>
              <Text style={styles.envelopeAmount}>
                ${envelope.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  fundsCard: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  fundsLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  fundsAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  envelopesList: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1f2937',
  },
  envelopeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  envelopeName: {
    fontSize: 16,
    color: '#374151',
  },
  envelopeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
});
export { AllocateFunds };
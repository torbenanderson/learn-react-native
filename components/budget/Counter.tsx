import { View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <View style={styles.container}>
      <Text style={styles.count}>Count: {count}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(count + 1)}
      >
        <Text>Increment</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(count - 1)}
      >
        <Text>Decrement</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(0)}
      >
        <Text>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}


function NameInput() {
  const [name, setName] = useState("");
  
  return (
    <View>
      {/* TextInput common props:
          - value: Current input value (for controlled inputs)
          - onChangeText: Called when text changes
          - placeholder: Hint text when empty
          - keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad'
          - autoCapitalize: 'none' | 'sentences' | 'words' | 'characters'
          - autoCorrect: true | false (enable/disable autocorrect)
          - secureTextEntry: true (for passwords - hides text)
          - multiline: true (allows multiple lines)
          - maxLength: number (character limit)
          - editable: false (makes read-only)
          - style: StyleSheet styles
          - onFocus: Called when input is focused
          - onBlur: Called when input loses focus
          
          Docs: https://reactnative.dev/docs/textinput
      */}
      <TextInput
        value={name}                    // Controlled input - shows current state value
        onChangeText={setName}          // Updates state when user types
        placeholder="Enter your name"   // Gray hint text when input is empty
      />
      <Text>Hello, {name}!</Text>
    </View>
  );
}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
      backgroundColor: '#f3f4f6',
    },
    count: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#1f2937',
    },
    button: {
      padding: 10,
      backgroundColor: '#3b82f6',
      borderRadius: 5,
      marginBottom: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export { Counter, NameInput };
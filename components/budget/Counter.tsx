import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

export default Counter;
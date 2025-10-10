import { Text, View } from 'react-native';

function EnvelopeCard() {
  // Step 2: Define envelope data
  const envelopeName = "Groceries";
  const allocated = 500;
  const spent = 325;
  const remaining = allocated - spent;
  
  // Step 3: Return the UI
  return (
    <View>
      <Text>{envelopeName}</Text>
      <Text>Allocated: ${allocated}</Text>
      <Text>Spent: ${spent}</Text>
      <Text>Remaining: ${remaining}</Text>
    </View>
  );
}

export default EnvelopeCard;
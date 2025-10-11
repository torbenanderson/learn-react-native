import { StyleSheet, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EnvelopeCard from '@/components/budget/EnvelopeCard';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Best Budget Envelopes</Text>
      <EnvelopeCard />
    </SafeAreaView>
  );
}

// StyleSheet documentation: https://reactnative.dev/docs/stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 2, // flex is the amount of space the container takes up on the screen
    padding: 60, // padding is the space around the content in the container on all 4 sides
    backgroundColor: 'lightblue',
    borderWidth: 1,    // Add this
    borderColor: 'red'    // Add this
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
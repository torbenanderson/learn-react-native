import { StyleSheet, Text, View } from 'react-native';

function EnvelopeCard() {
  // Step 2: Define envelope data
  const envelopeName = "Groceries";
  const allocated = 500;
  const spent = 325;
  const remaining = allocated - spent;
  
  // Step 3: Return the UI
  return (
    <View style={styles.envelope}>
      <Text style={styles.title}>{envelopeName}</Text>
      <Text style={styles.text}>Allocated: ${allocated}</Text>
      <Text style={styles.text}>Spent: ${spent}</Text>
      <Text style={styles.text}>Remaining: ${remaining}</Text>
    </View>
  );
}
// StyleSheet documentation: https://reactnative.dev/docs/stylesheet
const styles = StyleSheet.create({
  envelope: {
    flex: 5, // flex is the amount of space the container takes up on the screen
    padding: 10, // padding is the space around the content in the container on all 4 sides
    backgroundColor: 'lightblue',
    borderWidth: 5,    // Add this
    borderColor: 'red'    // Add this
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: 'black', 
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'lightgray',
    opacity: 0.5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    textOverflow: 'ellipsis'
  },
});

export default EnvelopeCard;
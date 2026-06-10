import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981', marginBottom: 8 }}>🌱 Sprout Mobile App</Text>
      <Text style={{ fontSize: 14, color: '#4b5563' }}>Hello Sprout Farmer! (Expo SDK 54 Hello World)</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

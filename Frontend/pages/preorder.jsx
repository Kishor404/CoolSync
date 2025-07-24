import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function PreOrder() {
  const [source, setSource] = useState(null); // { latitude, longitude }
  const [destination, setDestination] = useState(null);
  const [selectingSource, setSelectingSource] = useState(true); // Toggle between source and destination

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    if (selectingSource) {
      setSource({ latitude, longitude });
      Alert.alert('Source Selected', `Latitude: ${latitude}, Longitude: ${longitude}`);
    } else {
      setDestination({ latitude, longitude });
      Alert.alert('Destination Selected', `Latitude: ${latitude}, Longitude: ${longitude}`);
    }
  };

  const handleSubmit = () => {
    if (!source || !destination) {
      Alert.alert('Error', 'Please select both source and destination.');
      return;
    }

    const locationData = { source, destination };
    console.log('Location Data:', locationData); // For debugging

    Alert.alert('Success', 'Locations saved successfully!');
    // Navigate to the next screen or perform an action
    // navigation.navigate('TrackMe', { locationData });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pre-Order: Select Locations</Text>

      <Text style={styles.instructions}>
        {selectingSource
          ? 'Tap on the map to select the **Source** location.'
          : 'Tap on the map to select the **Destination** location.'}
      </Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749, // Default center (San Francisco)
          longitude: -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {source && (
          <Marker
            coordinate={source}
            title="Source"
            pinColor="blue" // Source marker color
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="red" // Destination marker color
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setSelectingSource(!selectingSource)}
        >
          <Text style={styles.toggleButtonText}>
            {selectingSource ? 'Set Destination' : 'Set Source'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  map: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  toggleButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

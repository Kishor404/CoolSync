import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { LoginStatus, setLoginStatus } from '../globals';
import apiData from './data.json';


const Driver = ({ navigation }) => {
  const [experience, setExperience] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    if (!experience || !licenseNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (isNaN(experience) || experience <= 0) {
      Alert.alert('Error', 'Experience must be a positive number.');
      return;
    }

    const driverData = {
      experience: parseInt(experience, 10),
      license_number: licenseNumber,
      user_id: LoginStatus.Data.id,
      status: "available",
    };

    const userData = {
      role: 'driver',
    };

    try {
      setIsLoading(true);

      const driverResponse = await axios.post(apiData.api+'/api/drivers/', driverData);
      const userResponse = await axios.patch(
        apiData.api+`/api/users/${LoginStatus.Data.id}/`,
        userData
      );

      Alert.alert('Success', 'Now You Become Driver... Please Login...');
      setLoginStatus({"Login":0,"Data":{}})
      
      console.log('Driver Response:', driverResponse.data);
      console.log('User Response:', userResponse.data);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to submit driver information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Driver Registration</Text>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Driver Experience (in years):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter experience"
          value={experience}
          onChangeText={setExperience}
        />

        <Text style={styles.label}>Driver License Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter license number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, isLoading && styles.disabledButton]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    paddingTop:60,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 20,
    color: '#08B69D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
    paddingTop:20
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#08B69D',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});

export default Driver;

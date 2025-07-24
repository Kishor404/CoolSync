import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { LoginStatus, setLoginStatus } from '../globals';
import axios from 'axios';
import apiData from './data.json';

export default function Profile() {

 
  const profileData = LoginStatus.Data;

  const [driId, setDriId] = useState(null);  // Set initial state to null for proper loading behavior

  const handleLogout = () => {
    setLoginStatus({ Login: 0, Data: {} });
    Alert.alert('Logged Out', 'You have been logged out.');
  };

  console.log(LoginStatus)
  // Fetch driver data based on ID
  const fetchDriverById = async (id) => {
    if (!id) {
      console.error('Invalid driver ID');
      return;
    }
    try {
      const driverResponse = await axios.get(`${apiData.api}/api/drivers/`);
      const driver = driverResponse.data.find(driver => driver.user_id === String(id));
      return driver;
    } catch (error) {
      console.error('Error fetching driver data:', error);
      return null; // Return null in case of error
    }
  };

  useEffect(() => {
    // Only run if the user is a driver
    const getDriverId = async () => {
      if (LoginStatus.Data.role === 'driver' && LoginStatus.Data.id) {
        const driver = await fetchDriverById(LoginStatus.Data.id);
        if (driver) {
          setDriId(driver.id);  
        } else {
          console.error('Driver not found');
        }
      }
    };
    getDriverId();
  }, [LoginStatus.Data.id, LoginStatus.Data.role]);  // Depend on ID and role to re-run effect

  return (
    <ImageBackground
      source={require('../assets/profile_bg.jpg')} // Path to your background image
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      {/* Profile Details */}
      {/* <Text style={styles.title}>Profile</Text> */}

      <View style={styles.profileDetails}>
        {driId ?(<Text style={styles.profileText}><Text style={styles.label}>Driver ID:</Text> {driId ?? 'Loading...'}</Text>):(<></>)}
        <Text style={styles.profileText}><Text style={styles.label}>User ID:</Text> {profileData.id}</Text>
        <Text style={styles.profileText}><Text style={styles.label}>Name:</Text> {profileData.name}</Text>
        <Text style={styles.profileText}><Text style={styles.label}>Phone:</Text> {profileData.phone}</Text>
        <Text style={styles.profileText}><Text style={styles.label}>Email:</Text> user@gmail.com</Text>
        <Text style={styles.profileText}><Text style={styles.label}>Account Status:</Text> {profileData.role}</Text>
        <Text style={styles.profileText}><Text style={styles.label}>Address:</Text> Tamilnadu, India</Text>
        <Text style={styles.profileText}><Text style={styles.label}>Verification:</Text> Verified User</Text>

      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop:280,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Comic Neue'
  },
  profileDetails: {
    width: '80%',
    marginBottom: 40,
    padding: 40,
    fontFamily: 'Comic Neue',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 10,
    color:'#08B69D',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Comic Neue'

  },
  logoutButton: {
    width: 140,
    height: 50,
    backgroundColor: '#08B69D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Comic Neue'

  },
});

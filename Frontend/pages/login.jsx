import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Animated,
  Easing,
  ImageBackground,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LoginStatus, setLoginStatus } from '../globals';
import apiData from './data.json';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const validateInputs = () => {
    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      Alert.alert('Invalid Phone Number', 'Phone number must be 10 digits.');
      return false;
    }
    if (!password || password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return false;
    }
    if (!isLogin && (!name || name.trim().length === 0)) {
      Alert.alert('Invalid Name', 'Name cannot be empty.');
      return false;
    }
    return true;
  };

  const upLoc = async (id) => {
    if (!id) return;
    try {
      await axios.patch(`${apiData.api}/api/users/${id}/`, {
        location: {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        },
      });
    } catch (error) {
      console.error('Location Update Error:', error);
      Alert.alert('Error', 'Network error occurred');
    }
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const response = await fetch(`${apiData.api}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          password,
        }),
      });

      

      const data = await response.json();
      if (response.ok) {
        setLoginStatus({ Login: data.login, Data: data.data });
        upLoc(data.data.id); // Use the correct data structure to get the user ID
        Alert.alert('Login Successful', `Welcome back, ${data.data.name}!`);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Network error occurred');
    }
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      const response = await fetch(`${apiData.api}/api/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully! Please log in.');
        setIsLogin(true);
      } else {
        Alert.alert('Error', data[Object.keys(data)[0]] || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', 'Network error occurred');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/back.png')}
      style={styles.container}
    >
      {/* Logo Section */}
      <View style={styles.logoWrapper}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      {/* Login Card */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.titleTextBox}>
          <Text style={styles.titleText}>{isLogin ? 'LogIn' : 'Create A Account'}</Text>
        </View>
        {!isLogin && (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#08B69D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Your Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#aaa"
              />
            </View>
            {/* Divider */}
            <View style={styles.divider} />
          </>
        )}
        <View style={styles.inputContainer}>
          <Ionicons name="call" size={20} color="#08B69D" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter 10 Digit Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#08B69D" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleSignup}>
          <Text style={styles.buttonText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Log In'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    position: 'absolute',
    top: 5,
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 10,
    marginTop: 5,
  },
  card: {
    marginTop: 350,
    width: '85%',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginVertical: -10,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 0,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#08B69D',
  },
  button: {
    width: '70%',
    height: 40,
    backgroundColor: '#08B69D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: '#08B69D',
    fontSize: 16,
    fontWeight: '500',
  },
  titleTextBox: {
    height: 60,
    marginTop: 13,
  },
  titleText: {
    fontSize: 25,
  },
});

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View,StyleSheet } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import apiData from './pages/data.json';

import Home from './pages/Home';
import Profile from './pages/profile.jsx';
import Product from './pages/product.jsx';
import Bid from './pages/Bid.jsx';
import Login from './pages/login.jsx';

import { LoginStatus } from './globals';
import TrackMe from './pages/trackme.jsx';
import MapScreen from './pages/Map.jsx';
import MyOrder from './pages/myorder.jsx';
import PreOrder from './pages/preorder.jsx';
import { SellerData, setSellerData } from './sellerdata.js';
import Driver from './pages/Driver.jsx';
import CurrentJob from './pages/currentjob.jsx';
import Shipment from './pages/shipment.jsx';
import HubShipment from './pages/hubshipment.jsx';
import Demand from './pages/demand.jsx';

import axios from 'axios';

const Tab = createBottomTabNavigator();
const ProductStack = createStackNavigator();
const HomeStack = createStackNavigator();

function ProductStackNavigator() {
  return (
    <ProductStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductStack.Screen name="Product" component={Product} />
      <ProductStack.Screen name="Bid" component={Bid} />
    </ProductStack.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      cardStyleInterpolator: ({ current, next, layouts }) => {
        return {
          cardStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        };
      },
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 300 } },
        close: { animation: 'timing', config: { duration: 300 } },
      },
    }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="TrackMe" component={TrackMe} />
      <HomeStack.Screen name="Map" component={MapScreen} />
      <HomeStack.Screen name="MyOrder" component={MyOrder} />
      <HomeStack.Screen name="PreOrder" component={PreOrder} />
      <HomeStack.Screen name="Driver" component={Driver} />
      <HomeStack.Screen name="CurrentJob" component={CurrentJob} />
      <HomeStack.Screen name="Shipment" component={Shipment} />
      <HomeStack.Screen name="HubShipment" component={HubShipment} />
    </HomeStack.Navigator>
  );
}

export default function App() {
  const [driverId, setDriverId] = useState('0');
  const [shipment, setShipment] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(LoginStatus.Login);
  const [watcher, setWatcher] = useState(null);

  const fetchDrivers = async () => {
    try {
      const driverResponse = await axios.get(`${apiData.api}/api/drivers/`);
      const drivers = driverResponse.data;
      const driver = drivers.find(driver => driver.user_id === String(LoginStatus.Data.id));
      if (driver) {
        setDriverId(driver.id);
      }
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  };

  const fetchShipmentInfo = async () => {
    if (driverId === '0') return;
    try {
      const shipmentResponse = await axios.get(`${apiData.api}/api/shipment/`);
      const shipments = shipmentResponse.data;
      const driverShipment = shipments.find(shipment => shipment.driver_id === String(driverId));
      // console.log(shipments)
      if (driverShipment) {
        setShipment(driverShipment);
      }
    } catch (error) {
      console.error('Error fetching shipment data:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      
      fetchShipmentInfo();
      fetchDrivers();
      setIsLoggedIn(LoginStatus.Login);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startWatchingLocation = async () => {
      console.log('Started Tracking...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return;
      }

      const watcherId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5 seconds
          distanceInterval: 10, // 10 meters
        },
        async (loc) => {
          const { latitude, longitude } = loc.coords;
          console.log('Updated location:', { latitude, longitude });

          try {
            const response = await fetch(`${apiData.api}/api/routes/${shipment.route_id}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                current_location: {
                  lat: latitude.toString(),
                  lon: longitude.toString(),
                },
              }),
            });
          } catch (error) {
            console.error('Failed to post location:', error);
          }
        }
      );

      setWatcher(watcherId);
    };

    const stopWatchingLocation = () => {
      if (watcher) {
        watcher.remove();
        setWatcher(null);
        console.log('Location tracking stopped');
      }
    };

    // Fetch driver and shipment info only if logged in
    if (LoginStatus.Data.role === 'driver') {
      fetchDrivers().then(() => fetchShipmentInfo());
      if (shipment.status === 'OP') {
        startWatchingLocation();
      } else {
        stopWatchingLocation();
      }
    } else {
      stopWatchingLocation();
    }

    return () => stopWatchingLocation();
  }, [LoginStatus, driverId, shipment]);

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#eeeeee',
          tabBarLabelStyle: {
            fontSize: 12, 
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Product') {
              iconName = focused ? 'storefront' : 'storefront-outline';
            } else if (route.name === 'Demand') {
              iconName = focused ? 'wine' : 'wine-outline';
            }else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return (
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={size} color={color} />{focused && <View style={styles.activeIndicator} />}
              </View>)
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Product" component={ProductStackNavigator} />
        <Tab.Screen name="Demand" component={Demand} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#08B69D', // White background color for the navigation bar
    height: 60, // Fixed height
    borderTopWidth: 0, // No border on top
    position: 'absolute', // Positioned at the bottom of the screen
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5, // Subtle shadow effect for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: -5, // Line appears above the icon, slightly away from it
    width: 40, // Make the line span the width of the icon
    height: 3, // Line height
    backgroundColor: '#ffffff', // Color of the line
    borderRadius: 2, // Optional: rounded corners for the line
},
});
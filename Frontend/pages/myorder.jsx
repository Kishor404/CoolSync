import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import apiData from './data.json';


const MyOrder = () => {
  const [orderData, setOrderData] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulating LoginStatus
  const LoginStatus = {
    Data: {
      id: "1", // Replace this with actual user login ID
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch products from the API
        const productResponse = await axios.get(apiData.api+'/api/products/');
        const products = productResponse.data;

        // Step 2: Find the product matching the logged-in user's ID
        const userOrder = products.find((product) => product.seller_id === LoginStatus.Data.id);
        setOrderData(userOrder);

        // Step 3: If a matching product is found, fetch its device data
        if (userOrder) {
          const deviceResponse = await axios.get(
            apiData.api+`/api/devices/${userOrder.device_id}/`
          );
          setDeviceData(deviceResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenForBid = () => {
    Alert.alert("Success", "Order opened for bidding!");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!orderData) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No order found for the current user.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Order Details */}
      <View style={styles.card}>
        <Text style={styles.header}>Order Details</Text>
        <Text style={styles.text}><Text style={styles.bold}>Name:</Text> {orderData.name}</Text>
        <Text style={styles.text}><Text style={styles.bold}>Details:</Text> {orderData.details}</Text>
        <Text style={styles.text}><Text style={styles.bold}>Quality:</Text> {orderData.quality}</Text>
        <Text style={styles.text}><Text style={styles.bold}>Quantity:</Text> {orderData.quantity}</Text>

        
      </View>

      {/* Device Details */}
      {deviceData && (
        <View style={styles.card}>
          <Text style={styles.header}>Device Details</Text>
          <Text style={styles.text}><Text style={styles.bold}>Name:</Text> {deviceData.name}</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Reading Temperature:</Text> {deviceData.reading_temperature}°C
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Reading Humidity:</Text> {deviceData.reading_humidity}%
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Maintain Temperature:</Text> {deviceData.maintain_temperature}°C
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Maintain Humidity:</Text> {deviceData.maintain_humidity}%
          </Text>
          <Text style={styles.text}><Text style={styles.bold}>Status:</Text> {deviceData.status}</Text>
        </View>
      )}
      {/* Open It for Bid Button */}
      <TouchableOpacity style={styles.bidButton} onPress={handleOpenForBid}>
          <Text style={styles.bidButtonText}>Open It for Bid</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
  },
  bidButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bidButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyOrder;

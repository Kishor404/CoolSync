import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { LoginStatus } from '../globals'; 
import apiData from './data.json';

const CurrentJob = () => {
  const [driverId, setDriverId] = useState(null);
  const [shipmentData, setShipmentData] = useState(null); // Initializing as null to handle empty state
  const [productData, setProductData] = useState(null);   // Initializing as null to handle empty state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For handling errors globally

  // Fetch product details based on product ID
  const fetchProducts = async (id) => {
    if (!id) {
      setError('Invalid product ID');
      return;
    }
    try {
      const productResponse = await axios.get(`${apiData.api}/api/products/${id}`);
      setProductData(productResponse.data);
    } catch (error) {
      setError('Error fetching product data');
      console.error('Error fetching Product data:', error);
    }
  };

  // Fetch drivers and shipment details
  const fetchDriversAndShipments = async () => {
    setLoading(true);
    try {
      const driverResponse = await axios.get(`${apiData.api}/api/drivers/`);
      const matchedDriver = driverResponse.data.find(
        (driver) => driver.user_id === String(LoginStatus.Data.id)
      );

      if (!matchedDriver) {
        setError('Driver not found');
        return;
      }

      setDriverId(matchedDriver.id);

      // Fetch the shipment details assigned to the driver
      const shipmentResponse = await axios.get(`${apiData.api}/api/shipment/`);
      const assignedShipments = shipmentResponse.data.filter(
        (shipment) => shipment.driver_id === String(matchedDriver.id)
      );

      if (assignedShipments.length === 0) {
        setError('No shipments assigned to this driver');
        return;
      }

      setShipmentData(assignedShipments[0]);
      fetchProducts(assignedShipments[0].product_id);
    } catch (error) {
      setError('Error fetching driver or shipment data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle approval of shipment
  const handleApproval = async (id) => {
    
    const shipmentData = { status:'DA' };
    try {
      const shipmentResponse = await axios.patch(`${apiData.api}/api/shipment/${id}/`, shipmentData);
      setShipmentData(shipmentResponse.data); // Update shipment data after approval
    } catch (error) {
      setError('Error patching Shipment data');
      console.error('Error patching Shipment data:', error);
    }
  };

  // Run the fetch logic on initial mount
  useEffect(() => {
    fetchDriversAndShipments();
  }, [LoginStatus.Data.id]); // Run when LoginStatus changes

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    // Display the error message in case of any issue
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!shipmentData) {
    return (
      <View style={styles.centered}>
        <Text>No Job Assigned</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Current Job</Text>
      <View style={styles.card}>
        {productData ? (
          <>
            <Text>Name: {productData.name}</Text>
            <Text>Details: {productData.details}</Text>
            <Text>Quality: {productData.quality}</Text>
            <Text>Quantity: {productData.quantity}</Text>
          </>
        ) : (
          <Text>Loading product details...</Text>
        )}
        {shipmentData.status !== "SC" ? (
          <Text style={styles.approved}>Approved</Text>
        ) : (
          <Button
            title="Approve"
            
            onPress={() => handleApproval(shipmentData.id)}
            color="#08B69D"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop:50,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderColor:"#08B69D",
    borderLeftWidth:10,
  },
  approved: {
    color: '#08B69D',
    fontWeight: 'bold',
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CurrentJob;

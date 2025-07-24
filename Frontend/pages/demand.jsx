// Demand.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const Demand = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.91.222:8000/api/demand/?state=${encodeURIComponent(selectedState)}&month=${currentMonth}`);
        const result = await response.json();

        console.log("API Response:", result); // Debug log
        if (result && result.predicted_demand !== undefined && result.predicted_profit !== undefined) {
          setData(result);
        } else {
          setData(null); // Handle unexpected response
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null); // Set data to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedState, currentMonth]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Demand and Profit Data</Text>

      <Picker
        selectedValue={selectedState}
        onValueChange={(itemValue) => setSelectedState(itemValue)}
        style={styles.picker}
      >
        {states.map((state, index) => (
          <Picker.Item key={index} label={state} value={state} />
        ))}
      </Picker>

      <Text style={styles.monthText}>Month: {currentMonth}</Text>

      <FlatList
        data={[data]} // Wrap in array for FlatList
        keyExtractor={(item, index) => index.toString()} // Use index as key if unique keys are not available
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableText}>Predicted Demand: {item.predicted_demand || 'N/A'}</Text>
            <Text style={styles.tableText}>Predicted Profit: {item.predicted_profit || 'N/A'}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:70
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableRow: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
    paddingTop: 10,
  },
  tableText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Demand;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  
import { LoginStatus } from '../globals';
import apiData from './data.json';


export default function Bid({ route, navigation }) {
  const { product } = route.params; 
  const [bidAmount, setBidAmount] = useState('');
  const [sellerDet, setSellerDet] = useState('');
  const [bidderDet, setBidderDet] = useState('');
  
  const fetchSeller = async () => {
    
    try {
      const response = await fetch(apiData.api+'/api/getoneuser/'+product.seller_id+'/');
      const data = await response.json();
      setSellerDet(data);
    } catch (error) {
      console.log(seller_id)
      console.error('Error fetching Bids22:', error);
    }
  };
  const fetchBidder = async () => {
    try {
      const response = await fetch(apiData.api+'/api/getoneuser/'+product.bidder_id+'/');
      const data = await response.json();
      setBidderDet(data);
    } catch (error) {
      console.error('Error fetching Bids33:', error);
    }
  };
  fetchSeller();
  fetchBidder();

  const handleBidSubmit = async () => {
    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= product.current_bid) {
      Alert.alert('Invalid Bid', 'Please enter a valid bid amount higher than the current bid.');
      return;
    }

    try {
      const response = await fetch(apiData.api+'/api/bids/'+product.bid_id+'/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_bid:bidAmount,
          bidder_id:LoginStatus.Data.id
        }),
      });
      setBidAmount('');

      if (response.ok) {
        Alert.alert('Success', 'Your bid has been placed!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to place the bid. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      Alert.alert('Error', 'Failed to place the bid. Please check your connection.');
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.refreshButton} onPress={() => navigation.goBack()}>
              <View style={styles.backbutt}>
                <Icon name="arrow-back-outline" size={25} color="#000" />
              </View>
            </TouchableOpacity>
            <Text style={styles.titletext}>Bidding Place</Text>
        </View>
      <Text style={styles.title}>{product.name.toUpperCase()}</Text>
      <Text style={styles.bidprice}>Current Bid: {product.current_bid} INR</Text>
      <Text style={styles.detail}>Details: {product.details}</Text>
      <Text style={styles.detail}>Quality: {product.quality} / 10</Text>
      <Text style={styles.detail}>Quantity: {product.quantity} KG</Text>
      <Text style={styles.detail}>Seller: {sellerDet.name}</Text>
      <Text style={styles.detail}>Current Bidder: {bidderDet.name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your bid amount"
        keyboardType="numeric"
        value={bidAmount}
        onChangeText={setBidAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleBidSubmit}>
        <Text style={styles.buttonText}>Submit Bid</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header:{
    width:'100%',
    backgroundColor:'#fff',
    marginTop:20,
    flexDirection:'row',
    height:70,
    justifyContent:'start',
    alignItems:'center'
  },
  backbutt:{
    width:50,
    color:'black',
  },
  titletext:{
    color:'black',
    fontSize:20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  bidprice: {
    fontSize: 20,
    marginBottom: 10,
    color: '#08B69D',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#08B69D',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

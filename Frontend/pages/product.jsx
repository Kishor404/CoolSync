import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Use this for icons
import { useNavigation } from '@react-navigation/native';
import apiData from './data.json';

export default function Product() {

  const navigation = useNavigation();

  const [products, setProducts] = useState([]);
  const [Bids, setBids] = useState([]);
  const [BidList, setBidList] = useState([]);
  const [shipments, setShipments] = useState([]); // Shipment data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Reset loading state before fetching data
    fetchShipments();
    fetchProducts();
    fetchBids();

    const intervalId = setInterval(() => {
      fetchShipments();
      fetchProducts();
      fetchBids();
    }, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    // Combine data after fetching
    if (shipments.length > 0 && products.length > 0 && Bids.length > 0) {
      BidListFunc();
    }
  }, [shipments, products, Bids]);

  const fetchShipments = async () => {
    try {
      const response = await fetch(apiData.api + '/api/shipment/');
      const data = await response.json();
      setShipments(data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(apiData.api + '/api/products/');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await fetch(apiData.api + '/api/bids/');
      const data = await response.json();
      setBids(data);
    } catch (error) {
      console.error('Error fetching Bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const BidListFunc = () => {
    let pro_lis = [];

    // Filter shipments with status 'OB' (On Bidding)
    const biddingShipments = shipments.filter((shipment) => shipment.status === 'OB');

    for (let shipment of biddingShipments) {
      const product = products.find((prod) => prod.id === parseInt(shipment.product_id));
      const bid = Bids.find((b) => b.seller_id === shipment.seller_id); // Match based on shipment's seller_id

      if (product && bid) {
        pro_lis.push({
          ...product,
          current_bid: bid.current_bid,
          bid_id: bid.id,
          bidder_id: bid.bidder_id,
          shipment_status: shipment.status, // Add shipment status
        });
      }
    }

    setBidList(pro_lis);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Text style={styles.productName}>{item.name.toUpperCase()}</Text>
      <Text style={styles.productDetails}>{item.details}</Text>
      <Text style={styles.productQuality}>Quality: {item.quality + ' / 10'}</Text>
      <Text style={styles.productQuantity}>Quantity: {item.quantity + ' KG'}</Text>
      <Text style={styles.shipmentStatus}>Shipment Status: {item.shipment_status}</Text>
      <Text style={styles.productBid}>Current Bid: {item.current_bid} INR</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bid', { product: item })}>
        <Text style={styles.buttonText}>Bid Now</Text>
      </TouchableOpacity>
    </View>
  );

  const handleRefresh = () => {
    setLoading(true); // Set loading state when refreshing
    fetchShipments();
    fetchProducts();
    fetchBids();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <View style={styles.refreshIconContainer}>
          <Icon name="refresh-outline" size={18} color="#fff" />
        </View>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        BidList.length !== 0 ? (
          <FlatList 
            data={BidList} 
            renderItem={renderItem} 
            keyExtractor={(item) => item.id.toString()} 
          />
        ) : (
          <Text style={styles.nocont}>No bids available currently now...</Text>
        )
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 70,
  },
  productContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 16,
    marginTop: 5,
    color: '#555',
  },
  productQuality: {
    fontSize: 14,
    marginTop: 5,
    color: '#777',
  },
  productQuantity: {
    fontSize: 14,
    marginTop: 5,
    color: '#777',
  },
  productBid: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: 'bold',
    color: '#08B69D',
  },
  shipmentStatus: {
    fontSize: 14,
    marginTop: 5,
    color: '#888',
  },
  button: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#08B69D',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  refreshButton: {
    position: 'absolute',
    top: 85,
    right: 20,
    backgroundColor: '#08B69D',
    padding: 10,
    paddingTop: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  refreshIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nocont: {
    textAlign:'center'
  }
});

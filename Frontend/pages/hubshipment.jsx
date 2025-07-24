import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Modal, Button } from "react-native";
import axios from "axios";
import apiData from "./data.json"; // Your JSON file
import { LoginStatus } from "../globals";

const Shipment = () => {
  const [shipments, setShipments] = useState([]);
  const [sellerShipments, setSellerShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({ product: null, driver: null, device: null });
  
  const [bidPrice, setBidPrice] = useState(''); // State for the bid price input
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const shipmentStatusMap = {
    SC: "Seller Created",
    DA: "Driver Approved",
    SS: "Seller Started",
    OP: "On Progress",
    DR: "Destination Reached",
    SV: "Seller Verified",
    PC: "Process Completed",
    OB: "On Bidding",
    BC: "Bidding Completed",
  };

  // Fetch shipment data
  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiData.api}/api/shipment/`);
        const shipments = response.data;
        const filteredShipments = shipments
        console.log(filteredShipments)
        setSellerShipments(filteredShipments);
      } catch (error) {
        console.error("Error fetching shipments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, [apiData.api, LoginStatus.Data.id]);

  // Fetch details of the selected shipment
  const fetchDetails = async (shipment) => {
    setLoading(true);
    try {
      const [productRes, driverRes, deviceRes] = await Promise.all([
        axios.get(`${apiData.api}/api/products/${shipment.product_id}/`),
        axios.get(`${apiData.api}/api/drivers/${shipment.driver_id}/`),
        axios.get(`${apiData.api}/api/devices/${shipment.device_id}/`),
      ]);
      setDetails({
        product: productRes.data,
        driver: driverRes.data,
        device: deviceRes.data,
      });
      setSelectedShipment(shipment);
    } catch (error) {
      console.error("Error fetching shipment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const OP = async (id) => {
    const shipmentData = { status: "OP" };
    try {
      const shipmentResponse = await axios.patch(apiData.api + "/api/shipment/" + id + "/", shipmentData);
      const postShipment = shipmentResponse.data;
      setSelectedShipment(postShipment);
    } catch (error) {
      console.error("Error patching Shipment data:", error);
    }
  };

  const OB = async (id) => {
    if (!bidPrice || isNaN(bidPrice) || bidPrice <= 0) {
      alert("Please enter a valid bid price.");
      return;
    }

    const shipmentData = { status: "OB" };
    const bidData = {
      product_id: selectedShipment.product_id,
      seller_id: selectedShipment.seller_id,
      shipment_id: selectedShipment.id,
      bidder_id: selectedShipment.seller_id,
      current_bid: bidPrice,
    };
    console.log(bidData)

    try {
      const shipmentResponse = await axios.patch(apiData.api + "/api/shipment/" + id + "/",shipmentData);
      const bidResponse = await axios.post(apiData.api + "/api/bids/", bidData);
      const postShipment = shipmentResponse.data;
      setSelectedShipment(postShipment);
      setModalVisible(false); // Close the modal after posting the bid
    } catch (error) {
      console.error("Error patching Shipment and Bid data:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tit}>Current Shipments</Text>
      {!selectedShipment ? (
        <FlatList
          data={sellerShipments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => fetchDetails(item)}
            >
              <Text style={styles.cardText}>Shipment ID: {item.id}</Text>
              <Text style={styles.cardText}>Buyer ID: {item.buyer_id}</Text>
              <Text style={styles.cardText}>Status: <Text style={styles.stat}>{shipmentStatusMap[item.status]}</Text></Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>Shipment Details</Text>
          <Text>Shipment ID: {selectedShipment.id}</Text>
          <Text>Status: {shipmentStatusMap[selectedShipment.status]}</Text>
          <Text style={styles.detailsHeader}>Product Details</Text>
          <Text>{details.product ? `Name: ${details.product.name}` : "Loading..."}</Text>
          <Text>{details.product ? `Details: ${details.product.details}` : "Loading..."}</Text>
          <Text>{details.product ? `Estimated Quality On Destination: ${details.product.quality} /10` : "Loading..."}</Text>
          <Text>{details.product ? `Quantity: ${details.product.quantity} KG` : "Loading..."}</Text>
          <Text>{details.device ? `Temperature: ${details.device.reading_temperature} C` : "Loading..."}</Text>
          <Text>{details.device ? `Humidity: ${details.device.reading_humidity} %` : "Loading..."}</Text>
          <Text style={styles.detailsHeader}>Driver Details</Text>
          <Text>{details.driver ? `Name: ${details.driver.name}` : "Loading..."}</Text>
          <Text>{details.driver ? `Phone: ${details.driver.phone}` : "Loading..."}</Text>
          <Text>{details.driver ? `Licence Number: ${details.driver.license_number}` : "Loading..."}</Text>
          <Text>{details.driver ? `Experience: ${details.driver.experience}` : "Loading..."}</Text>
          <Text>{details.driver ? `Driver Status: ${details.driver.status}` : "Loading..."}</Text>

          {selectedShipment.status === "OP" && LoginStatus.Data.role!="driver" ? (
            <TouchableOpacity
              style={styles.bidButton}
              onPress={() => setModalVisible(true)} // Open the modal to input the bid price
            >
              <Text style={styles.backButtonText}>Open For Bid</Text>
            </TouchableOpacity>
          ) : null}
          
          {selectedShipment.status === "DA" ? (
            <TouchableOpacity style={styles.bidButton} onPress={() => OP(selectedShipment.id)}>
              <Text style={styles.backButtonText}>Start The Shipment</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedShipment(null)}
          >
            <Text style={styles.backButtonText}>Back to Shipments</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for Bid Input */}
      <Modal
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Enter Minimum Bid Price</Text>
      <TextInput
        style={styles.bidInput}
        keyboardType="numeric"
        placeholder="Enter price"
        value={bidPrice}
        onChangeText={setBidPrice}
      />
      <Button title="Submit" onPress={() => OB(selectedShipment.id)} />
      {/* Replace the Button with TouchableOpacity for the Cancel button */}
      <TouchableOpacity
        style={styles.cancelButton}  // Apply custom styles for the button
        onPress={() => setModalVisible(false)}  // Close the modal when clicked
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>  {/* Custom text styling */}
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop:60,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    borderLeftWidth:10,
    borderLeftColor:"#08B69D"
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
  },
  detailsHeader: {
    fontSize: 18,
    paddingTop:20,
    fontWeight: "bold",
    marginVertical: 8,
    color:"#08B69D",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#08B69D",
    borderRadius: 8,
    alignItems: "center",
  },
  bidButton: {
    marginTop: 16,
    padding: 12,
    marginTop:40,
    backgroundColor: "#c42929",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalbutt:{
    color:'red'
  },
  cancelButton: {
    padding: 12,
    backgroundColor: "#FF6347",  // Set the background color (Tomato red)
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,  // Add some spacing
  },
  cancelButtonText: {
    color: "#fff",  // Set the text color to white
    fontSize: 16,   // Adjust font size as needed
  },
  bidInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  tit:{
    fontSize:20,
    color:"black",
    textAlign:"center",
    paddingBottom:20,
    fontWeight:'bold'
  },
  stat:{
    color:"#08B69D"
  }
});

export default Shipment;

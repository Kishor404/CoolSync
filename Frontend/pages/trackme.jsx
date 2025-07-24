import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import apiData from './data.json';
import axios from 'axios';
import { LoginStatus, setLoginStatus } from '../globals'; 


export default function TrackMe() {

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);


  // ========= PAGE 1 DATA ==========
  const [productName, setProductName] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [productQuantity, setProductQuantity] = useState(null);

  // ========= PAGE 2 DATA ==========
  const [deviceId, setDeviceId] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  const [driverId, setDriverId] = useState(null);

  // ========= PAGE 3 DATA ==========
  const [selectedMode, setSelectedMode] = useState('source');
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [halts, setHalts] = useState([]);


  // ========= DATA ==========

  const [driverData, setDriverData] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [buyerData, setBuyerData] = useState(null);
  const [shipmentData, setShipmentData] = useState(null);


  // ========== FETCH DRIVER ===============

  const fetchDrivers = async (id) => {
    if (!id) {
      console.error('Invalid driver ID');
      return;
    }
    try {
      const driverResponse = await axios.get(apiData.api + '/api/drivers/' + id);
      const FetchDriver = driverResponse.data;
      if(FetchDriver.status==='available'){
        setDriverData(FetchDriver)
      }else{
        alert("The Selected Driver Was Assigned... Choose Other Driver...")
        setStep(2)
      }
      
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  };

  // ========== FETCH DEVICE ===============

  const fetchDevices = async (id) => {
    if (!id) {
      console.error('Invalid device ID');
      return;
    }
    try {
      const deviceResponse = await axios.get(apiData.api + '/api/devices/' + id);
      const FetchDevice = deviceResponse.data;
      if(FetchDevice.status==='stop'){
        setDeviceData(FetchDevice)
      }else{
        alert("The Selected Device Was Assigned... Choose Other Device...")
        setStep(2)
      }
    } catch (error) {
      console.error('Error fetching device data:', error);
    }
  };

  // ========== POST PRODUCT ===============

  const postProducts = async (productName, productQuantity, productDetails) => {
    if (!productName || !productQuantity || !productDetails) {
      console.error('Invalid product data');
      return;
    }
    const productData={"name":productName, "quantity":productQuantity, "details":productDetails}
    try {
      const productResponse = await axios.post(apiData.api + '/api/products/', productData);
      const postProduct = productResponse.data;
      setProductData(postProduct)
    } catch (error) {
      console.error('Error posting product data:', error);
    }
  };

  // ========== POST ROUTE ===============

  const postRoute = async (sorce,destination,halts) => {
    if (!sorce || !destination || !halts) {
      console.error('Invalid route data');
      return;
    }
    let pHalt=[]
    for(let i=0;i<halts.length;i++){
      pHalt.push({"lat":halts[i].latitude.toString(),"lon":halts[i].longitude.toString()})
    }
    const routeData={
      "source":{"lat":source.latitude.toString(),"lon":source.longitude.toString()},
      "destination":{"lat":destination.latitude.toString(),"lon":destination.longitude.toString()},
      "halt":{"data":pHalt}, 
      "current_location" :{"lat":source.latitude.toString(),"lon":source.longitude.toString()}
    }
    try {
      const routeResponse = await axios.post(apiData.api + '/api/routes/', routeData);
      const postRoute = routeResponse.data;
      setRouteData(postRoute)
    } catch (error) {
      console.error('Error posting route data:', error);
    }
  };

  // ========== POST SHIPMENT ===============

  const postShipment = async (productData, userData, driverData, deviceData, buyerData, routeData) => {
    if (!productName || !productQuantity || !productDetails) {
      console.error('Invalid product data');
      return;
    }
    const shipmentData={
      "seller_id": userData.id,
      "buyer_id": buyerData.id,
      "product_id": productData.id,
      "device_id": deviceData.id,
      "driver_id": driverData.id,
      "route_id": routeData.id,
      "status": "SC"
  }
    try {
      const shipmentResponse = await axios.post(apiData.api + '/api/shipment/', shipmentData);
      const postShipment = shipmentResponse.data;
      setShipmentData(postShipment)
    } catch (error) {
      console.error('Error posting shipment data:', error);
    }
  };

  // ========== PATCH USER TO SELLER =============

  const patchUser = async () => {
    const userData={"role":"seller"}
    try {
      const userResponse = await axios.patch(apiData.api + '/api/users/'+LoginStatus.Data.id+"/", userData);
      const postUser = userResponse.data;
      setLoginStatus({
        ...LoginStatus,
        Data: {
          ...LoginStatus.Data,
          role: "seller"
        }
      })
      setUserData(postUser)
    } catch (error) {
      console.error('Error patching user data:', error);
    }
  };

  // ========== PATCH USER TO BUYER =============

  const patchBuyer = async (id) => {
    const buyerData={"role":"buyer"}
    try {
      const buyerResponse = await axios.patch(apiData.api + '/api/users/'+id+"/", buyerData);
      const postBuyer = buyerResponse.data;
      setBuyerData(postBuyer)
    } catch (error) {
      console.error('Error patching buyer data:', error);
    }
  };

  // ========== PATCH DRIVER =============

  const patchDriver = async (id) => {
    
    const driverData={"status":"assigned"}
    try {
      const driverResponse = await axios.patch(apiData.api + '/api/drivers/'+id+"/", driverData);
      const postDriver = driverResponse.data;
      setDriverData(postDriver)
    } catch (error) {
      console.error('Error patching driver data:', error);
    }
  };

  // ========== PATCH DEVICE =============

  const patchDevice = async (id) => {
    
    const deviceData={"status":"set"}
    try {
      const deviceResponse = await axios.patch(apiData.api + '/api/devices/'+id+"/", deviceData);
      const postDevice = deviceResponse.data;
      setDeviceData(postDevice)
    } catch (error) {
      console.log("error")
    }
  };
  

  // ========= MAP ==========

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    if (selectedMode === 'source') {
      setSource({ latitude, longitude });
    } else if (selectedMode === 'destination') {
      setDestination({ latitude, longitude });
    } else if (selectedMode === 'halt') {
      setHalts((prevHalts) => [...prevHalts, { latitude, longitude }]);
    }
  };

  // ========== STEPS =========

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((item) => (
        <TouchableOpacity key={item} style={[ styles.step, step === item && styles.activeStep,]} onPress={() => setStep(item)}>
          <Text style={styles.stepText}>{item}</Text>
        </TouchableOpacity>
      ))}
      {[4, 5].map((item) => (
        <View key={item} style={[ styles.step, step === item && styles.activeStep,]}>
          <Text style={styles.stepText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  // ========== VALIDATION ============

  const valid1=()=>{
    if(!productName || !productDetails || !productQuantity){
      alert("Product Details is Missing...")
      setStep(1)
    }else if(!driverId){
      alert("Driver ID is Missing...")
      setStep(2)
    }else if(!deviceId){
      alert("Device ID is Missing...")
      setStep(2)
    }else if(!buyerId){
      alert("Buyer ID is Missing...")
      setStep(2)
    }else if(!source || !destination || halts==[]){
      alert("Route Data is Missing...")
      setStep(3)
    }else{
      FetchOnly();
    }
  }

  // ========= FUNCTIONS ===========

  const FetchOnly=async()=>{
    setLoading(true);
    if(!driverId || !deviceId || !buyerId){
      
      setLoading(false);
      return ;
    }else{
    
    try {
      await fetchDrivers(driverId);
      await fetchDevices(deviceId);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to process the data. Please try again.");
    }}
    setLoading(false);
  }

  const End=async ()=>{
    setLoading(true);
    if(!productData || !deviceData || !driverData || !userData || !buyerData || !routeData){
      
      setLoading(false);
      return ;
    }else{
      try {
        await postShipment(productData, userData, driverData, deviceData, buyerData, routeData)
        alert("Now You Become Seller... Please Login...")
        setLoginStatus({"Login":0,"Data":{}})
        
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "Failed to process the data. Please try again.");
      }
    }
    setLoading(false);
  }

  const Final=async ()=>{
    setLoading(true);
    if(!productName || !productQuantity || !productDetails || !source || !destination || !halts || !driverId || !deviceId || !buyerId){
      
      setLoading(false);
      return ;
    }else{
      try {
        await postProducts(productName, productQuantity, productDetails);
        await postRoute(source,destination,halts);
        await patchUser();
        await patchBuyer(buyerId);
        await patchDriver(driverId);
        await patchDevice(deviceId);
        await End();

      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "Failed to process the data. Please try again.");
      }
    }
    setLoading(false);
  }

  // ========= LOADING ===========

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {renderStepIndicator()}

      {/* =========== PAGE 2 ========== */}

      {step === 1 && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={productName}
            onChangeText={setProductName}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Product Details"
            value={productDetails}
            onChangeText={setProductDetails}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Product Quantity (KG)"
            keyboardType="numeric"
            value={productQuantity}
            onChangeText={setProductQuantity}
            placeholderTextColor="#aaa"
          />
          <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={() => setStep(2)} style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* =========== PAGE 2 ========== */}

      {step === 2 && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Buyer ID"
            value={buyerId}
            onChangeText={setBuyerId}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Device ID"
            value={deviceId}
            onChangeText={setDeviceId}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Driver ID"
            value={driverId}
            onChangeText={setDriverId}
            placeholderTextColor="#aaa"
          />
          <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={() => setStep(1)} style={styles.button}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep(3)} style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* =========== PAGE 3 ========== */}

      {step === 3 && (
        <View style={{ flex: 1 }}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 9.482616, 
                longitude:  77.514253,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress}
            >
              {source && <Marker coordinate={source} title="Source" pinColor="green" />}
              {destination && <Marker coordinate={destination} title="Destination" pinColor="red" />}
              {halts.map((halt, index) => (
                <Marker
                  key={index}
                  coordinate={halt}
                  title={`Halt ${index + 1}`}
                  pinColor="blue"
                />
              ))}
            </MapView>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, selectedMode === 'source' && styles.activeButton]}
              onPress={() => setSelectedMode('source')}
            >
              <Text style={styles.buttonText}>Source</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedMode === 'destination' && styles.activeButton]}
              onPress={() => setSelectedMode('destination')}
            >
              <Text style={styles.buttonText}>Destination</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedMode === 'halt' && styles.activeButton]}
              onPress={() => setSelectedMode('halt')}
            >
              <Text style={styles.buttonText}>Add Halt</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.coordinates}>
            <Text style={styles.coordinatesText}>
              Source: {source ? `${source.latitude}, ${source.longitude}` : 'Not Selected'}
            </Text>
            <Text style={styles.coordinatesText}>
              Destination: {destination ? `${destination.latitude}, ${destination.longitude}` : 'Not Selected'}
            </Text>
            <Text style={styles.coordinatesText}>Halts:</Text>
            {halts.length > 0 ? (
              halts.map((halt, index) => (
                <Text key={index} style={styles.coordinatesText}>
                  Halt {index + 1}: {halt.latitude}, {halt.longitude}
                </Text>
              ))
            ) : (
              <Text style={styles.coordinatesText}>No Halts Selected</Text>
            )}
            
          </ScrollView>
          <View style={styles.navigationButtons}>
              <TouchableOpacity onPress={() => setStep(2)} style={styles.button}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {setStep(4); valid1();}} style={styles.button}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
      )}

      {/* =========== PAGE 4 ========== */}
      
      {step === 4 && (
        <View>
          <View>
            <View style={{padding:20, borderRadius:8,margin:10, backgroundColor:"#08B69D"}}>
              <Text style={{color:"#ffffff", fontSize:25,}}>| {productName} - {productQuantity} KG</Text>
              <Text style={{color:"#eeeeee", marginTop:5}}>{productDetails}</Text>
            </View>
            <View style={{borderWidth:2,borderLeftWidth:20,borderColor:'#08B69D',padding:20, borderRadius:8,margin:10, backgroundColor:"#ffffff"}}>
              <Text style={{color:"#08B69D",}}>License Number : {driverData.license_number}</Text>
              <Text style={{color:"#08B69D",}}>Experience : {driverData.experience}</Text>
              <Text style={{color:"#08B69D",}}>Status : {driverData.status}</Text>
            </View>
            <View style={{borderWidth:2,borderLeftWidth:20,borderColor:'#08B69D',padding:20, borderRadius:8,margin:10, backgroundColor:"#ffffff"}}>
              <Text style={{color:"#08B69D",}}>Name : {deviceData.name}</Text>
              <Text style={{color:"#08B69D",}}>ID : {deviceData.id}</Text>
              <Text style={{color:"#08B69D",}}>Status : {deviceData.status}</Text>
            </View>
          </View>
          <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={() => setStep(3)} style={styles.button}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setStep(5); Final()}} style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* =========== PAGE 5 ========== */}
      
      {step === 5 && (
        <View>
          <View>
            <View style={{padding:20, borderRadius:8,margin:10, backgroundColor:"#08B69D"}}>
              <Text style={{color:"#ffffff", fontSize:25,}}>| {productData.name} - {productData.quantity} KG</Text>
              <Text style={{color:"#eeeeee", marginTop:5}}>{productData.details}</Text>
            </View>
            <View style={{borderWidth:2,borderLeftWidth:20,borderColor:'#08B69D',padding:20, borderRadius:8,margin:10, backgroundColor:"#ffffff"}}>
              <Text style={{color:"#08B69D",}}>Name : {driverData.name}</Text>
              <Text style={{color:"#08B69D",}}>ID : {driverData.id}</Text>
              <Text style={{color:"#08B69D",}}>User ID : {driverData.user_id}</Text>
              <Text style={{color:"#08B69D",}}>Phone : {driverData.phone}</Text>
              <Text style={{color:"#08B69D",}}>License Number : {driverData.license_number}</Text>
              <Text style={{color:"#08B69D",}}>Experience : {driverData.experience}</Text>
              <Text style={{color:"#08B69D",}}>Status : {driverData.status}</Text>
            </View>
            <View style={{borderWidth:2,borderLeftWidth:20,borderColor:'#08B69D',padding:20, borderRadius:8,margin:10, backgroundColor:"#ffffff"}}>
              <Text style={{color:"#08B69D",}}>Name : {deviceData.name}</Text>
              <Text style={{color:"#08B69D",}}>ID : {deviceData.id}</Text>
              <Text style={{color:"#08B69D",}}>Status : {deviceData.status}</Text>
            </View>
          </View>
          <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={() => setStep(3)} style={styles.button}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {Final();}} style={styles.button}>
              <Text style={styles.buttonText}>Confrim</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
    paddingTop:40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: '#08B69D',
  },
  stepText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    marginVertical: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#08B69D',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: '#0056b3',
  },
  coordinates: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 15,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    maxHeight: 150,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 80,
  },
});

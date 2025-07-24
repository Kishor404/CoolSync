import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { LoginStatus } from '../globals'; 
import { Ionicons, MaterialIcons } from '@expo/vector-icons';


const ButtonRow = ({ buttons }) => {
  return (
    <View style={styles.buttonsContainer}>
      {buttons.map((button, index) => (

          <TouchableOpacity 
            key={index} 
            style={styles.button} 
            onPress={button.onPress}
          >
            <Ionicons name={button.icon} size={30} color="#08B69D" />
            <Text style={styles.buttonText}>{button.text}</Text>
          </TouchableOpacity>
      ))}
    </View>
  );
};

export default function Home() {
  const navigation = useNavigation();

  console.log(LoginStatus);

  // Buttons based on user role
  const sellerButtons = [
    { text: 'Marketplace', onPress: () => navigation.navigate('Product') ,icon: 'storefront'},
    { text: 'Tracking', onPress: () => navigation.navigate('Map') ,icon: 'navigate'},
    { text: 'Shipment', onPress: () => navigation.navigate('Shipment') ,icon: 'cube'},
  ];

  const customerButtons = [
    { text: 'Marketplace', onPress: () => navigation.navigate('Product') ,icon: 'storefront'},
    { text: 'Track Me', onPress: () => navigation.navigate('TrackMe') ,icon: 'git-pull-request'},
    { text: 'Apply For Driver', onPress: () => navigation.navigate('Driver') ,icon: 'analytics'},

  ];

  const driverButtons = [
    { text: 'Marketplace', onPress: () => navigation.navigate('Product') ,icon: 'storefront'},
    { text: 'Current Job', onPress: () => navigation.navigate('CurrentJob') ,icon: 'briefcase'},
    { text: 'Tracking', onPress: () => navigation.navigate('Map') ,icon: 'navigate'},
    { text: 'Shipment', onPress: () => navigation.navigate('Shipment') ,icon: 'cube'},

  ];
  const buyerButtons = [
    { text: 'Marketplace', onPress: () => navigation.navigate('Product') ,icon: 'storefront'},
    { text: 'Tracking', onPress: () => navigation.navigate('Map') ,icon: 'navigate'},
    { text: 'Shipment', onPress: () => navigation.navigate('Shipment') ,icon: 'cube'},

  ];
  const hubButtons = [
    { text: 'Marketplace', onPress: () => navigation.navigate('Product') ,icon: 'storefront'},
    { text: 'Shipment', onPress: () => navigation.navigate('HubShipment') ,icon: 'cube'},

  ];

  return (
    <View style={styles.container}>
      {/* Fixed Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo}/>
      {/* User Profile Picture */}
      <TouchableOpacity style={styles.profilePic} onPress={()=>navigation.navigate('Profile')}>
            <Ionicons name='person-circle-outline' size={40} color="#08B69D" style={styles.accicon}/>
      </TouchableOpacity>



      {/* Fixed Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.bannerTitle}>Track Your</Text>
          <Text style={styles.bannerTitle}>Product Quality</Text>
          <Text style={styles.bannerTitle}>With Us</Text>
        </View>
        <Image source={require('../assets/truck.png')} style={styles.bannerImage}/>
      </View>

      {/* Welcome Back Text */}
      <Text style={styles.welcomeText}>Welcome Back ! {LoginStatus.Data.name}</Text>


      {/* Scrollable Buttons */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* ========== ONLY FOR SELLER ============= */}
        {LoginStatus.Data.role === 'seller' && (
          <ButtonRow buttons={sellerButtons} />
        )}

        {/* ========== ONLY FOR BUYER ============= */}
        {LoginStatus.Data.role === 'buyer' && (
          <ButtonRow buttons={buyerButtons} />
        )}

        {/* ================ ONLY FOR CUSTOMER ============== */}
        {LoginStatus.Data.role === 'customer' && (
          <ButtonRow buttons={customerButtons} />
        )}

        {/* ================ ONLY FOR DRIVER ============== */}
        {LoginStatus.Data.role === 'driver' && (
          <ButtonRow buttons={driverButtons} />
        )}

        {/* ================ ONLY FOR HUB MANAGER ============== */}
        {LoginStatus.Data.role === 'hub manager' && (
          <ButtonRow buttons={hubButtons} />
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
},
logo: {
    width: 140, // Increased logo size
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'flex-start', // Aligns the logo to the left
    marginTop: 25, // Pulled logo down
},

profilePic: {
    width: 40, // Reduced profile picture size
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 55, // Pulled profile picture down
    right: 30,
    marginTop: 5,
    justifyContent:'center',
},
bannerContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#08B69D', // Updated color
    borderRadius: 15,
    width: '90%',
    height: 150,
    padding: 15,
    marginTop: 20, // Pulled banner down
    marginBottom: 30,
    marginLeft: 20,
},

  textContainer: {
    flex: 1, // Occupy remaining space
},
bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
},
bannerImage: {
    width: 140, // Adjust size as needed
    height: 140,
    resizeMode: 'contain',
},
welcomeText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#08B69D', // Updated color
    textAlign: 'center',
    marginVertical: 20, // Spacing between text and buttons
},
buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
},
button: {
    width: '44%', // Adjust size of buttons
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15, // Space between buttons
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 30,
  // borderRadius: 16,
  // borderWidth:2,
  // borderColor:'#08B69D'
},

buttonText: {
  marginTop: 10,
  fontSize: 14,
  fontWeight: 'bold',
  color: '#08B69D', // Updated color
  textAlign: 'center',
},

});

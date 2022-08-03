import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const MapScreen = ({ navigation }) => { 
    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <View style={styles.topView}>
                <Text style={styles.welcome}>Visit Us!</Text>
                <MapView style={{ width:'90%', height:430 }} provider={PROVIDER_GOOGLE} showsUserLocation
                    initialRegion={{ latitude: 33.9410594, longitude: -84.5369207, 
                                    latitudeDelta: 0.252, longitudeDelta: 0.252}} >
                    <Marker coordinate={{latitude: 33.9414861, longitude: -84.5377449}} 
                        title={'Cobb Veterans Memorial Foundation'} description={'502 Fairground Street SE, Marietta GA'}/>
                </MapView>
                <Text style={styles.message}><Text style={{fontWeight:'bold', fontSize:22}}>Cobb Veterans Memorial</Text>{'\n'}502 Fairground Street SE{'\n'}Marietta GA 30060</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    topView: {
        alignItems: "center",
        width: '100%',
        height: '100%',
    },
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginTop: 30,
        marginBottom: 20,
        color: 'white',
    },
    message: {
        width:'80%',
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
  });
  
export default MapScreen;
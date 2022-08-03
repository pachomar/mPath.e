import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { navigateToScreen } from '../../helpers/navigation'; 
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const UploadVetScreen = ({ navigation, route }) => {
    return (
        <SafeAreaView>
            <ScrollView style={styles.scene} contentContainerStyle={{alignItems: "center"}} >
                <Text style={styles.welcome}>Great Job!</Text>
                <View style={styles.iconView}>
                    <FontAwesome name="child" size={150} color="red" style={styles.icon} />
                </View>
                <Text style={[styles.message,{fontWeight:'bold', marginTop:40}]}>Add more media</Text>
                <TouchableOpacity onPress={() => { navigateToScreen(navigation, "MediaVeteran") }}>
                    <Image source={require('../../images/add-field.png')}></Image>
                </TouchableOpacity>
                <View style={styles.buttonArea}>
                    <TouchableOpacity style={[styles.button,{marginTop:30}]} onPress={() => { navigateToScreen(navigation, "VeteranProfile")}}>
                        <Text style={styles.buttonText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,{marginBottom:130, marginTop:20, backgroundColor:'red'}]} onPress={() => { navigateToScreen(navigation, 'SubmitVeteran') }}>
                        <Text style={styles.buttonText}>Submit for Approval</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scene: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor:'#004481',
    },
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginTop: 30,
        marginBottom: 10,
        color: 'white',
    },
    buttonArea:{
        alignItems: "center",
        width: '100%',
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        fontFamily: 'Nunito',
        height: 50, 
        width: '50%',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        borderRadius:10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#00A1D8'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    icon: {
        backgroundColor: 'white'
    },
    iconView: { 
        backgroundColor: 'white',
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        borderRadius: 100,
    }
  });
  
export default UploadVetScreen;
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_CURRENT_VETERANID, REACT_APP_LOGIN_TOKEN, AWS_URL } from '@env';
import { navigateToScreen, showErrorMessage, showOkMessage } from '../../helpers/navigation'; 
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const SubmitVetScreen = ({ navigation, route }) => {
    
    const submitForApproval = async () => {
        let user = JSON.parse(await AsyncStorage.getItem(REACT_APP_LOGIN_TOKEN));

        fetch(AWS_URL + '/Veteran/Submit/', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'info': {
                    VeteranId: await AsyncStorage.getItem(REACT_APP_CURRENT_VETERANID),
                    UserId: user.UserId,
                    UserEmail: user.UserEmail
                }
            })
        })
        .then((response) => response.text())
        .then(data => { 
            if(JSON.parse(data).error || data.message) {
                showErrorMessage("Email failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                return false;
            }

            showOkMessage("Email sent to Curator","The provided information will be reviewed and approved");
            navigateToScreen(navigation, 'ConfirmVeteran');
        })
        .catch(function(error) {
            console.log(error)
        });
    }

    return (
        <SafeAreaView>
            <View style={styles.scene} >
                <Text style={styles.welcome}>Submit Veteran Profile for Approval</Text>
                <Text style={styles.message}>In order to ensure the integrity of  all Veterans  honored by CVMF, each veteran profile is reviewed and approved by a curator before posting on the Honor Wall.{'\n\n'}You will be notified by email after the curator completes the review.</Text>
                <View style={styles.buttonArea}>
                    <TouchableOpacity style={[styles.button,{marginTop:50, marginBottom:20}]} onPress={() => { navigateToScreen(navigation, 'CreateVeteran') }}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,{marginBottom:180, backgroundColor:'red'}]} onPress={submitForApproval}>
                        <Text style={styles.buttonText}>Submit for Approval</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scene: {
        width: '100%',
        height:'100%',
        backgroundColor:'#004481',
        alignItems: "center",
    },
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginBottom: 10,
        color: 'white',
        width:'70%', 
        textAlign:'center', 
        marginTop: 70,
    },
    buttonArea:{
        alignItems: "center",
        width: '100%',
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
        marginTop:40, 
        width:'80%'
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
        width: 180,
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        borderRadius: 90,
    }
  });
  
export default SubmitVetScreen;
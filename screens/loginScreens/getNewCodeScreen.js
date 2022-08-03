import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { AWS_URL } from '@env';
import { showErrorMessage } from '../../helpers/navigation';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

const GetNewCodeScreen = ({ navigation }) => {
    const [userInput, setEmail] = React.useState('');
    
    const sendVerificationCode = () => {
        const emailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
        //const phoneRegex = new RegExp("^[\+]?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{3,6}[-\s\.]?[0-9]{4,9}$");

        if (!emailRegex.test(userInput)) {
            showErrorMessage("Invalid identification format","Please, use a valid email format.")
            return false;
        } 

        fetch(AWS_URL + '/User/Resend?verifCode=' 
        + (Math.floor(Math.random()*900000) + 100000) + '&userEmail=' + userInput)
        .then(response => {
            return response.json();
        })
        .then(data => { 
            if(data.error || data.message) {
                showErrorMessage("Email not registered", data.error ? data.error : data.message);
                return false;
            }
            
            navigation.navigate('EmailVerify', { params: {lastScreen: 'SignUp', userEmail: userInput}})
        })
        .catch(function(error) {
            console.log(error);
        }); 
    }

    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                <View style={styles.topView}>
                    <Text style={styles.welcome}>Let's begin</Text>
                    <View style={styles.searchSection}>
                        <TextInput style={styles.input} placeholder="Enter email" onChangeText={(email) => setEmail(email)}/>
                    </View>
                    <TouchableOpacity style={[styles.button, styles.buttonSignUp]} onPress={sendVerificationCode}>
                        <Text style={styles.buttonText}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginTop: 30,
        marginBottom: 10,
        color: 'white',
    },
    topView: {
        alignItems: "center",
        width: '100%',
        height: '100%',
    },
    message: {
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16, 
        marginTop: 20,
        textAlign: 'center',
        width:'70%',
    },
    searchSection: {
        alignItems: 'center',
        width:'80%',
        marginTop:10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
        fontSize: 20,
        width: '100%',
        marginTop: 20,
        borderRadius:10,
        color: '#424242',
    },
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '80%',
        alignItems: 'center',
        padding: 15,
        margin: 5,
        borderRadius:10,
        marginTop: 20
      },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
      },
    buttonSignUp:{
        backgroundColor: '#00A1D8'
    },
  });
  
export default GetNewCodeScreen;
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import { AWS_URL } from '@env';
import { showErrorMessage } from '../../helpers/navigation';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

const GetNewPwdScreen = ({ navigation }) => {
    const [showLoading, setShowLoading] = React.useState(false);
    const [userInput, setEmail] = React.useState('');
    
    const sendVerificationCode = () => {
        const emailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");

        if (!emailRegex.test(userInput)) {
            showErrorMessage("Invalid identification format","Please, use a valid email format.")
            return false;
        } 

        setShowLoading(true);
        fetch(AWS_URL + '/User/Resend?verifCode=' 
        + (Math.floor(Math.random()*900000) + 100000) + '&userEmail=' + userInput + '&isPass=1')
        .then(response => {
            return response.json();
        })
        .then(data => { 
            if(data.error || data.message) {
                showErrorMessage("Email not registered", data.error ? data.error : data.message);
                setShowLoading(false);
                return false;
            }
            
            setShowLoading(false);
            navigation.navigate('EmailVerify', { params: {lastScreen: 'GetNewPwd', userEmail: userInput}});
        })
        .catch(function(error) {
            setShowLoading(false);
            console.log(error);
        }); 
    }

    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                    <Spinner visible={showLoading} textContent={"Please wait..."} overlayColor={'#00448188'} color={'black'} />
                    <View style={styles.topView}>
                        <Text style={styles.welcome}>Let's begin</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} placeholder="Enter email" onChangeText={setEmail}/>
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
        fontFamily: 'SourceSansPro',
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
  
export default GetNewPwdScreen;
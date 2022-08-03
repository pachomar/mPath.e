import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLoggedUser } from '../../helpers/globals';
import { REACT_APP_LOGIN_TOKEN, AWS_URL } from '@env';
import { showErrorMessage, showOkMessage } from '../../helpers/navigation';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

const ResetPasswordScreen = ({ navigation, route }) => {
    const lastScreen = route.params.lastScreen;
    const userEmail = route.params.userEmail;
    const userPhone = route.params.userPhone;

    const [showLoading, setShowLoading] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [showPassword, setshowPassword] = React.useState(true);
    const [iconName, setIconName] = React.useState('eye');
    
    const resetPassword = () => {
        if (password.length < 8) {
            showErrorMessage("Invalid password format","Password must be at least 8 characters long")
            return false;
        } else if (password !== password2) {
            showErrorMessage("Incorrect confirmation password","Password and Confirmation Password must be the same")
            return false;
        }

        setShowLoading(true);
        fetch(AWS_URL + '/User/Reset?userEmail='+ userEmail + '&newPass=' + password, { method : 'put'})
        .then(response => {
            return response.json();
        })
        .then(async data => { 
            setShowLoading(false);
            showOkMessage("Password reset successfully!", "Please, login with your new password");
            setLoggedUser(data);
            await AsyncStorage.setItem(REACT_APP_LOGIN_TOKEN, JSON.stringify(data));

            navigation.navigate('SignIn');
        })
        .catch(function(error) {
            setShowLoading(false);
            console.log(error)
        });
    }

    const makePasswordVisible = () => {
        setshowPassword(!showPassword);
        setIconName(showPassword ? "eye-slash" : "eye");
    }

    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                    <Spinner visible={showLoading} textContent={"Please wait..."} overlayColor={'#00448188'} color={'black'} />
                    <View style={styles.topView}>
                        <Text style={styles.welcome}>Create a new password</Text>
                        <View style={[styles.passSection,{marginTop:20}]}>
                            <TextInput style={styles.passInput} placeholder="Create a password" secureTextEntry={showPassword} onChangeText={setPassword} />
                            <FontAwesome5 name={iconName} size={20} color="gray" style={styles.passIcon} onPress={makePasswordVisible} />
                        </View>
                        <View style={[styles.passSection,{marginTop:20}]}>
                            <TextInput style={styles.passInput} placeholder="Confirm your password" secureTextEntry={showPassword} onChangeText={setPassword2}/>
                            <FontAwesome5 name={iconName} size={20} color="gray" style={styles.passIcon} onPress={makePasswordVisible} />
                        </View>
                        <TouchableOpacity style={[styles.button, styles.buttonSignUp]} onPress={resetPassword}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
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
        color: '#424242',
        fontSize: 20,
        width: '100%',
        marginTop: 20,
        borderRadius:10,
    },
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '80%',
        alignItems: 'center',
        padding: 15,
        margin: 5,
        borderRadius:10,
        marginTop: 20,
        marginBottom: 30,
      },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
      },
    buttonSignUp:{
        backgroundColor: '#00A1D8'
    },
    passSection: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius:10,
        width:'80%',
    },
    passIcon: {
        padding: 12,
    },
    passInput: {
        flex: 1,
        padding: 10,
        borderRadius:10,
        fontSize:18,
        color: '#424242',
    },
  });
  
export default ResetPasswordScreen;
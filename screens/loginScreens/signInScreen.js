import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLoggedUser } from '../../helpers/globals';
import { REACT_APP_LOGIN_TOKEN, AWS_URL } from '@env';
import { navigateToScreen, showErrorMessage } from '../../helpers/navigation';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

const SignInScreen = ({ navigation, route }) => {
    const [showLoading, setShowLoading] = React.useState(false);
    const [userInput, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setshowPassword] = React.useState(true);
    const [iconName, setIconName] = React.useState('eye');

    const signIn = () => {
        const emailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");

        if (!emailRegex.test(userInput)) {
            showErrorMessage("Invalid identification format","Please, provide a valid email format")
            return false;
        }

        if (password.length < 8) {
            showErrorMessage("Incorrect password provided","The format password is too short")
            return false;
        }

        setShowLoading(true);
        fetch(AWS_URL + '/User/Login?userEmail='+ userInput + '&userPwd=' + password)
        .then(response => {
            return response.json();
        })
        .then(async data => { 
            if(data.error || data.message) {
                showErrorMessage("Incorrect login information", data.error? data.error : data.message);
                setShowLoading(false);
                return false;
            }

            if(!data.IsVerified)
            {
                setShowLoading(false);
                navigation.navigate('AccountLocked', { params: { lastScreen: 'SignIn', userEmail: userInput, userPhone: null, isLocked: false }});
            }
            else if (data.IsLocked)
            {
                setShowLoading(false);
                navigation.navigate('AccountLocked', { params: { lastScreen: 'SignIn', userEmail: userInput, userPhone: null, isLocked: true }});
            }
            else
            {
                setLoggedUser(data);
                setShowLoading(false);
                await AsyncStorage.setItem(REACT_APP_LOGIN_TOKEN, JSON.stringify(data));

                if(route.params != null && route.params.lastScreen != null && route.params.lastScreen == 'VerifyCode')
                    navigation.navigate('SetNotifications', { params: { lastScreen: 'SignIn', userInfo: data }});
                else
                    navigation.navigate('Welcome');
            }
        })
        .catch(function(error) {
            setShowLoading(false);
            showErrorMessage("There was a problem login you in", error);
            console.log(error);
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
                        <Text style={styles.welcome}>Let's get started.</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} placeholder="Enter your email" onChangeText={setEmail} />
                        </View>
                        <View style={[styles.passSection,{marginTop:20}]}>
                            <TextInput style={styles.passInput} placeholder="Enter your password" secureTextEntry={showPassword} onChangeText={setPassword} />
                            <FontAwesome5 name={iconName} size={20} color="gray" style={styles.passIcon} onPress={makePasswordVisible} />
                        </View>
                        <TouchableOpacity style={[styles.button, styles.buttonSignUp]} onPress={() => signIn()}>
                            <Text style={styles.buttonText}>LOG IN</Text>
                        </TouchableOpacity>
                        <View style={{width: '80%', marginBottom: 80}}>
                            <Text style={styles.message}><Text style={{ color: 'white'}} onPress={()=> navigation.navigate('GetNewPwd') }>Forgot your password?</Text></Text>
                        </View>
                        <View style={{width: '80%'}}>
                            <Text style={styles.message}>Don't have an account? <Text style={{ color: 'gold'}} onPress={()=> navigation.navigate('SignUp') }>Sign Up!</Text></Text>
                        </View>
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
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
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
  
export default SignInScreen;
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AWS_URL } from '@env';
import { CheckBox } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { navigateToScreen, showErrorMessage } from '../../helpers/navigation';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Linking } from 'react-native';
 
const SignUpScreen = ({ navigation, route }) => {
    const lastScreen = route.params != null ? route.params.lastScreen : null;

    const [showLoading, setShowLoading] = React.useState(false);
    const [checkedTerms, setCheck] = React.useState(false);
    const [userInput, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [showPassword, setshowPassword] = React.useState(true);
    const [iconName, setIconName] = React.useState('eye');
    
    useFocusEffect(() => {
        if(lastScreen == 'TermsPolicy') setCheck(true)
    });

    const signUp = () => {
        const emailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");

        if(!checkedTerms) {
            showErrorMessage("Please, agree to our terms and conditions","You must agree to user terms and policy privacy to create an account");
            return false;
        }

        if (!emailRegex.test(userInput)) {
            showErrorMessage("Invalid identification format","Please, provide a valid email format")
            return false;
        } else if (password.length < 8) {
            showErrorMessage("Invalid password format","Password must be at least 8 characters long")
            return false;
        } else if (password !== password2) {
            showErrorMessage("Incorrect confirmation password", "Password and Confirmation Password must be the same")
            return false;
        }

        setShowLoading(true);
        fetch(AWS_URL + '/User/Create?userEmail='+ userInput + '&userPass=' + password + 
            '&verifCode=' + (Math.floor(Math.random()*900000) + 100000), { method: 'post'})
        .then(response => {
            return response.json();
        })
        .then(data => { 
            if(data.error || data.message) {
                showErrorMessage("Problem creating account", data.error ? data.error : data.message);
                setShowLoading(false);
                return;
            }

            setShowLoading(false);
            navigation.navigate('EmailVerify', { params: {lastScreen: 'SignUp', userEmail: userInput}});
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
        <SafeAreaView>
            <View>
            <Spinner visible={showLoading} textContent={"Please wait..."} overlayColor={'#00448188'} color={'black'} />
                <View style={styles.topView}>
                    <Text style={styles.welcome}>Help Build A Legacy</Text>
                    <View style={{width:'80%'}}>
                        <Text style={styles.message}>Sign up to preserve our national history and legacies of Veterans who serve.</Text>
                    </View>
                    <View style={styles.searchSection}>
                        <TextInput style={styles.input} placeholder="Enter email" onChangeText={setEmail}/>
                    </View>
                    <View style={[styles.passSection,{marginTop:20}]}>
                        <TextInput style={styles.passInput} placeholder="Create a password" secureTextEntry={showPassword} onChangeText={setPassword} />
                        <FontAwesome5 name={iconName} size={20} color="gray" style={styles.passIcon} onPress={makePasswordVisible} />
                    </View>
                    <View style={[styles.passSection,{marginTop:20}]}>
                        <TextInput style={styles.passInput} placeholder="Confirm your password" secureTextEntry={showPassword} onChangeText={setPassword2}/>
                        <FontAwesome5 name={iconName} size={20} color="gray" style={styles.passIcon} onPress={makePasswordVisible} />
                    </View>
                    <View style={{width: '80%', alignItems:'center'}}>
                        <CheckBox containerStyle={styles.checkbox} onPress={() => setCheck(!checkedTerms)} checked={checkedTerms} checkedColor={'white'} title={
                            <Text style={styles.terms}> I agree to the <Text style={{ color: 'gold'}} onPress={()=> navigation.navigate('TermsPolicy') }>user terms</Text> {'\&'} <Text style={{ color: 'gold'}} onPress={()=> navigation.navigate('TermsPolicy') }>privacy policy</Text></Text>}>
                        </CheckBox>
                    </View>
                    <TouchableOpacity style={[styles.button, styles.buttonSignUp]} onPress={() => signUp()}>
                        <Text style={styles.buttonText}>CREATE MY ACCOUNT</Text>
                    </TouchableOpacity>
                    <View style={{width: '80%', marginBottom: 50}}>
                        <Text style={styles.messagebottom}>Already have an account? <Text style={{ color: 'gold'}} onPress={()=> navigation.navigate('SignIn') }>Sign In</Text></Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
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
    subtitle: {
        fontFamily: 'SourceSansPro',
        fontSize: 20, 
        color: 'white',
        width:'80%',
        textAlign: 'center',
        marginBottom:5,
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
        marginTop: 15,
    },
    topView: {
        alignItems: "center",
        width: '100%',
        height: '100%',
        backgroundColor: '#004481',
    },
    searchSection: {
        alignItems: 'center',
        width:'80%',
        marginTop:10,
    },
    input: {
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
    terms: {
        fontFamily: 'SourceSansPro',
        fontSize: 14, 
        color: 'white',
        textAlign: 'left',
    },
    messagebottom: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
        marginTop: 40,
    },
    checkbox:{
        backgroundColor:'transparent',
        borderWidth: 0,
        justifyContent: 'center'
    },
    passSection: {
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
  
export default SignUpScreen;
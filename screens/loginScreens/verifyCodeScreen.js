import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import { AWS_URL } from '@env';
import { navigateToScreen, showErrorMessage, showOkMessage } from '../../helpers/navigation';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

const VerifyCodeScreen = ({ navigation, route }) => {
    const lastScreen = route.params.lastScreen;
    const userEmail = route.params.userEmail;
    const userPhone = route.params.userPhone;
    const [showLoading, setShowLoading] = React.useState(false);

    const ref_input1 = React.useRef(); const [firstDigit, setDigit1] = React.useState('');
    const ref_input2 = React.useRef(); const [secondDigit, setDigit2] = React.useState('');
    const ref_input3 = React.useRef(); const [thirdDigit, setDigit3] = React.useState('');
    const ref_input4 = React.useRef(); const [fourthDigit, setDigit4] = React.useState('');
    const ref_input5 = React.useRef(); const [fifthDigit, setDigit5] = React.useState('');
    const ref_input6 = React.useRef(); const [sixthDigit, setDigit6] = React.useState('');

    const numberRegex = new RegExp("^[0-9]");

    const inputChanged = (value, nextInput, setFunction) => {
        if(!numberRegex.test(value)) {
            return "";
        } else {
            setFunction(value);
            if(nextInput === ref_input1) {
                validateAndGoNext(value);
            } else {
                nextInput.current.focus();
            }
        }
    }

    const validateAndGoNext = (sixth)  => {
        let enteredCode = firstDigit + secondDigit + thirdDigit + fourthDigit + fifthDigit + sixth;

        if(enteredCode.length < 6)
        {
            showErrorMessage("Incorrect verification code","Please verify the code you entered has all its digits");
        }
        else 
        {
            setShowLoading(true);

            if(lastScreen == 'SignUp' || lastScreen == 'SignIn') {
                fetch(AWS_URL + '/User/Verify?verifCode=' + enteredCode +'&userEmail=' + userEmail, { method: 'put' })
                .then(response => {
                    return response.json();
                }).then(data => {
                    if(data.error || data.message) {
                        showErrorMessage("Incorrect verification code", data.error ? data.error : data.message);
                        setShowLoading(false);
                        return;
                    }

                    setShowLoading(false);
                    navigation.navigate('SignIn', { lastScreen: 'VerifyCode', userEmail: userEmail, userPhone: userPhone });
                    showOkMessage("Account verified!", "Your account is verified. Please, login with your new user credentials")
                })
                .catch(function(error) {
                    setShowLoading(false);
                    console.log(error);
                });
            } else {
                fetch(AWS_URL + '/User/Validate?verifCode=' + enteredCode +'&userEmail=' + userEmail)
                .then(response => {
                    return response.json();
                }).then(data => {
                    if(data.error || data.message) {
                        showErrorMessage("Incorrect verification code", data.error ? data.error : data.message);
                        setShowLoading(false);
                        return;
                    }

                    setShowLoading(false);
                    navigation.navigate('ResetPassword', { lastScreen: 'VerifyCode', userEmail: userEmail, userPhone: userPhone });
                })
                .catch(function(error) {
                    setShowLoading(false);
                    console.log(error);
                });
            }
        }
    }

    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                <Spinner visible={showLoading} textContent={"Please wait..."} overlayColor={'#00448188'} color={'black'} />
                <View style={styles.topView}>
                    <Text style={styles.welcome}>Provide your code</Text>
                    <View style={styles.searchSection}>
                        <TextInput style={styles.input} maxLength={1} keyboardType='number-pad' 
                            onChangeText={(val) => inputChanged(val, ref_input2, setDigit1) }  ref={ref_input1}/>
                        <TextInput style={styles.input} maxLength={1} keyboardType='number-pad' 
                            onChangeText={(val) => inputChanged(val, ref_input3, setDigit2) }  ref={ref_input2} />
                        <TextInput style={styles.input} maxLength={1} keyboardType='number-pad' 
                            onChangeText={(val) => inputChanged(val, ref_input4, setDigit3) }  ref={ref_input3} />
                        <TextInput style={styles.input} maxLength={1} keyboardType='number-pad'
                            onChangeText={(val) => inputChanged(val, ref_input5, setDigit4) }  ref={ref_input4} />
                        <TextInput style={styles.input} maxLength={1} keyboardType='number-pad' 
                            onChangeText={(val) => inputChanged(val, ref_input6, setDigit5) }  ref={ref_input5} />
                        <TextInput style={styles.input} maxLength={1} keyboardType='number-pad'
                            onChangeText={(val) => inputChanged(val, ref_input1, setDigit6) } ref={ref_input6} />
                    </View>
                    <TouchableOpacity style={[styles.button, styles.buttonSignUp]} onPress={() => validateAndGoNext(sixthDigit)}>
                        <Text style={styles.buttonText}>SUBMIT</Text>
                    </TouchableOpacity>
                    <Text style={styles.message}>Need a new verification code? <Text style={{ color: 'gold'}}
                        onPress={()=> navigateToScreen(navigation, 
                        lastScreen == 'SignUp' || lastScreen == 'SignIn' ? 'GetNewCode' : 'GetNewPwd',
                        { lastScreen : lastScreen, userEmail: userEmail, userPhone: userPhone}) }>{"\n"}Send new code</Text>
                    </Text>
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
        flexDirection: 'row',
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
        fontSize: 20,
        width: '12%',
        marginTop: 20,
        marginLeft: 6,
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
  
export default VerifyCodeScreen;
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { navigateToScreen } from '../../helpers/navigation';
import { Text, Image, StyleSheet } from 'react-native';

const PhoneVerify = ({ navigation, route }) => {
    React.useEffect(() => {
      setTimeout(function(){
          navigateToScreen(navigation, 'VerifyCode', {
            lastScreen: route.params.params.lastScreen, 
            userPhone: route.params.params.userPhone,
          });
      }, 5000);
    }, []);

    return(
        <LinearGradient colors={["#00A1D8", "#004481"]} style={styles.container} >
            <Image source={require('../../images/sms.png')}></Image>
            <Text style={styles.message}>We have sent a text message.{"\n\n"}Check your messages for the code to { route.params.params.lastScreen == 'SignUp' ? 'activate your account' : 'reset your password'}.</Text>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute', 
      left: 0, 
      right: 0, 
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
  }
});

export default PhoneVerify;
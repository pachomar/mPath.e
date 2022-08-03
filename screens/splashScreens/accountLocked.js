import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { navigateToScreen } from '../../helpers/navigation';
import { Text, Image, StyleSheet } from 'react-native';

const AccountLocked = ({ navigation, route }) => {
    React.useEffect(() => {
      console.log(route)
      setTimeout(function() {
        if(route.params.params.lastScreen == 'SignIn' && !route.params.params.isLocked) {
            navigateToScreen(navigation, 'VerifyCode', { lastScreen: route.params.params.lastScreen, userEmail: route.params.params.userEmail, userPhone: route.params.params.userPhone });
        }
        else {
          navigation.navigate('Application', { screen: 'GetNewPwd' });
        }
      }, 5000);
    }, []);

    return(
        <LinearGradient colors={["#00A1D8", "#004481"]} style={styles.container} >
            <Image source={require('../../images/lock.png')}></Image>
            <Text style={styles.message}>Your account is {route.params.params.isLocked ? 'locked' : 'not verified'}.{"\n\n"} { route.params.params.isLocked ? 'Please, reset your password to regain access' : 'Check your inbox for the code to activate your account'}.</Text>
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

export default AccountLocked;
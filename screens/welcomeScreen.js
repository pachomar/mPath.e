import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_LOGIN_TOKEN } from '@env';
import { navigateToScreen } from '../helpers/navigation';
import { getLoggedUser, isLoggedUser, setLoggedUser } from '../helpers/globals';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, LogBox } from 'react-native';

const WelcomeScreen = ({ navigation, route }) => {
    const [logoOpacity, setLogoOpacity] = React.useState(0);
    const [textOpacity, setTextOpacity] = React.useState(0);
    const [buttonsTop, setButtonsTop] = React.useState(500);
    const [isLogged, setIsLogged] = React.useState(false);
 
    React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
          let user = JSON.parse(await AsyncStorage.getItem(REACT_APP_LOGIN_TOKEN));

          setLoggedUser(user != null ? user : {});
          setIsLogged(user != null);
          route.params.profileChange(user != null ? user.Profile.UserImage : '');
          route.params.userChange(user != null ? (user.Profile.FirstName != null && user.Profile.LastName != null ? user.Profile.FirstName + ' ' + user.Profile.LastName : null) : null);
      })
      return unsubscribe;
  }, [navigation]);

    React.useEffect(() => {
      if(logoOpacity < 1)
        setTimeout(() => { setLogoOpacity(logoOpacity + 0.045) }, 15);
      
      if(logoOpacity > 1 && textOpacity < 1)
        setTimeout(() => { setTextOpacity(textOpacity + 0.045) }, 8);
      
      if(textOpacity > 1 && buttonsTop > 70)
        setTimeout(() => { setButtonsTop(buttonsTop - 20) }, 2);
    });

    React.useEffect(() => {
      LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
    }, []);

    return (
        <SafeAreaView>
        <ImageBackground source={require('../images/splash_icon.png')} style={{width: '100%', height: '100%'}}>
            <View style={{height: '100%', width: '100%'}}>
              <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../images/logo.png')} style={[styles.logo,{opacity:logoOpacity}]}></Image>
                  <Image source={require('../images/logo-wht.png')} style={{marginTop:20,opacity:logoOpacity}}></Image>
                  <Text style={[styles.screenText,{opacity:textOpacity}]}>HONOR, EDUCATE, INSPIRE</Text>
              </View>
              <View style={[styles.bottomView,{marginTop:buttonsTop}]}>
                  <TouchableOpacity style={[styles.button, styles.buttonExplore]} onPress={() => navigateToScreen(navigation, 'Explore') }>
                    <Text style={styles.buttonText}>EXPLORE</Text>
                  </TouchableOpacity>
                  { isLogged ?
                    <TouchableOpacity style={[styles.button, styles.buttonSignIn]} color='red' onPress={()=> navigateToScreen(navigation, 'Home') }>
                      <Text style={styles.buttonText}>HOME</Text>
                    </TouchableOpacity> : 
                    <TouchableOpacity style={[styles.button, styles.buttonSignIn]} color='red' onPress={()=> navigateToScreen(navigation, 'SignIn') }>
                      <Text style={styles.buttonText}>SIGN IN</Text>
                    </TouchableOpacity>
                  }   
                  { isLogged ? null :
                    <Text style={[styles.screenText, {marginTop:60}]}>Don't have an account? <Text style={{ color: 'gold'}} onPress={()=> navigateToScreen(navigation, 'SignUp') }>Sign Up</Text></Text>
                  }
                  </View>
              </View>
        </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '80%',
        alignItems: 'center',
        padding: 15,
        margin: 5,
        borderRadius:10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    screenText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
    },
    bottomView: {
        alignItems: "center",
        padding: 10,
        width: '100%',
        height: '100%',
    },
    buttonExplore:{
        backgroundColor: 'red'
    },
    buttonSignIn: {
        marginTop: 20,
        backgroundColor: '#00A1D8', 
    },
    logo:{
        marginTop:50,
        height: 200,
        width: 200,
    }
  });
  
export default WelcomeScreen;
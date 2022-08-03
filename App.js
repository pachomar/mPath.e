import 'react-native-gesture-handler';
import 'react-native-vector-icons';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FlashMessage from 'react-native-flash-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigateToScreen } from './helpers/navigation';
import { HeaderBackButton } from 'react-navigation-stack';
import { REACT_APP_LOGIN_TOKEN } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { isLoggedUser, setLoggedUser } from './helpers/globals';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { useColorScheme, Image, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, SliderBase } from 'react-native';

import WelcomeScreen from './screens/welcomeScreen';
import AnonymousScreen from './screens/loginScreens/anonymousScreen';
import SignUpScreen from './screens/loginScreens/signUpScreen';
import SignInScreen from './screens/loginScreens/signInScreen';
import TermsScreen from './screens/loginScreens/termsScreen';
import GetNewPwdScreen from './screens/loginScreens/getNewPwdScreen';
import GetNewCodeScreen from './screens/loginScreens/getNewCodeScreen';
import VerifyCodeScreen from './screens/loginScreens/verifyCodeScreen';
import ResetPasswordScreen from './screens/loginScreens/resetPasswordScreen';

import SearchVetScreen from './screens/veteranScreens/searchVetScreen';
import CreateVetScreen from './screens/veteranScreens/createVetScreen';
import ServiceVetScreen from './screens/veteranScreens/serviceVetScreen';
import TitleVetScreen from './screens/veteranScreens/titleVetScreen';
import MediaVetScreen from './screens/veteranScreens/mediaVetScreen';
import ImageVetScreen from './screens/veteranScreens/imageVetScreen';
import VideoVetScreen from './screens/veteranScreens/videoVetScreen';
import AudioVetScreen from './screens/veteranScreens/audioVetScreen';
import PreviewVetScreen from './screens/veteranScreens/peviewVetScreen';
import UploadVetScreen from './screens/veteranScreens/uploadVetScreen';
import SubmitVetScreen from './screens/veteranScreens/submitVetScreen';
import ConfirmVetScreen from './screens/veteranScreens/confirmVetScreen';

import EmailVerify from './screens/splashScreens/emailVerify';
import PhoneVerify from './screens/splashScreens/phoneVerify';
import AccountLocked from './screens/splashScreens/accountLocked';
import SetNotifications from './screens/splashScreens/setNotifications';

import HomeScreen from './screens/homeScreens/homeScreen';
import VirtualTourScreen from './screens/homeScreens/virtualTourScreen';
import AboutScreen from './screens/homeScreens/aboutScreen';
import MapScreen from './screens/homeScreens/mapScreen';
import SupporterScreen from './screens/homeScreens/supporterScreen';
import UserProfileScreen from './screens/homeScreens/profileScreen';
import UserSettingScreen from './screens/homeScreens/settingsScreen';

import ExploreScreen from './screens/exploreScreens/exploreScreen';
import SearchResultScreen from './screens/exploreScreens/resultsScreen';
import ProfileScreen from './screens/exploreScreens/profileScreen';
import SpeechtoText from './screens/SpeechtoText';

const App: () => React.Node = () => {
  const [menuImage, setMenuImage] = React.useState('');
  const [userName, setUserName] = React.useState(null);
  const navigationRef = React.useRef(null);
  let previousScreens = React.useRef([]);
  let navButton = React.useRef('');

  const navButtonPress = (event, navigation, destination) => {
      navButton = event.target.substring(0, event.target.indexOf('-'));
      event.preventDefault();
      navigateToScreen(navigation, destination);
  }

  function navBackButton(navigation, route){    
      if(previousScreens.current.length > 1) {
        return ( 
          <TouchableOpacity style={{ paddingLeft:15, paddingRight:15 }}>
          <FontAwesome5 name="arrow-circle-left" size={20} color="#66C7E8" onPress={()=> { 
                let params = navigation.getState().routes.filter(p => p.params != null)[0];
                let prevScreenName = previousScreens.current[previousScreens.current.length - 2];

                navigateToScreen(navigation, prevScreenName, params != null ? params.params : params);       
                previousScreens.current = previousScreens.current.slice(0, previousScreens.current.length -1);
            }} />
            </TouchableOpacity>)
        }
      else {
        return null;
      }
  }
  
  function navMenuButton(navigation){
    return (
      <TouchableOpacity style={{ paddingLeft:15, paddingRight:15 }} onPress={() => { if(navigation.openDrawer) navigation.openDrawer();}}>
        <Feather name="menu" size={20} color="#66C7E8"></Feather>
      </TouchableOpacity>
    )
  }

  function tabOptionButton(tabInfo, route){
    let iconName = route.name == "EXPLORE" ? "compass" : route.name == "BUILD" ? "users" : route.name == "HOME" ? "th-large" : route.name == "SAVED" ? "star" : "bookmark";
    let iconColor = "#00294D";//route.name == navButton || tabInfo.focused? "#00A1D8" : "#00294D";
    return <FontAwesome name={iconName} size={28} color={iconColor} />
  }

  function CustomDrawerContent(navigation) {
    return (
      <SafeAreaView width={170} style={{width:170}}>
        <TouchableOpacity style={[styles.container,{marginBottom:10}]} onPress={() => {isLoggedUser() ? navigateToScreen(navigation, 'UserProfile') :  navigateToScreen(navigation, 'SignIn') }}>
          {
            menuImage  == '' || menuImage == null ?
              <Image style={styles.image} height={100} width={100} source={require('./images/no-profile.png')}></Image> : 
              <Image style={styles.image} height={100} width={100} source={{uri: 'data:image/jpg;base64,' + menuImage}}></Image>
          }
          <Text style={styles.message}>{userName == null ? 'My Profile' : userName }</Text>
        </TouchableOpacity>
        <View style={{width:200}}>
          { isLoggedUser() ? <DrawerItem label="Notifications" labelStyle={{fontSize:16, marginLeft:-20, fontWeight:'bold'}} icon={() => (<FontAwesome name="bell" size={20} color="#666666"/>)} onPress={() => { }} /> : null }
          { isLoggedUser() ? <DrawerItem label="Settings" style={{marginTop:-10}} labelStyle={{fontSize:16, marginLeft:-20, fontWeight:'bold'}} icon={() => (<FontAwesome name="gear" size={20} color="#666666"/>)} onPress={() => { navigateToScreen(navigation, 'UserSettings') }} /> : null }
        </View>
        <DrawerItem label="Home" style={{marginTop:-10}} labelStyle={{fontSize:16, marginLeft:-20, fontWeight:'bold'}} icon={() => (<FontAwesome name="th-large" size={20} color="#666666"/>)} onPress={() => { navigateToScreen(navigation, 'Home') }} /> 
        <DrawerItem label="Support" style={{marginTop:-10}} labelStyle={{fontSize:16, marginLeft:-20, fontWeight:'bold'}} icon={() => (<FontAwesome name="comments" size={20} color="#666666"/>)} onPress={() => { navigateToScreen(navigation, 'Supporters') }} /> 
        { !isLoggedUser() ?
        <DrawerItem label="Sign In" style={{marginTop:-10}} labelStyle={{fontSize:16, marginLeft:-20, fontWeight:'bold'}} icon={() => (<FontAwesome name="user" size={20} color="#666666"/>)} onPress={() => { navigateToScreen(navigation, 'SignIn') }} /> 
        :
        <DrawerItem label="Sign Out" style={{marginTop:-10}} labelStyle={{fontSize:16, marginLeft:-20, fontWeight:'bold'}} icon={() => (<FontAwesome name="arrow-circle-o-left" size={20} color="#666666"/>)} onPress={async () => { setLoggedUser({}); await AsyncStorage.removeItem(REACT_APP_LOGIN_TOKEN); navigation.navigate('Welcome') }} />
        }
      </SafeAreaView >
    );
  }

  const Wrap = createStackNavigator();
  const Video = createStackNavigator();
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const Side = createDrawerNavigator();

  function ApplicationStackScreen() {
    return (
        <Stack.Navigator screenOptions={{ gestureDirection: 'horizontal-inverted',headerStyle: { backgroundColor: '#00294D', height: 60}, headerLeft: navMenuButton(),
            headerTitleStyle: {color: 'white', fontFamily:'Montserrat', fontSize:18}, headerTitleAlign:'center' }} >
          <Stack.Screen name="Home" component={HomeScreen} options={({navigation}) => ({ title: 'HOME', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="SignIn" component={SignInScreen} options={({navigation}) => ({ title: 'LOG IN', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={({navigation}) => ({ title: 'SIGN UP', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="Anonymous" component={AnonymousScreen} options={({navigation}) => ({ title: 'HELP BUILD A LEGACY', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="TermsPolicy" component={TermsScreen} options={({navigation}) => ({ title: 'TERMS \& CONDITIONS', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="GetNewPwd" component={GetNewPwdScreen} options={({navigation}) => ({ title: 'RESET PASSWORD', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="GetNewCode" component={GetNewCodeScreen} options={({navigation}) => ({ title: 'NEW VERIFICATION CODE', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} options={({navigation, route}) => ({ title: 'VERIFY YOUR CODE', headerRight: (props) => (navBackButton(navigation, route)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={({navigation}) => ({ title: 'RESET PASSWORD', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="Explore" component={ExploreScreen} options={({navigation}) => ({ title: 'EXPLORE', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="SearchResult" component={SearchResultScreen} options={({navigation}) => ({ title: 'EXPLORE', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="VeteranProfile" component={ProfileScreen} options={({navigation}) => ({ title: 'VETERAN', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="Map" component={MapScreen} options={({navigation}) => ({ title: 'MAP', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="Supporters" component={SupporterScreen} options={({navigation}) => ({ title: 'SUPPORTERS', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} options={({navigation}) => ({ title: 'MY PROFILE', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="UserSettings" component={UserSettingScreen} options={({navigation}) => ({ title: 'SETTINGS', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="SearchVeteran" component={SearchVetScreen} options={({navigation}) => ({ title: 'BUILD A LEGACY', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="CreateVeteran" component={CreateVetScreen} options={({navigation}) => ({ title: 'BUILD A LEGACY', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="ServiceVeteran" component={ServiceVetScreen} options={({navigation}) => ({ title: 'BUILD A LEGACY', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="TitleVeteran" component={TitleVetScreen} options={({navigation}) => ({ title: 'BUILD A LEGACY', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="MediaVeteran" component={MediaVetScreen} options={({navigation}) => ({ title: 'BUILD A LEGACY', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="ImageUploadVeteran" component={ImageVetScreen} options={({navigation}) => ({ title: 'UPLOAD IMAGE', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="VideoUploadVeteran" component={VideoVetScreen} options={({navigation}) => ({ title: 'UPLOAD VIDEO', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="AudioUploadVeteran" component={AudioVetScreen} options={({navigation}) => ({ title: 'UPLOAD VIDEO', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="UploadPreviewVeteran" component={PreviewVetScreen} options={({navigation}) => ({ title: 'UPLOAD MEDIA', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="UploadMediaVeteran" component={UploadVetScreen} options={({navigation}) => ({ title: 'UPLOAD SUCCESSFULL!', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="SubmitVeteran" component={SubmitVetScreen} options={({navigation}) => ({ title: 'HELP BUILD A LEGACY', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Stack.Screen name="ConfirmVeteran" component={ConfirmVetScreen} options={({navigation}) => ({ title: 'HELP BUILD A LEGACY', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Video.Screen name="VirtualTour" component={VirtualTourScreen} options={({navigation}) => ({ title: 'VIRTUAL TOUR', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Video.Screen name="About" component={AboutScreen} options={({navigation}) => ({ title: 'ABOUT', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
        </Stack.Navigator>
    );
  }

  function VideoStackScreen() {
    return (
        <Video.Navigator screenOptions={{ gestureDirection: 'horizontal-inverted',headerStyle: { backgroundColor: '#00294D', height: 60}, headerLeft: navMenuButton(),
            headerTitleStyle: {color: 'white', fontFamily:'Montserrat', fontSize:18}, headerTitleAlign:'center' }} >
          <Video.Screen name="VirtualTour" component={VirtualTourScreen} options={({navigation}) => ({ title: 'VIRTUAL TOUR', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
          <Video.Screen name="About" component={AboutScreen} options={({navigation}) => ({ title: 'ABOUT', headerRight: (props) => (navBackButton(navigation)), headerLeft: (props) => (navMenuButton(navigation)) })} />
        </Video.Navigator>
      );
  }
        
  function ApplicationTabMenu () {
    return (
      <Side.Navigator initialRouteName="TabApplication" screenOptions={{ drawerStyle:{width:170} }} drawerContent={({navigation}) => <CustomDrawerContent {...navigation} />} >
        <Side.Screen name="TabApplication" component={ApplicationStackScreen} options={{headerShown: false}} />
      </Side.Navigator>
    );
  }

  return (
      <NavigationContainer ref={navigationRef} onStateChange={() => {
        if(navigationRef.current.getCurrentRoute().name != previousScreens.current[previousScreens.current.length -1])
          previousScreens.current.push(navigationRef.current.getCurrentRoute().name); }} >
        <Wrap.Navigator initialRouteName="Welcome" screenOptions={{headerLeft:null, headerRight:null, headerShown: true, headerStyle:{ height:66 },
            headerBackground:( () => <Image source={require('./images/app-header.png')} style={{width:'100%', height:'100%'}}></Image>) }}>
          <Wrap.Screen name="Welcome" initialParams={{profileChange: setMenuImage, userChange: setUserName}} component={WelcomeScreen} options={{headerShown: false}} />
          <Wrap.Screen name="EmailVerify" component={EmailVerify} options={{ headerShown: false }}/>
          <Wrap.Screen name="PhoneVerify" component={PhoneVerify} options={{ headerShown: false }}/>
          <Wrap.Screen name="AccountLocked" component={AccountLocked} options={{ headerShown: false }}/>
          <Wrap.Screen name="SetNotifications" component={SetNotifications} options={{ headerShown: false }}/>
          {/* <Wrap.Screen name="VideoApplication" component={VideoStackScreen} options={{title: ''}} />      */}
          <Wrap.Screen name="Application" component={ApplicationTabMenu} options={{title: ''}} />        
        </Wrap.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>     
  );
};

const styles = StyleSheet.create({
  container: {
      alignItems: 'center'
  },
  message: {
      fontFamily: 'SourceSansPro',
      fontSize: 18, 
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
  },
  image: {
      height: 100,
      width: 100,
      margin: 10,
      marginTop:30,
      borderRadius: 50,
  }
});

export default App;

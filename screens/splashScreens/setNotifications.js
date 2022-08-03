import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { setLoggedUser } from '../../helpers/globals';
import { navigateToScreen } from '../../helpers/navigation';
import { AWS_URL, REACT_APP_LOGIN_TOKEN } from '@env';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';

const SetNotifications = ({ navigation, route }) => { 
    const userInfo = route.params.params.userInfo;

    const [showLoading, setShowLoading] = React.useState(false);
    const [pushOption, setPushOption] = React.useState(true);
    const [feedOption, setFeedOption] = React.useState(true);
    const [eventOption, setEventOption] = React.useState(true);

    const saveSettings = () => {
        setShowLoading(true);

        fetch(AWS_URL + '/User/Notification?userId=' + userInfo.UserId + 
            '&push=' + pushOption + '&feed=' + feedOption + '&event=' + eventOption, { method: 'post' })
        .then(response => {
            return response.json();
        })
        .then(async result => {
            let user = JSON.parse(await AsyncStorage.getItem(REACT_APP_LOGIN_TOKEN));
            user.Notifications = result;

            await AsyncStorage.setItem(REACT_APP_LOGIN_TOKEN, JSON.stringify(user));
            setLoggedUser(user);
            setShowLoading(false);

            navigation.navigate('Home');
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
                        <View style={styles.screen}>
                            <Text style={styles.welcome}>Stay Updated</Text>
                            <Text style={styles.message}>Be the first to get up-to-date announcements about memorial news and events. You can modify your choices at any time in your app Settings.</Text>
                        </View>
                        <View style={styles.options}>
                            <View style={{flexDirection:'row', justifyContent: 'space-between', marginTop: 30}}>
                                <Text style={styles.option}>Receive push notifications</Text>
                                <Switch style={styles.switch} trackColor={{false: '#CCCCCC', true: 'white'}} thumbColor="#0083B0" onValueChange={setPushOption} value={pushOption} />
                            </View>
                            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                                <Text style={styles.option}>Receive feed notifications</Text>
                                <Switch style={styles.switch} trackColor={{false: '#CCCCCC', true: 'white'}} thumbColor="#0083B0" onValueChange={setFeedOption} value={feedOption} />
                            </View>
                            <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                                <Text style={styles.option}>Receive event notifications</Text>
                                <Switch style={[styles.switch, {marginBottom: 50}]} trackColor={{false: '#CCCCCC', true: 'white'}} thumbColor="#0083B0" onValueChange={setEventOption} value={eventOption} />
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.button, styles.buttonSignUp]} onPress={saveSettings}>
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    topView: {
        alignItems: "center",
        width: '100%',
        height: '100%',
    },
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginTop: 30,
        marginBottom: 20,
        color: 'white',
    },
    screen:{
        width:'80%', 
        marginTop:25, 
        alignItems:'center',
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '40%',
        alignItems: 'center',
        padding: 15,
        margin: 5,
        borderRadius:10,
        marginTop: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    buttonSignUp:{
        backgroundColor: '#00A1D8'
    },
    options:{
        backgroundColor: '#85C6DD',
        width:'90%',
        borderRadius:10,
        marginTop: 60,
    },
    option: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        fontWeight: 'bold',
        marginTop: 20,
        marginLeft: 20
    },
    switch:{
        marginTop: 20,
        marginRight: 20,
    }
  });
  
export default SetNotifications;
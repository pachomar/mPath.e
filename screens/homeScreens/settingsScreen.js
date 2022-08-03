import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import { getLoggedUser, setLoggedUser } from '../../helpers/globals';
import { REACT_APP_LOGIN_TOKEN, AWS_URL } from '@env';
import { showErrorMessage, showOkMessage } from '../../helpers/navigation'; 
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Switch } from 'react-native';

const UserSettingScreen = ({ navigation }) => {
    const [showLoading, setShowLoading] = React.useState(false);
    const [userName, setUserName] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [phone, setPhone] = React.useState(null);
    const [securityPin, setSecurityPin] = React.useState(null);
    const [pushOption, setPushOption] = React.useState(false);
    const [feedOption, setFeedOption] = React.useState(false);
    const [eventOption, setEventOption] = React.useState(false);
    const [showWarning, setShowWarning] = React.useState(false);
    const [profileImage, setProfileImage] = React.useState('');
    const userInfo = React.useRef({});

    React.useEffect(() => {
        loadUserInfo();
    }, []);

    React.useEffect(() => {
        setShowWarning(userInfo.current.UserEmail != email);
    }, [email]);

    const loadUserInfo = async () => {
        userInfo.current = JSON.parse(await AsyncStorage.getItem(REACT_APP_LOGIN_TOKEN));
        setUserName(userInfo.current.UserName);
        setEmail(userInfo.current.UserEmail);
        setPhone(userInfo.current.UserPhone);
        setSecurityPin(userInfo.current.Profile.SecurityPin);
        setFeedOption(userInfo.current.Notifications.FeedActive == 1);
        setEventOption(userInfo.current.Notifications.EventActive == 1);
        setPushOption(userInfo.current.Notifications.PushActive == 1);
        setProfileImage(userInfo.current.Profile.UserImage);
    }

    const saveSettingsChange = () => {
        const emailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
        const phoneRegex = new RegExp("^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$");

        if (!emailRegex.test(email)) {
            showErrorMessage("Invalid email format", "Please, provide a valid email format");
            return false;
        }

        if (phone != null && !phoneRegex.test(phone)) {
            showErrorMessage("Invalid phone format", "Please, provide a valid phone format");
            return false;
        }

        setShowLoading(true);

        userInfo.current.UserName = userName;
        userInfo.current.UserEmail = email;
        userInfo.current.UserPhone = phone;
        userInfo.current.Profile.SecurityPin = securityPin;
        userInfo.current.Notifications.PushActive = pushOption;
        userInfo.current.Notifications.FeedActive = feedOption;
        userInfo.current.Notifications.EventActive = eventOption;

        fetch(AWS_URL + '/User/Settings/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'settings': {
                    UserId: userInfo.current.UserId,
                    UserName: userName,
                    UserPhone: phone,
                    UserEmail: email,
                    Pin: securityPin,
                    Feed: feedOption,
                    Push: pushOption,
                    Event: eventOption,
                    ChangeEmail: showWarning
                }
            })
        })
        .then((response) => response.text())
        .then(async data => { 
            if(JSON.parse(data).error || data.message) {
                showErrorMessage("Save failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                setShowLoading(false);
                return false;
            }

            setShowLoading(false);

            if(showWarning)
            {
                await AsyncStorage.removeItem(REACT_APP_LOGIN_TOKEN);
                showOkMessage("User settings saved", "Please, sign in again to see the updated changes");
                navigation.navigate('Welcome');
            }
            else
            {
                await AsyncStorage.setItem(REACT_APP_LOGIN_TOKEN, JSON.stringify(userInfo.current));
                showOkMessage("User settings saved", "The changes in the user settings were correctly updated");
                setLoggedUser(userInfo.current);
            }

            
        })
        .catch(function(error) {
            console.log(error)
            setShowLoading(false);
            showErrorMessage("Save failed. Please try again","There was an error while trying to save the user settings")
        });
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.scene} contentContainerStyle={{alignItems: "center"}}>
                <Spinner visible={showLoading} textContent={"Saving settings..."} overlayColor={'#00448188'} color={'black'} />
                    <View style={{width:'80%'}} >
                        <View style={{width:'100%', alignItems:'center'}}>
                            { profileImage == null ?
                                <Image style={styles.image} height={160} width={160} source={require('../../images/no-profile.png')}></Image> : 
                                <Image style={styles.image} height={160} width={160} source={{uri: 'data:image/jpg;base64,' + profileImage}}></Image>
                            }
                            <Text style={styles.welcome}>ACCOUNT INFO</Text>
                        </View>
                        <Text style={styles.message}>Your UserName</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} value={userName} onChangeText={setUserName}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <Text style={styles.message}>Email</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} value={email} onChangeText={setEmail}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <Text style={styles.message}>Mobile Phone (XXX-XXX-XXXX)</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} value={phone} onChangeText={setPhone}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <Text style={[styles.message,{fontWeight:'bold', marginBottom:0}]}>Security Pin Number</Text>
                        <Text style={[styles.message,{marginTop:0}]}>Create a secret 4-digit pin number. This will be used to verify your account when you contact support. </Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} maxLength={4} keyboardType='number-pad' value={securityPin} onChangeText={setSecurityPin}/>
                        </View>
                        <View style={{width:'100%', alignItems:'center', marginTop:40}}>
                            <Text style={styles.welcome}>NOTIFICATIONS</Text>
                        </View>
                        <View style={{width:'100%', marginTop:20}}>
                            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                                <Text style={styles.option}>Receive push notifications</Text>
                                <Switch style={styles.switch} trackColor={{false: '#CCCCCC', true: 'white'}} thumbColor="#0083B0" onValueChange={setPushOption} value={pushOption} />
                            </View>
                            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                                <Text style={styles.option}>Receive feed notifications</Text>
                                <Switch style={styles.switch} trackColor={{false: '#CCCCCC', true: 'white'}} thumbColor="#0083B0" onValueChange={setFeedOption} value={feedOption} />
                            </View>
                            <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                                <Text style={styles.option}>Receive event notifications</Text>
                                <Switch style={[styles.switch, {marginBottom: 20}]} trackColor={{false: '#CCCCCC', true: 'white'}} thumbColor="#0083B0" onValueChange={setEventOption} value={eventOption} />
                            </View>
                        </View>
                        { showWarning ?
                            <Text style={[styles.message,{textAlign:'center', color:'gold', fontWeight:'bold'}]}>Warning: if you change your email, you will be signed out and asked to verify your new email</Text> : null
                        }
                        <View style={[styles.buttonArea,{marginBottom:20}]}>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity style={styles.button} onPress={saveSettingsChange}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 22, 
        marginBottom: 10,
        color: 'white',
    },
    title: {
        fontFamily: 'Montserrat',
        fontSize: 22, 
        marginTop: 40,
        marginBottom: 10,
        color: 'white',
    },
    scene: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor:'#004481',
    },
    buttonArea:{
        alignItems: "center",
        width: '100%',
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        fontFamily: 'Nunito',
        height: 50, 
        width: '60%',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        borderRadius:10,
        marginTop: 30,
        marginBottom: 30,
        backgroundColor: '#00A1D8'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius:10,
        height:40,
        marginBottom:10,
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius:10,
        fontSize:18,
        color: '#424242',
    },
    searchIcon: {
        padding: 7,
    },
    image: {
        height: 160,
        width: 160,
        margin: 30,
    },
    option: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        fontWeight: 'bold',
        marginTop: 10,
    },
    switch:{
        marginTop: 10,
        marginRight: 10,
    }
});

export default UserSettingScreen;
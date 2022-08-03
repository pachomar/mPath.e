import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { getLoggedUser, setLoggedUser } from '../../helpers/globals';
import { REACT_APP_LOGIN_TOKEN, AWS_URL } from '@env';
import { showErrorMessage, showOkMessage } from '../../helpers/navigation'; 
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, PermissionsAndroid } from 'react-native';

const UserProfileScreen = ({ navigation }) => {
    const [showLoading, setShowLoading] = React.useState(false);
    const [firstName, setFirstName] = React.useState(null);
    const [middleName, setMiddleName] = React.useState(null);
    const [lastName, setLastName] = React.useState(null);
    const [maidenName, setMaidenName] = React.useState(null);
    const [suffix, setSuffix] = React.useState(null);
    const [socialPicker, setSocialPicker] = React.useState(null);
    const [socialMedia, setSocialMedia] = React.useState(null);
    const [facebookURL, setFacebookURL] = React.useState(null);
    const [instagramURL, setInstagramURL] = React.useState(null);
    const [linkedinURL, setLinkedinURL] = React.useState(null);
    const [twitterURL, setTwitterinURL] = React.useState(null);
    const [profileImage, setProfileImage] = React.useState('');
    const userInfo = React.useRef({});

    React.useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        userInfo.current = JSON.parse(await AsyncStorage.getItem(REACT_APP_LOGIN_TOKEN));
        setFirstName(userInfo.current.Profile.FirstName);
        setMiddleName(userInfo.current.Profile.MiddleName);
        setLastName(userInfo.current.Profile.LastName);
        setMaidenName(userInfo.current.Profile.MaidenName);
        setSuffix(userInfo.current.Profile.Suffix);
        setFacebookURL(userInfo.current.Profile.Facebook);
        setInstagramURL(userInfo.current.Profile.Instagram);
        setLinkedinURL(userInfo.current.Profile.Linkedin);
        setTwitterinURL(userInfo.current.Profile.Twitter);
        setProfileImage(userInfo.current.Profile.UserImage);
    }

    const setSocialMediaInput = (value) => {
        setSocialPicker(value);

        switch(value) {
            case 1:
                setSocialMedia(facebookURL == null ? 'www.facebook.com/' : facebookURL);
                break;
            case 2:
                setSocialMedia(instagramURL == null ? 'www.instagram.com/' : instagramURL);
                break;
            case 3:
                setSocialMedia(linkedinURL == null ? 'www.linkedin.com/in/' : linkedinURL);
                break;
            case 4:
                setSocialMedia(twitterURL == null ? 'www.twitter.com/' : twitterURL);
                break;
            default:
                setSocialMedia(null);
        }
    }

    const socialMediaChange = (text) => {
        setSocialMedia(text);

        switch(socialPicker) {
            case 1:
                setFacebookURL(text);
                userInfo.current.Profile.Facebook = text;
                break;
            case 2:
                setInstagramURL(text);
                userInfo.current.Profile.Instagram = text;
                break;
            case 3:
                setLinkedinURL(text);
                userInfo.current.Profile.Linkedin = text;
                break;
            case 4:
                setTwitterinURL(text);
                userInfo.current.Profile.Twitter = text;
                break;
            default:
                setSocialMedia(null);
        }
    }

    const saveProfileChange = () => {
        setShowLoading(true);

        userInfo.current.Profile.FirstName = firstName;
        userInfo.current.Profile.MiddleName = middleName;
        userInfo.current.Profile.LastName = lastName;
        userInfo.current.Profile.MaidenName = maidenName;
        userInfo.current.Profile.Suffix = suffix;
        userInfo.current.Profile.Facebook = facebookURL;
        userInfo.current.Profile.Instagram = instagramURL;
        userInfo.current.Profile.Linkedin = linkedinURL;
        userInfo.current.Profile.Twitter = twitterURL;
        userInfo.current.Profile.UserImage = profileImage;

        fetch(AWS_URL + '/User/Profile/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'profile': userInfo.current.Profile
            })
        })
        .then((response) => response.text())
        .then(async data => { 
            if(JSON.parse(data).error || data.message) {
                showErrorMessage("Save failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                setShowLoading(false);
                return false;
            }

            await AsyncStorage.setItem(REACT_APP_LOGIN_TOKEN, JSON.stringify(userInfo.current));
            setLoggedUser(userInfo.current);
            setShowLoading(false);

            showOkMessage("User profile saved", "Please, sign in again to see the updated changes")
        })
        .catch(function(error) {
            console.log(error)
            setShowLoading(false);
            showErrorMessage("Save failed. Please try again","There was an error while trying to save the profile information")
        });
    }

    const chooseImageFile = async () => {
        let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            launchImageLibrary({ includeBase64: true, mediaType: 'photo', saveToPhotos: true}, (response) => {
                try {
                    
                    if(response.assets[0].fileSize > 500000)
                    {
                        showErrorMessage("Image size too large","Please, choose an image less than 500Kb");
                        return;
                    }

                    if(response.assets[0].base64) {
                        setProfileImage(response.assets[0].base64);
                        userInfo.current.UserImage = response.assets[0].base64;
                    }
                    else {
                        showErrorMessage("Image not selected","Please, choose an image to proceed");
                    }
                }
                catch (error) {
                    console.log(error)
                }  
            });
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.scene} contentContainerStyle={{alignItems: "center"}}>
                <Spinner visible={showLoading} textContent={"Saving profile..."} overlayColor={'#00448188'} color={'black'} />
                    <View style={{width:'80%'}} >
                        <View style={{width:'100%', alignItems:'center'}}>
                            <TouchableOpacity onPress={chooseImageFile}>
                                { profileImage == null ?
                                    <Image style={styles.image} height={160} width={160} source={require('../../images/no-profile.png')}></Image> : 
                                    <Image style={styles.image} height={160} width={160} source={{uri: 'data:image/jpg;base64,' + profileImage}}></Image>
                                }
                            </TouchableOpacity>
                            <Text style={styles.welcome}>ABOUT YOU</Text>
                        </View>
                        <Text style={styles.message}>First Name</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <Text style={styles.message}>Middle Name</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} value={middleName} onChangeText={setMiddleName}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <Text style={styles.message}>Maiden Name</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} value={maidenName} onChangeText={setMaidenName}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <Text style={styles.message}>Last Name</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} value={lastName} onChangeText={setLastName}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <Text style={styles.message}>Suffix</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} value={suffix} onChangeText={setSuffix}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <View style={{width:'100%', alignItems:'center', marginTop:30}}>
                            <Text style={styles.welcome}>CONNECT WITH OTHERS</Text>
                            <Text style={styles.message}>Enter your social networks below to display them on your user profile page</Text>
                            <View style={styles.pickerBoxContainer}>
                                <View style={styles.pickerBoxInner}>
                                    <Picker onValueChange={(val) => { setSocialMediaInput(val) }} mode="dropdown" style={styles.pickerStyle} selectedValue={socialPicker}>
                                        <Picker.Item label="Select" style={{fontSize:18}} value={null} key={null}/>
                                        <Picker.Item label="Facebook" style={{fontSize:18}} value={1} key={0}/>
                                        <Picker.Item label="Instagram" style={{fontSize:18}} value={2} key={1}/>
                                        <Picker.Item label="LinkedIn" style={{fontSize:18}} value={3} key={2}/>
                                        <Picker.Item label="Twitter" style={{fontSize:18}} value={4} key={3}/>
                                    </Picker>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.message}>Enter the URL</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} value={socialMedia} onChangeText={socialMediaChange}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <View style={[styles.buttonArea,{marginBottom:20, marginTop:20}]}>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity style={styles.button} onPress={saveProfileChange}>
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
    pickerBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    pickerBoxInner: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        height: 40,
    },
    pickerStyle: {
        width: '118%',
        transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
        left: -32,
        position: 'absolute',
    },
});

export default UserProfileScreen;
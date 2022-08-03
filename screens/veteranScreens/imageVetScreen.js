import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { navigateToScreen, showErrorMessage } from '../../helpers/navigation';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid } from 'react-native';
 
const ImageVetScreen = ({ navigation }) => { 

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
                        navigateToScreen(navigation, 'UploadPreviewVeteran', { imageSrc : response.assets[0].base64, imageWidth: response.assets[0].width, imageHeight: response.assets[0].height});
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

    const takeImageFile = async () => {
        let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            launchCamera({ includeBase64: true, mediaType: 'photo', saveToPhotos: true}, (response) => {
                try {
                    
                    if(response.assets[0].fileSize > 500000)
                    {
                        showErrorMessage("Image size too large","Please, choose an image less than 500Kb");
                        return;
                    }
                    
                    if(response.assets[0].base64) {
                        navigateToScreen(navigation, 'UploadPreviewVeteran', { imageSrc : response.assets[0].base64, imageWidth: response.assets[0].width, imageHeight: response.assets[0].height});
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
            <View style={styles.topView}>
                <View style={[styles.screen,{marginTop:50}]}>
                    <TouchableOpacity style={styles.button} onPress={takeImageFile}>
                        <FontAwesome5 name="camera" size={50} color="white"/>
                    </TouchableOpacity>
                    <Text style={styles.message}>Take A Photo</Text>
                    <TouchableOpacity style={[styles.button,{marginTop:60}]} onPress={chooseImageFile}>
                        <FontAwesome5 name="cloud-upload-alt" size={50} color="white"/>
                    </TouchableOpacity>
                    <Text style={styles.message}>Upload A Photo or Image</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    topView: {
        alignItems: "center",
        width: '100%',
        height: '100%',
        backgroundColor:'#004481',
    },
    screen:{
        width:'80%', 
        marginTop:10, 
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
        height: 120, 
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:10,
        marginTop: 40,
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'dashed',
    },
  });
  
export default ImageVetScreen;
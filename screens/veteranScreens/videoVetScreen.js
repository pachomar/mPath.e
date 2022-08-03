import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { navigateToScreen, showErrorMessage } from '../../helpers/navigation';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid } from 'react-native';
 
const VideoVetScreen = ({ navigation }) => { 

    const chooseImageFile = async () => {
        let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            launchImageLibrary({ mediaType: 'video', saveToPhotos: true}, (response) => {
                try {
                    //navigateToScreen(navigation, 'UploadPreviewVeteran', { imageSrc : response.assets[0].base64});
                }
                catch (error) {
                    console.log(error)
                }  
            });
        }
    }

    const takeVideoFile = async () => {
        let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.CAMERA)

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            launchCamera({ mediaType: 'video', saveToPhotos: true}, (response) => {
                try {
                    //navigateToScreen(navigation, 'UploadPreviewVeteran', { imageSrc : ''});
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
                    <TouchableOpacity style={styles.button} onPress={takeVideoFile}>
                        <FontAwesome5 name="video" size={50} color="white"/>
                    </TouchableOpacity>
                    <Text style={styles.message}>Take A Video</Text>
                    <TouchableOpacity style={[styles.button,{marginTop:60}]} onPress={chooseImageFile}>
                        <FontAwesome5 name="cloud-upload-alt" size={50} color="white"/>
                    </TouchableOpacity>
                    <Text style={styles.message}>Upload A Video</Text>
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
  
export default VideoVetScreen;
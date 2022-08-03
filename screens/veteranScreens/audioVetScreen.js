import React from 'react';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { navigateToScreen, showErrorMessage } from '../../helpers/navigation';
 
const AudioVetScreen = ({ navigation }) => { 
    const chooseDocumenFile = async () => {
        let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            try {
                const res = await DocumentPicker.pick({ type: [ DocumentPicker.types.pdf, DocumentPicker.types.plainText, DocumentPicker.types.doc, DocumentPicker.types.docx, DocumentPicker.types.ppt, DocumentPicker.types.pptx] })
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                    // User cancelled the picker, exit any dialogs or menus and move on
                } else {
                    throw err
                }
            }
        }
    }


    return (
        <SafeAreaView>
            <View style={styles.topView}>
                <View style={[styles.screen,{marginTop:50}]}>
                    <TouchableOpacity style={styles.button} >
                        <FontAwesome5 name="file-alt" size={50} color="white"/>
                    </TouchableOpacity>
                    <Text style={styles.message}>Add A Story</Text>
                    <TouchableOpacity style={[styles.button,{marginTop:60}]} onPress={chooseDocumenFile}>
                        <FontAwesome5 name="file-upload" size={50} color="white"/>
                    </TouchableOpacity>
                    <Text style={styles.message}>Upload A Document</Text>
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
  
export default AudioVetScreen;
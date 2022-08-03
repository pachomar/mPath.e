import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { navigateToScreen } from '../../helpers/navigation'; 
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
 
const MediaVetScreen = ({ navigation }) => {
    const [veteranId, setVeteranId] = React.useState(null);

    const GoToPrevious = () => {
        navigateToScreen(navigation, "TitleVeteran");
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.scene} contentContainerStyle={{alignItems: "center"}} >
                <Text style={styles.welcome}>Add Media</Text>
                <View style={{width:'80%', alignItems:"center"}}>
                    <Text style={[styles.message,{marginBottom:20}]}>Make your Veteran{'\''}s legacy come alive with stories, photos, video, audio and documents. You can edit your story at any time with more media.</Text>
                    <Text style={[styles.message,{fontWeight:'bold'}]}>What would you like to do?</Text>
                    <View style={styles.buttonArea}>
                        <TouchableOpacity style={[styles.button,{marginBottom:10, marginTop:30}]} onPress={() => { navigateToScreen(navigation, 'ImageUploadVeteran')}}>
                            <Text style={styles.buttonText}>Add A Photo</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonArea}>
                        <TouchableOpacity style={[styles.button,{marginBottom:10, marginTop:10}]} onPress={() => { navigateToScreen(navigation, 'VideoUploadVeteran')}}>
                            <Text style={styles.buttonText}>Add A Video</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonArea}>
                        <TouchableOpacity style={[styles.button,{marginBottom:30, marginTop:10}]} onPress={() => { navigateToScreen(navigation, 'AudioUploadVeteran')}}>
                            <Text style={styles.buttonText}>Add A Story</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'100%', alignItems:'center'}}>
                        <Text style={[styles.message,{color:'gold', fontWeight:'bold', textAlign:'center'}]}>
                            Everything uploaded will be visible on the internet.
                        </Text>
                        <Text style={[styles.message,{color:'gold', textAlign:'center', marginTop:0}]}>
                            Do not upload any documents with personal information such as the Veteran’s DD214, which contains the Veteran’s social security number, or other documents that may have similar information and should not be shared.
                        </Text>
                    </View>
                    <View style={[styles.buttonArea,{marginBottom:30}]}>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={[styles.button,{width:'15%'}]} onPress={GoToPrevious}>
                                <FontAwesome5 name="arrow-circle-left" size={28} color="white"/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button,{width:'40%'}]} onPress={() => { navigateToScreen(navigation, "VeteranProfile")}}>
                                <Text style={styles.buttonText}>View Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button,{width:'15%',backgroundColor:'#004481'}]}>
                                <FontAwesome5 name="arrow-circle-right" size={28} color="#004481"/>
                            </TouchableOpacity>
                        </View>
                        <Image source={require('../../images/tab-progress-4.png')} style={styles.progress}></Image>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginTop: 30,
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
        width: '50%',
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
    progress: {
        marginTop: 20,
    },
  });
  
export default MediaVetScreen;
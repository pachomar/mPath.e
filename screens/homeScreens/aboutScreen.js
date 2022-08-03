import React from 'react';
import YouTube from 'react-native-youtube';
import YoutubePlayer from "react-native-youtube-iframe";
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Linking } from 'react-native';

const AboutScreen = ({ navigation }) => { 
    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.topView}>
                        <View style={{width:'100%'}}>
                            <YoutubePlayer height={220} videoId={"zx4hR9W0g1Q"} />
                        </View>
                        {/* <YouTube apiKey="AIzaSyD4SVAfN5V1aKXghDOziLFfqab3_p8B1wE" videoId="zx4hR9W0g1Q" play={false} fullscreen={true} style={{ alignSelf: 'stretch', height:250 }} /> */}
                        <Text style={[styles.message,{fontWeight:'bold'}]}>The mission of the Cobb Veterans Memorial Foundation is to design, build and maintain a memorial to honor our United States Armed Forces and their families.</Text>
                        <Text style={[styles.message,{fontSize:18, textAlign:'left'}]}>The Cobb Veterans Memorial Foundation is committed to serving military veterans by building a memorial for all veterans and their families as a way to say “thank you” for their service and sacrifices, no matter where or how they served, starting right here in Cobb County, Georgia.</Text>
                        <TouchableOpacity style={styles.button} onPress={() => { Linking.openURL('https://cobbveteransmemorial.app.neoncrm.com/np/clients/cobbveteransmemorial/donation.jsp') }}>
                            <Text style={styles.buttonText}>Donate</Text>
                        </TouchableOpacity>
                        <View style={{flexDirection:'row'}}>
                            <FontAwesome5 name="globe" size={30} color="white" style={styles.icon} onPress={() => { Linking.openURL('https://cobbveteransmemorial.com')} }/>
                            <FontAwesome name="facebook-square" size={30} color="white" style={styles.icon} onPress={() => { Linking.openURL('https://urlgeni.us/facebook/CobbVetMemorial')} }/>
                            <FontAwesome name="twitter" size={30} color="white" style={styles.icon} onPress={() => { Linking.openURL('https://urlgeni.us/twitter/CobVetMemorial')} }/>
                            <FontAwesome name="instagram" size={30} color="white" style={styles.icon} onPress={() => { Linking.openURL('https://urlgeni.us/instagram/CobbVetMemorial')} }/>
                            <FontAwesome name="youtube-play" size={30} color="white" style={styles.icon} onPress={() => { Linking.openURL('https://urlgeni.us/youtube/channel/CobbVetMemorial')} }/>
                        </View>            
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
    message: {
        width:'80%',
        fontFamily: 'SourceSansPro',
        fontSize: 20, 
        color: 'white',
        textAlign: 'center',
        marginTop: 30,
    },
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '60%',
        alignItems: 'center',
        padding: 15,
        margin: 5,
        borderRadius:10,
        marginTop: 40,
        marginBottom: 40,
        backgroundColor: 'red'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    icon: {
        marginBottom:30,
        marginLeft:10,
        marginRight:10,
    }
  });
  
export default AboutScreen;
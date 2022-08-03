import React from 'react';
import YouTube from 'react-native-youtube';
import YoutubePlayer from "react-native-youtube-iframe";
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
 
const VirtualTourScreen = ({ navigation }) => { 
    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.topView}>
                        <View style={{width:'100%'}}>
                            <YoutubePlayer height={220} videoId={"ksscyP06iAY"} />
                        </View>
                        {/* <YouTube apiKey="AIzaSyD4SVAfN5V1aKXghDOziLFfqab3_p8B1wE" videoId="ksscyP06iAY" play={false} style={{ alignSelf: 'stretch', height:250 }} /> */}
                        <Text style={styles.welcome}>COBB VETERANS MEMORIAL</Text>
                        <Text style={styles.message}>Designed by CROFT and Associates; an award-winning, national architectural firm, this memorial will honor, educate, and inspire for many generations to come.</Text>
                        <Text style={styles.welcome}>A WORLD-CLASS TRIBUTE</Text>
                        <Text style={styles.message}>The Star Tower soars over 14 stories above the surrounding park. Its slight tilt reminds us of our imperfection as a nation and pursuit to reach our ideals.{'\n\n'}Alongside the reflecting pool, you will observe stone walls of service and tribute. Each wall tells many stories. These stories are told through the lens of Veterans and their families who lived the history.{'\n\n'}Every story will bring you an intimate account of past events.</Text>
                        <View style={{flexDirection:'row', marginTop:40}}>
                            <FontAwesome5 name="globe" size={30} color="white" style={styles.icon} />
                            <FontAwesome name="facebook-square" size={30} color="white" style={styles.icon} />
                            <FontAwesome name="twitter" size={30} color="white" style={styles.icon} />
                            <FontAwesome name="instagram" size={30} color="white" style={styles.icon} />
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
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
        marginTop: 30,
    },
    welcome: {
        width:'90%',
        fontFamily: 'Montserrat',
        fontSize: 20, 
        marginTop: 30,
        textAlign: 'center',
        color: 'white',
    },
    icon: {
        marginBottom:30,
        marginLeft:10,
        marginRight:10,
    }
  });
  
export default VirtualTourScreen;
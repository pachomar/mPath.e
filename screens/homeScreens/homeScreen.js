import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { isLoggedUser } from '../../helpers/globals';
import { navigateToScreen } from '../../helpers/navigation';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
 
const HomeScreen = ({ navigation }) => { 
    const [showSignIn, setShowSignIn] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => { setShowSignIn(!isLoggedUser()) });
        return unsubscribe;
    }, [navigation]);

    return (
        <LinearGradient colors={["#00A1D8", "#004481"]}>
            <SafeAreaView>
                <View>
                    <View style={styles.topView}>
                        <View style={[styles.buttonRow, {marginTop: 30}]}>
                            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen(navigation,"Explore")}>
                                <View style={styles.buttonContent}>
                                    <FontAwesome5 name="compass" size={50} color="#CCECF7" style={{marginTop:20}}></FontAwesome5>
                                    <Text style={styles.buttonText}>EXPLORE</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen(navigation,"VirtualTour")}>
                                <View style={styles.buttonContent}>
                                    <FontAwesome5 name="map-marked-alt" size={50} color="#CCECF7" style={{marginTop:20}}></FontAwesome5>
                                    <Text style={styles.buttonText}>VIRTUAL TOUR</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen(navigation,"Supporters")}>
                                <View style={styles.buttonContent}>
                                    <FontAwesome5 name="hands-helping" size={50} color="#CCECF7" style={{marginTop:20}}></FontAwesome5>
                                    <Text style={styles.buttonText}>SUPORTERS</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen(navigation,"Map")}>
                                <View style={styles.buttonContent}>
                                    <FontAwesome5 name="map-marker-alt" size={50} color="#CCECF7" style={{marginTop:20}}></FontAwesome5>
                                    <Text style={styles.buttonText}>MAP</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen(navigation,"SearchVeteran")}>
                                <View style={styles.buttonContent}>
                                    <FontAwesome name="users" size={50} color="#CCECF7" style={{marginTop:20}}></FontAwesome>
                                    <Text style={styles.buttonText}>BUILD</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen(navigation, "About")}>
                                <View style={styles.buttonContent}>
                                    <FontAwesome5 name="info-circle" size={50} color="#CCECF7" style={{marginTop:20}}></FontAwesome5>
                                    <Text style={styles.buttonText}>ABOUT CVMF</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button}>
                                <View style={styles.buttonContent}>
                                    <FontAwesome5 name="calendar-alt" size={40} color="#00A1D8" style={{marginTop:15}}></FontAwesome5>
                                    <Text style={[styles.buttonText, {color:"#00A1D8"}]}>PLAN TRIP</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Speech")}>
                                <View style={styles.buttonContent}>
                                    <FontAwesome5 name="child" size={40} color="#00A1D8" style={{marginTop:15}}></FontAwesome5>
                                    <Text style={[styles.buttonText, {color:"#00A1D8"}]}>CHALLENGES</Text>
                                </View>
                            </TouchableOpacity>
                        </View> */}
                        <View style={{width: '80%'}}>
                        { showSignIn ?
                            <Text style={styles.messagebottom}>Already have an account? <Text style={{ color: 'gold'}} onPress={()=> navigateToScreen(navigation, 'SignIn') }>Sign In</Text></Text> : 
                            <Text style={styles.messagebottom}>{' '}</Text>
                        }
                        </View> 
                    </View>
                </View>
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
    messagebottom: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
        marginTop: 90,
        marginBottom: 120
    },
    button:{
        backgroundColor:'#003667', 
        height:120, 
        width:'47%',
        marginBottom: 50,
        borderRadius:10,
    },
    buttonRow:{
        height:140, 
        width:'80%', 
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    buttonContent:{
        alignItems:'center', 
        justifyContent:'center',
    },
    buttonText:{
        color:"#CCECF7", 
        fontSize:16, 
        marginTop:10,
    }
  });
  
export default HomeScreen;
import 'react-native-vector-icons';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { navigateToScreen } from '../../helpers/navigation';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
 
const AnonymousScreen = ({ navigation }) => {
    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                        <View style={styles.topView}>
                            <Text style={styles.welcome}>Don't have an account?</Text>
                            <View style={{width: '80%'}}>
                                <Text style={styles.message}>Register for your free account to help  preserve history and build legacies for all of the, sometimes forgotten, men and women who served our great nation.
                                    {'\n\n'}Add media such as photos, documents and more to make your Veteran’s legacy come to life and be remembered as so much more than just a name on a wall. 
                                    {'\n\n'}Build a Veteran’s legacy now.</Text>
                            </View>
                            <TouchableOpacity style={[styles.button, styles.buttonAgree]} onPress={()=> navigateToScreen(navigation, 'SignUp') }>
                                <Text style={styles.buttonText}>Yes! sign me up.</Text>
                            </TouchableOpacity>
                            <Text style={styles.message} onPress={()=> navigateToScreen(navigation, 'Home') }>No thanks</Text>
                            <View style={{width: '80%'}}>
                                <Text style={styles.messagebottom}>Already have an account? <Text style={{ color: 'gold'}} onPress={()=> navigateToScreen(navigation, 'SignIn') }>Sign In</Text></Text>
                            </View>
                        </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginTop: 30,
        marginBottom: 10,
        color: 'white',
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'SourceSansPro',
        fontSize: 24, 
        color: '#0081AD',
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 10,
    },
    topView: {
        alignItems: "center",
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
    },
    messagebottom: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
        marginTop: 30,
    },
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '50%',
        alignItems: 'center',
        padding: 15,
        margin: 5,
        borderRadius:10,
        marginTop: 50,
      },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
      },
    buttonAgree:{
        backgroundColor: '#EDAD09'
    },
  });
  
export default AnonymousScreen;
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { isLoggedUser } from '../../helpers/globals';
import { navigateToScreen } from '../../helpers/navigation';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Linking } from 'react-native';

const SupporterScreen = ({ navigation }) => { 
    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.topView}>
                        <Image source={require('../../images/supporters.png')} style={{width:'100%',height:250}}></Image>
                        <TouchableOpacity style={styles.button} onPress={() => { Linking.openURL('https://www.infor.com')}}>
                            <Image source={require('../../images/logo-infor.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { Linking.openURL('http://www.croftae.com')}}>
                            <Image source={require('../../images/logo-croft.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { Linking.openURL('https://www.cobbcounty.org')}}>
                            <Image source={require('../../images/logo-boc.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { Linking.openURL('https://www.maas911.com')}}>
                            <Image source={require('../../images/logo-metro-atlanta.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { Linking.openURL('https://www.softensity.com')}}>
                            <Image source={require('../../images/logo-softensity.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { Linking.openURL('https://rugbyatl.rugby')}}>
                            <Image source={require('../../images/logo-rugby.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button,{marginBottom:40}]} onPress={() => { Linking.openURL('https://www.cobbemc.com')}}>
                            <Image source={require('../../images/logo-cobb-emc.png')} />
                        </TouchableOpacity>
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
    button: {
        backgroundColor:'white', 
        height:120, 
        width:'80%',
        borderRadius: 10,
        marginTop: 15,
        alignItems:'center', 
        justifyContent:'center',
    },
  });
  
export default SupporterScreen;
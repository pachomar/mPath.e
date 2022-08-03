import React from 'react';
import { SafeAreaView, View, StyleSheet, Text, Image } from 'react-native';

const ConfirmVetScreen = ({ navigation }) => {
    return (
        <SafeAreaView>
            <View style={styles.scene} >
                <Image style={{marginTop:70, marginBottom:50, height:120, width:120}} width={120} height={120} source={require('../../images/envelope.png')}></Image>
                <Text style={styles.message}>
                    Thank you for helping build a legacy for U.S. Armed Forces veterans.{'\n\n'}
                    Your veteran’s profile has been sent for approval. You may be contacted if there are any questions regarding your profile.{'\n\n'}
                    Our goal is to ensure that every profile is historically accurate so that it can be used not only to preserve the legacy of this veteran, but also to educate and inspire generations to come.{'\n\n'}
                    You will be notified by email after the curator has completed the review.
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scene: {
        width: '100%',
        height:'100%',
        backgroundColor:'#004481',
        alignItems: "center",
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        marginTop: 10,
        marginBottom: 120,
        width:'80%',
        textAlign: 'center',
    }
  });
  
export default ConfirmVetScreen;
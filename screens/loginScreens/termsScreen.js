import React from 'react';
import { navigateToScreen } from '../../helpers/navigation';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
 
const TermsScreen = ({ navigation }) => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Terms of Service' },
        { key: 'second', title: 'Privacy Policy' },
    ]);

    const userAgreed = () => {
        navigateToScreen(navigation, 'SignUp', { lastScreen: 'TermsPolicy'});
    }

    const TermsTab = () => (
        <View style={styles.scene}>
            <Text style={styles.welcome}>Terms of Service</Text>
            <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt. Nunc ultrices arcu eu erat. Donec dictum nisi sed urna.
            </Text>
            <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt. Nunc ultrices arcu eu erat. Donec dictum nisi sed urna.
            </Text>
            <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt. Nunc ultrices arcu eu erat. Donec dictum nisi sed urna.
            </Text>
        </View>
    );
      
    const PolicyTab = () => (
        <View style={styles.scene}>
            <Text style={styles.welcome}>Privacy Policy</Text>
            <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt. Nunc ultrices arcu eu erat. Donec dictum nisi sed urna.
            </Text>
            <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt. Nunc ultrices arcu eu erat. Donec dictum nisi sed urna.
            </Text>
            <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt. Nunc ultrices arcu eu erat. Donec dictum nisi sed urna.
            </Text>
        </View>
    );
    
    const renderScene = SceneMap({
        first: TermsTab,
        second: PolicyTab,
    });
    
    return (
        <View style={ styles.screen }>
            <TabView style={{ height: '80%' }} navigationState={{ index, routes }} renderScene={renderScene} inactiveColor='black' onIndexChange={setIndex} renderTabBar={props => 
                <TabBar {...props} indicatorStyle={{ backgroundColor: 'black'}} renderLabel={({route, color}) => (
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>
                            {route.title}
                        </Text> 
                    )} style={{backgroundColor: 'transparent'}}>
                </TabBar>}>
            </TabView>
            <View style={ styles.buttonArea }>
                <TouchableOpacity style={[styles.button, styles.buttonAgree]} onPress={userAgreed}>
                    <Text style={styles.buttonText}>I Agree</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    welcome: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 28, 
        marginTop: 10,
        marginBottom: 10,
        color: 'black',
    },
    scene: {
        flex: 1,
        alignItems: "center",
        width: '100%',
        height: '100%',
    },
    screen: {
        flex: 1,
        height: '100%',
    },
    buttonArea:{
        alignItems: "center",
        width: '100%',
        height: '25%',
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'black',
        textAlign: 'justify',
        marginTop: 15,
        width: '80%',
    },
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '50%',
        alignItems: 'center',
        padding: 15,
        margin: 5,
        borderRadius:10,
        marginTop: 60,
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
  
export default TermsScreen;
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isLoggedUser } from '../../helpers/globals';
import { navigateToScreen } from '../../helpers/navigation';
import { REACT_APP_CURRENT_VETERANID } from '@env';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
 
const SearchResultScreen = ({ navigation }) => { 
    const [searchString, setSearchString] = React.useState(null);
    const [listItems, setListItems] = React.useState([]);
    const showResults = React.useRef([]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            let route = navigation.getState().routes.filter(p => p.params != null && p.params.searchResults != null);
            showResults.current = JSON.parse(route[route.length - 1].params.searchResults);

            setSearchString(route[route.length - 1].params.inputSearch);
            createListView();
        })
        return unsubscribe;
    }, [navigation]);

    const setVeteranIdAndGo = async (veteranId) => {
        await AsyncStorage.setItem(REACT_APP_CURRENT_VETERANID, veteranId);
        navigateToScreen(navigation, 'VeteranProfile');
    }

    const setEmptyVeteran = async () => {
        await AsyncStorage.removeItem(REACT_APP_CURRENT_VETERANID);
    }
    
    const createListView = () => {
        let items = [];
        showResults.current.forEach((item, idx) => {
            items.push(<TouchableOpacity key={'button-view-' + idx} style={styles.profileRow} onPress={() => { setVeteranIdAndGo(item.Id) }}>
                        { item.Picture != null ?
                            <Image style={styles.profileImage} height={80} width={80} source={{uri: 'data:image/jpg;base64,' + item.Picture}} /> :
                            <Image style={styles.profileImage} height={80} width={80} source={require('../../images/no-profile.png')} />
                        }
                        <View key={'list-view-' + idx} style={{width:'70%'}}>
                            <Text key={'name-field-' + idx} style={[styles.profileText,{fontWeight:'bold'}]}>{item.Name}</Text>
                            <Text key={'branch-field-' + idx} style={styles.profileText}>{item.Branch}</Text>
                            <Text key={'rank-field-' + idx} style={styles.profileText}>{item.Rank}</Text>
                        </View>
                    </TouchableOpacity>);
        });
        setListItems(items);
    }

    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.topView}>
                        <View style={styles.screen}>
                            <Text style={styles.welcome}>Search results for:</Text>
                            <Text style={[styles.message,{textAlign: 'left'}]}>{searchString}</Text>
                        </View>
                        {
                            showResults.current.length > 0 ?  
                            <View style={[styles.topView,{marginTop:20, marginBottom:60}]}>
                                {
                                    listItems.map(buttonView => { return buttonView })
                                }
                            </View> 
                            : searchString == null ? null : 
                            <View style={{width:'80%'}}>
                                <View style={{alignItems:'flex-start'}}>
                                    <Text style={styles.resultText}>No results found</Text>
                                </View>
                                <View style={{width:'100%', marginTop:70, alignItems:'center'}}>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigateToScreen(navigation, 'Explore') }}>
                                        <Text style={styles.buttonText}>Search Again</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.button,{backgroundColor:'#00A1D8', marginTop:20}]} onPress={() => { setEmptyVeteran();
                                            isLoggedUser() ? navigateToScreen(navigation, 'CreateVeteran') : navigateToScreen(navigation, 'Anonymous')}}>
                                        <Text style={styles.buttonText}>Add Profile</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
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
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginTop: 20,
        marginBottom: 10,
        color: 'white',
    },
    screen:{
        width:'80%', 
        marginTop:10, 
        alignItems:'flex-start',
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius:10,
        height:'10%',
    },
    resultText:{
        fontFamily: 'SourceSansPro',
        fontWeight: 'bold',
        fontSize: 20, 
        color: 'white',
        textAlign: 'center',
        marginTop: 30,
    },
    profileImage: {
        margin: 30,
        height: 80,
        width: 80,
    },
    profileText: {
        fontFamily: 'SourceSansPro',
        fontSize: 16, 
    },
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '50%',
        alignItems: 'center',
        padding: 15,
        margin: 5,
        borderRadius:10,
        backgroundColor: 'red'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    profileRow: {
        backgroundColor:'white', 
        height:120, 
        width:'100%',
        alignItems:'center', 
        justifyContent:'center',
        flexDirection:'row',
        marginTop:1,
    },
  });
  
export default SearchResultScreen;
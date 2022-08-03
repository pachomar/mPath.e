import 'react-native-vector-icons';
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import { isLoggedUser } from '../../helpers/globals';
import { REACT_APP_CURRENT_VETERANID, AWS_URL } from '@env';
import { navigateToScreen, showErrorMessage } from '../../helpers/navigation';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image, LogBox } from 'react-native';
 
const SearchVetScreen = ({ navigation }) => { 
    const [showLoading, setShowLoading] = React.useState(false);
    const [showGetting, setShowGetting] = React.useState(false);
    const [searchResults, setResults] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    
    React.useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);

    React.useEffect(() => {
        if(searchValue.length == 3) {
            setShowLoading(true);

            fetch(AWS_URL + '/Veteran/Search?searchValue='+ searchValue + '&branch=0&unit=false&buried=0&mos=&conflict=false&award=false&state=')
            .then((response) => response.text())
            .then(async data => { 
                if(JSON.parse(data).error || data.message) {
                    showErrorMessage("Search failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                    setShowLoading(false);
                    return false;
                }

                setResults(JSON.parse(data));
                setShowLoading(false);
            })
            .catch(function(error) {
                console.log(error)
                showErrorMessage("Search failed. Please try again","There was an error while trying to search the veteran information");
                setShowLoading(false);
            });
        }
        else if(searchValue.length < 3)
        {
            if(searchResults.length > 0) {
                let arr = [];
                setResults([...arr]);
            }
        }
        else if(searchValue.length > 3)
        {
            let filtered = searchResults.filter(item => item.Name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
            setResults([...filtered]);
        }
    }, [searchValue])

    const setEmptyVeteran = async () => {
        await AsyncStorage.removeItem(REACT_APP_CURRENT_VETERANID);
    }

    const renderResults = (item) => {
        return (
            <TouchableOpacity key={item.Id} style={styles.profileRow} onPress={() => { setVeteranIdAndGo(item.Id) }}>
                { item.Picture != null ?
                    <Image style={styles.profileImage} height={80} width={80} source={{uri: 'data:image/jpg;base64,' + item.Picture}} /> :
                    <Image style={styles.profileImage} height={80} width={80} source={require('../../images/no-profile.png')} />
                }
                <View style={{width:'70%'}}>
                    <Text style={[styles.profileText,{fontWeight:'bold'}]}>{item.Name}</Text>
                    <Text style={styles.profileText}>{item.Branch}</Text>
                    <Text style={styles.profileText}>{item.Rank}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    const setVeteranIdAndGo = (veteranId) => {
        if(!isLoggedUser()) {
            navigateToScreen(navigation, 'Anonymous');
            return;
        }

        setShowGetting(true);
        AsyncStorage.setItem(REACT_APP_CURRENT_VETERANID, veteranId);

        fetch(AWS_URL + '/Veteran/Profile?veteranId=' + veteranId + '&images=false')
        .then((response) => response.text())
        .then(data => { 
            if(JSON.parse(data).error || data.message) {
                showErrorMessage("Profile load failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                setShowGetting(false);
                return false;
            }

            setShowGetting(false);
            navigateToScreen(navigation, "CreateVeteran", {currentVeteran: JSON.parse(data) });
        })
        .catch(function(error) {
            console.log(error)
            showErrorMessage("Profile load failed. Please try again","There was an error while trying to load the veteran information");
            setShowGetting(false);
        });
    }

    return (
        <SafeAreaView>
            <ScrollView>
            <View style={styles.topView}>
                <View style={styles.screen}>
                    <Spinner visible={showLoading} textContent={"Searching..."} overlayColor={'#00448188'} color={'black'} />
                    <Spinner visible={showGetting} textContent={"Getting profile..."} overlayColor={'#00448188'} color={'black'} />
                    <View style={{width:'80%'}}>
                        <Text style={[styles.message, {fontWeight:'bold'}]}>Let’s figure out where we should get started.</Text>
                        <Text style={[styles.message, {marginTop:20}]}>If you’re telling us a story about a Veteran you know, let’s see if we can find him/her.</Text>
                        <View style={styles.searchSection}>
                            <TextInput style={styles.input} placeholder="Search..." value={searchValue} onChangeText={setSearchValue}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                    </View>
                    <FlatList style={{flex:1, width:'80%'}} data={searchResults} renderItem={({item}) => renderResults(item)} keyExtractor={item => item.Id} 
                        ItemSeparatorComponent={() => { return ( <View style={{height: 1, width: '100%', backgroundColor: '#004481' }} /> ) }} >
                    </FlatList> 
                    {
                        searchResults.length == 0 ?
                        <View style={{width:'80%', alignItems:'center'}}>
                            <Text style={[styles.message,{fontWeight:'bold', marginTop:100}]}>No results found or not who you are looking for?</Text>
                            <Text style={[styles.message,{marginTop:20}]}>Let’s start building your Veteran’s legacy.</Text>
                            <TouchableOpacity style={[styles.button]} onPress={() => { setEmptyVeteran();
                                isLoggedUser() ? navigateToScreen(navigation, 'CreateVeteran') : navigateToScreen(navigation, 'Anonymous')}}>
                                <Text style={styles.buttonText}>Get Started</Text>
                            </TouchableOpacity>
                            <View style={{height:90}}></View>
                        </View> : 
                        <View style={{height:380}}></View>
                    }
                </View>
            </View>
            </ScrollView>
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
        width:'90%', 
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
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius:10,
        height:'10%',
        marginTop: 30,
    },
    input: {
        flex: 1,
        padding:10,
        borderRadius:10,
        fontSize:18,
        color: '#424242',
    },
    searchIcon: {
        padding: 10,
    },
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '60%',
        alignItems: 'center',
        padding: 15,
        borderRadius:10,
        marginTop: 60,
        marginBottom: 90,
        backgroundColor: '#00A1D8'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    profileRow: {
        backgroundColor:'white', 
        height:100, 
        width:'100%',
        alignItems:'center', 
        justifyContent:'center',
        flexDirection:'row',
        borderRadius:10,
        marginTop:1,
    },
    profileImage: {
        marginLeft: 20,
        marginRight: 10,
        height: 80,
        width: 80,
    },
    profileText: {
        fontFamily: 'SourceSansPro',
        fontSize: 16, 
    },
  });
  
export default SearchVetScreen;
import 'react-native-vector-icons';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AWS_URL } from '@env';
import { CheckBox, Icon } from 'react-native-elements';
import { navigateToScreen, showErrorMessage } from '../../helpers/navigation';
import { Collapse, CollapseHeader, CollapseBody} from 'accordion-collapse-react-native';
import { ServiceBranch, State, RankByBranch, MOSCodes, BurialPlace } from '../../helpers/enums'; 
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, LogBox, FlatList } from 'react-native';

const ExploreScreen = ({ navigation }) => { 
    const [showLoading, setShowLoading] = React.useState(false);
    const [input, setInput] = React.useState('');

    const branchData = React.useRef([]);
    const [filteredBranches, setFilteredBranches] = React.useState([]);
    const [branchFilter, setBranchFilter] = React.useState('');
    const [selectedBranch, setSelectedBranch] = React.useState(0);

    const mosData = React.useRef([]);
    const selectedMOS = React.useRef([]);
    const [filteredMOS, setFilteredMOS] = React.useState([]);
    const [mosFilter, setMOSFilter] = React.useState('');
    const [mosTags, setMOSTags] = React.useState([]);

    const burialData = React.useRef([]);
    const [filteredBurials, setFilteredBurials] = React.useState([]);
    const [burialFilter, setBurialFilter] = React.useState('');
    const [selectedBurial, setSelectedBurial] = React.useState(0);

    const stateData = React.useRef([]);
    const [filteredStates, setFilteredStates] = React.useState([]);
    const [stateFilter, setStateFilter] = React.useState('');
    const [selectedState, setSelectedState] = React.useState('');

    const [unitFilter, setUnit] = React.useState(false);
    const [conflictFilter, setConflict] = React.useState(false);
    const [awardFilter, setAward] = React.useState(false);

    React.useEffect(() => {

        if(branchData.current.length == 0) {
            Object.keys(ServiceBranch).map((key, index) => { 
                branchData.current.push({ id: key, name: ServiceBranch[key]});
            });
            setFilteredBranches([...branchData.current]);
        }

        if(burialData.current.length == 0) {
            Object.keys(BurialPlace).map((key, index) => { 
                burialData.current.push({ id: key, name: BurialPlace[key]});
            });
            setFilteredBurials([...burialData.current]);
        }

        if(stateData.current.length == 0) {
            Object.keys(State).map((key, index) => { 
                stateData.current.push({ id: key, name: State[key]});
            });
            setFilteredStates([...stateData.current]);
        }

        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);

    const searchVeteranFilters = () => {
        setShowLoading(true);
        
        let mosIds = ''; let selectedCodes = '';
        if(selectedMOS.current.length > 0) {
            selectedMOS.current.forEach((item, idx) => {
                mosIds += item.id + (idx == selectedMOS.current.length -1 ? '' : ',');
                selectedCodes += item.name.substring(0, item.name.indexOf(' -')-1) + (idx == selectedMOS.current.length -1 ? '' : ', ');
            })
        }

        fetch(AWS_URL + '/Veteran/Search?searchValue='+ input + '&branch=' + selectedBranch + '&unit=' + unitFilter +
            '&buried=' + selectedBurial + "&mos=" + mosIds + "&conflict=" + conflictFilter + "&award=" + awardFilter + '&state=' + selectedState)
        .then((response) => response.text())
        .then(async data => { 
            if(JSON.parse(data).error || data.message) {
                showErrorMessage("Search failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                setShowLoading(false);
                return false;
            }

            let searchString = 'Name: ' + (input.length > 0 ? '\"' + input + '\"' : 'Any') + (selectedBranch > 0 ? ' / Branch: ' + branchFilter : '') + (mosIds.length > 0 ? ' / MOS Codes: ' + selectedCodes : '') + (selectedBurial > 0 ? ' / Interment: ' + BurialPlace[selectedBurial] : '') + (selectedState.length > 0 ? ' / Home State: ' + State[selectedState] : '');;
            setShowLoading(false);
            navigateToScreen(navigation, 'SearchResult', { searchResults: data, inputSearch: searchString } );
        })
        .catch(function(error) {
            console.log(error)
            showErrorMessage("Search failed. Please try again","There was an error while trying to search the veteran information");
            setShowLoading(false);
        });
    }

    const renderBranch = (key) => {
        return ( <TouchableOpacity key={'branch-'+ key.id} style={styles.category} onPress={() => { setBranchFilter(key.name); setSelectedBranch(key.id) }}><Text key={'branchN-'+ key.id} style={styles.listItem}>{key.name}</Text></TouchableOpacity>)
    }

    const renderBurial = (key) => {
        return ( <TouchableOpacity key={'burial-'+ key.id} style={styles.category} onPress={() => { setBurialFilter(key.name); setSelectedBurial(key.id) }}><Text key={'burialN-'+ key.id} style={styles.listItem}>{key.name}</Text></TouchableOpacity>)
    }

    const renderState = (key) => {
        return ( <TouchableOpacity key={'state-'+ key.id} style={styles.category} onPress={() => { setStateFilter(key.name); setSelectedState(key.id) }}><Text key={'stateN-'+ key.id} style={styles.listItem}>{key.name}</Text></TouchableOpacity>)
    }

    const renderMOS = (key) => {
        return (<TouchableOpacity key={'mos-'+ key.id} style={styles.category} onPress={() => { addMOSTag(key) }}><Text key={'mosT-'+ key.id} style={styles.listItem}>{key.name}</Text></TouchableOpacity>)
    }

    React.useEffect(() => {
        let data = branchData.current.filter(x => x.name.toLowerCase().indexOf(branchFilter.toLowerCase()) > -1 && x.name != branchFilter);
        let existing = branchData.current.filter(x => x.name == branchFilter);

        if(existing.length > 0) setSelectedBranch(existing[0].id);
        else if (data.length > 0) setSelectedBranch(0);

        setFilteredBranches([...data]);
    }, [branchFilter]);

    React.useEffect(() => {
        let data = burialData.current.filter(x => x.name.toLowerCase().indexOf(burialFilter.toLowerCase()) > -1 && x.name != branchFilter);
        let existing = burialData.current.filter(x => x.name == burialFilter);

        if(existing.length > 0) 
        {
            setSelectedBurial(existing[0].id);
            setFilteredBurials([]);
        }
        else if (data.length > 0) {
            setSelectedBurial(0);
            setFilteredBurials([...data.slice(0,10)]);
        }

    }, [burialFilter]);

    
    React.useEffect(() => {
        let data = stateData.current.filter(x => x.name.toLowerCase().indexOf(stateFilter.toLowerCase()) > -1 && x.name != stateFilter);
        let existing = stateData.current.filter(x => x.name == stateFilter);

        if(existing.length > 0) 
        {
            setSelectedState(existing[0].id);
            setFilteredStates([]);
        }
        else if (data.length > 0) {
            setSelectedState(0);
            setFilteredStates([...data.slice(0,10)]);
        }

    }, [stateFilter]);

    const fillMOSList = (text) => {
        mosData.current = new Array();
        setFilteredMOS([...mosData.current]);
        let counter = 0;
        for(let key = 1; key <= Object.keys(MOSCodes).length; key++) {
            if((text.length > 0 && MOSCodes[key] != null && text != null && MOSCodes[key].toLowerCase().indexOf(text.toLowerCase()) > -1) || text.length == 0 || text == null) {
                mosData.current.push({ id: key, name: MOSCodes[key]});
                counter++; 
            }
            if(counter >= 10) break;
        }
        setFilteredMOS([...mosData.current].slice(0,10));
    }

    const clearMOSList = () => {
        setFilteredMOS([]);
    }

    const addMOSTag = (item) => {
        let idx = selectedMOS.current.find(x => x.id == item.id);

        if(idx == null) {
            selectedMOS.current.push(item);
            setMOSFilter('');
            clearMOSList();
            drawMOSTags();
        }
    }

    const removeMOSTag = (id) => {
        selectedMOS.current = selectedMOS.current.filter(x => x.id != id);
        drawMOSTags();
    }

    const updateMOSList = (text) => {
        setMOSFilter(text);
        fillMOSList(text);
    }

    const drawMOSTags = () => {
        setMOSTags([]);
        let tempArr = new Array();
        selectedMOS.current.forEach((item, idx) => {
            tempArr.push(            
                <View style={styles.tagSection} key={'tag-item-m-' + item.id.toString()}>
                    <Text style={styles.tagText} key={'tag-text-m-' + item.id.toString()}>{item.name}</Text>
                    <TouchableOpacity key={'tag-button-m-' + item.id.toString()} onPress={() => {removeMOSTag(item.id)}}>
                        <FontAwesome name="remove" key={'tag-icon-m-' + item.id.toString()} size={15} color="white" style={styles.tagIcon} />
                    </TouchableOpacity>
                </View>);
        });
        setMOSTags(tempArr);
    }
    
    return (
        <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1}} >
            <SafeAreaView>
                <ScrollView>
                    <Spinner visible={showLoading} textContent={"Searching..."} overlayColor={'#00448188'} color={'black'} />
                    <View style={styles.topView}>
                        <View style={styles.screen}>
                            <Text style={[styles.topMessage,{fontWeight:'bold'}]}>Find Veterans, explore history, and discover what it means to serve.</Text>
                            <Image style={styles.image} source={require('../../images/elipse.png')}></Image>
                            <View style={styles.searchSection}>
                                <TextInput style={styles.input} placeholder="Search..." onChangeText={setInput} />
                                {/* <Icon name="mic" size={30} color="#004481" style={styles.searchIcon} /> */}
                            </View>
                            <TouchableOpacity style={styles.button} onPress={searchVeteranFilters}>
                                <Text style={styles.buttonText}>Search</Text>
                            </TouchableOpacity>
                            <Text style={styles.welcome}>SEARCH FILTERS</Text>
                        </View>
                        <View style={{width:'100%', backgroundColor:'#00A1D8'}}>
                            <Collapse style={{width:'100%'}}>
                                <CollapseHeader style={styles.accordionHeader}>
                                    <Text style={[styles.message,{fontWeight:'bold',color:'white'}]}>Branch of Service</Text>
                                </CollapseHeader>
                                <CollapseBody style={{alignItems:'center'}}>
                                    <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1, alignItems:'center', width: '100%'}} >
                                        <FlatList style={{flex:1, width:'80%', marginTop:20}} data={filteredBranches} renderItem={({item}) => renderBranch(item)} 
                                            ItemSeparatorComponent={() => { return ( <View style={{width: '100%' }} /> ) }} >
                                        </FlatList> 
                                        <View style={{width:'80%', marginBottom: 20}}>
                                            <View style={styles.searchSection}>
                                                <TextInput style={styles.input} placeholder="Search..." value={branchFilter} onChangeText={setBranchFilter}/>
                                                {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </CollapseBody>
                            </Collapse>
                            <Collapse style={{width:'100%',marginTop:1}}>
                                <CollapseHeader style={styles.accordionHeader}>
                                    <Text style={[styles.message,{fontWeight:'bold',color:'white'}]}>Unit</Text>
                                </CollapseHeader>
                                <CollapseBody style={{alignItems:'center'}}>
                                {
                                    //mosCodes.map(item => { return item })
                                }
                                </CollapseBody>
                            </Collapse>
                            <Collapse style={{width:'100%',marginTop:1}}>
                                <CollapseHeader style={styles.accordionHeader}>
                                    <Text style={[styles.message,{fontWeight:'bold',color:'white'}]}>Military Occupation Specialty</Text>
                                </CollapseHeader>
                                <CollapseBody style={{alignItems:'center'}}>
                                    <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1, alignItems:'center', width: '100%'}} >
                                        <FlatList style={{flex:1, width:'80%', marginTop:20}} data={filteredMOS} renderItem={({item}) => renderMOS(item)} keyExtractor={item => item.id.toString()}
                                            ItemSeparatorComponent={() => { return ( <View style={{width: '100%' }} /> ) }} >
                                        </FlatList> 
                                        <View style={{width:'80%', marginTop: 1, marginBottom:5}}>
                                            <View style={styles.searchSection}>
                                                <TextInput style={styles.input} placeholder="Search..." onFocus={() => fillMOSList(mosFilter)} value={mosFilter} onChangeText={updateMOSList}/>
                                                {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                                            </View>
                                        </View>
                                        <View style={{flexDirection:'row', alignItems:'flex-start', flexWrap: 'wrap', width:'80%', margin:5, marginBottom:20}}>
                                        {
                                            mosTags.map(mosItem => { return mosItem })
                                        }
                                        </View>
                                    </LinearGradient>
                                </CollapseBody>
                            </Collapse>
                            <Collapse style={{width:'100%',marginTop:1}}>
                                <CollapseHeader style={styles.accordionHeader}>
                                    <Text style={[styles.message,{fontWeight:'bold',color:'white'}]}>Conflict</Text>
                                </CollapseHeader>
                                <CollapseBody style={{alignItems:'center'}}>
                                    {
                                        //mosCodes.map(item => { return item })
                                    }
                                </CollapseBody>
                            </Collapse>
                            <Collapse style={{width:'100%',marginTop:1}}>
                                <CollapseHeader style={styles.accordionHeader}>
                                    <Text style={[styles.message,{fontWeight:'bold',color:'white'}]}>Home State</Text>
                                </CollapseHeader>
                                <CollapseBody style={{alignItems:'center'}}>
                                    <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1, alignItems:'center', width: '100%'}} >
                                        <FlatList style={{flex:1, width:'80%', marginTop:20}} data={filteredStates} renderItem={({item}) => renderState(item)} 
                                            ItemSeparatorComponent={() => { return ( <View style={{width: '100%' }} /> ) }} >
                                        </FlatList> 
                                        <View style={{width:'80%', marginBottom: 20}}>
                                            <View style={styles.searchSection}>
                                                <TextInput style={styles.input} placeholder="Search..." value={stateFilter} onChangeText={setStateFilter}/>
                                                {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </CollapseBody>
                            </Collapse>
                            <Collapse style={{width:'100%',marginTop:1}}>
                                <CollapseHeader style={styles.accordionHeader}>
                                    <Text style={[styles.message,{fontWeight:'bold',color:'white'}]}>Interment</Text>
                                </CollapseHeader>
                                <CollapseBody style={{alignItems:'center'}}>
                                    <LinearGradient colors={["#00A1D8", "#004481"]} style={{flex:1, alignItems:'center', width: '100%'}} >
                                            <FlatList style={{flex:1, width:'80%', marginTop:20}} data={filteredBurials} renderItem={({item}) => renderBurial(item)} 
                                                ItemSeparatorComponent={() => { return ( <View style={{width: '100%' }} /> ) }} >
                                            </FlatList> 
                                            <View style={{width:'80%', marginBottom: 20}}>
                                                <View style={styles.searchSection}>
                                                    <TextInput style={styles.input} placeholder="Search..." value={burialFilter} onChangeText={setBurialFilter}/>
                                                    {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                                                </View>
                                            </View>
                                    </LinearGradient>
                                </CollapseBody>
                            </Collapse>
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
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginBottom: 20,
        color: 'white',
    },
    screen:{
        width:'80%', 
        marginTop:10, 
        alignItems:'center',
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        textAlign: 'left',
        color: 'black',
        marginLeft:20,
    },
    topMessage: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        textAlign: 'center',
        color: 'white',
        marginTop: 30,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius:10,
        height:'10%',
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius:10,
        fontSize:18,
        color: '#424242',
    },
    searchIcon: {
        padding: 10,
    },
    image:{
        margin: 30,
        height: 140,
        width: 140,
    },
    button: {
        fontFamily: 'Nunito',
        height: 55, 
        width: '80%',
        alignItems: 'center',
        padding: 15,
        margin: 30,
        borderRadius:10,
        backgroundColor: 'red'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    accordionHeader: {
        backgroundColor:'#00294D',
        alignItems:'center',
        justifyContent:'center',
        height:40,
    },
    accordionText: {
        fontFamily: 'SourceSansPro',
        fontSize: 16, 
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    tagSection: {
        flexDirection: 'row',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius:5,
        marginLeft:5,
        marginTop:5,
        width: '100%',
    },
    tagText: {
        fontFamily: 'Nunito',
        fontSize:18,
        padding:2,
        paddingLeft:8,
        color:'white',
        width:'90%',
    },
    tagIcon: {
        margin: 5,
    },
    category: {
        fontFamily: 'Montserrat',
        fontSize: 16, 
        backgroundColor: 'white',
    },
    listItem: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        textAlign: 'left',
        color: 'black',
        marginLeft:20,
    },
  });
  
export default ExploreScreen;
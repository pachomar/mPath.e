import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import { isLoggedUser } from '../../helpers/globals';
import { Badges, MOSCodes } from '../../helpers/enums';
import { REACT_APP_CURRENT_VETERANID, AWS_URL } from '@env';
import { navigateToScreen, showErrorMessage, showOkMessage } from '../../helpers/navigation'; 
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';

const TitleVetScreen = ({ navigation, route }) => {
    const currentVeteran = React.useRef(null);
    const [formSaved, setFormSaved] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);
    const [showSaving, setShowSaving] = React.useState(false);

    const badgeData = React.useRef([]);
    const selectedBadges = React.useRef([]);
    const [filteredBadges, setFilteredBadges] = React.useState([]);
    const [badgeFilter, setBadgeFilter] = React.useState('');
    const [badgeTags, setBadgeTags] = React.useState([]);

    const mosData = React.useRef([]);
    const selectedMOS = React.useRef([]);
    const [filteredMOS, setFilteredMOS] = React.useState([]);
    const [mosFilter, setMOSFilter] = React.useState('');
    const [mosTags, setMOSTags] = React.useState([]);

    const [unitTextInputs, setUnitInputs] = React.useState([]);
    const [engagementTextInputs, setEngagementInputs] = React.useState([]);
    const [awardTextInputs, setAwardInputs] = React.useState([]);

    const units = React.useRef([]);
    const engagements = React.useRef([]);
    const awards = React.useRef([]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {

            if(route.params.currentVeteran) {
                restoreVeteranInfo(route.params.currentVeteran);
            }

            if(units.current.length == 0) addUnitItem();
            if(engagements.current.length == 0) addEngagementItem();
            if(awards.current.length == 0) addAwardItem();
        })
        return unsubscribe;
    }, [navigation]);

    const setUnitValue = (idx, val) => {
        let item = units.current[idx];
        item.Unit = val;
        units.current = [...units.current.slice(0,idx),item,...units.current.slice(idx+1)];
    }

    const addUnitItem = () => {
        units.current.push({ Unit: null });
        addUnitText();
    }

    const addUnitText = () => {
        setUnitInputs([]);

        let tempArr = new Array();
        units.current.forEach((item, idx) => {
            tempArr.push(  
                <View key={'unit-view-' + idx} style={[styles.searchSection,{marginBottom:20}]}>
                    <TextInput key={'unit-input-' + idx} style={styles.input} value={units.current[idx].Unit} onChangeText={(val) => { setUnitValue(idx, val) }}/>
                    <Icon key={'unit-icon-' + idx} name="mic" size={25} color="#004481" style={styles.searchIcon} />
                </View>);
        });
        setUnitInputs(tempArr);
    }

    const removeUnitItem = () => {
        if(units.current.length > 1) {
            units.current = [...units.current.slice(0, units.current.length - 1)];
            addUnitText();
        }
    }

    const setEngagementValue = (idx, val) => {
        let item = engagements.current[idx];
        item.Engagement = val;

        engagements.current = [...engagements.current.slice(0,idx),item,...engagements.current.slice(idx+1)];
    }

    const addEngagementItem = () => {
        engagements.current.push({ Engagement : null });
        addEngagementText();
    }

    const addEngagementText = () => {
        setEngagementInputs([]);

        let tempArr = new Array();
        engagements.current.forEach((item, idx) => {
            tempArr.push(  
                <View key={'engage-view-' + idx} style={[styles.searchSection,{marginBottom:20}]}>
                    <TextInput key={'engage-input-' + idx} style={styles.input} value={engagements.current[idx].Engagement} onChangeText={(val) => { setEngagementValue(idx, val) }}/>
                    <Icon key={'engage-icon-' + idx} name="mic" size={25} color="#004481" style={styles.searchIcon} />
                </View>);
        });
        setEngagementInputs(tempArr);
    }

    const removeEngagementItem = () => {
        if(engagements.current.length > 1) {
            engagements.current = [...engagements.current.slice(0, engagements.current.length - 1)];
            addEngagementText();
        }
    }

    const setAwardValue = (idx, val) => {
        let item = awards.current[idx];
        item.Award = val;

        awards.current = [...awards.current.slice(0,idx),item,...awards.current.slice(idx+1)];
    }

    const addAwardItem = () => {
        awards.current.push({ Award: null });
        addAwardText();
    }

    const addAwardText = () => {
        setAwardInputs([]);

        let tempArr = new Array();
        awards.current.forEach((item, idx) => {
            tempArr.push(
                <View key={'award-view-' + idx} style={[styles.searchSection,{marginBottom:20}]}>
                    <TextInput key={'award-input-' + idx} style={styles.input} value={awards.current[idx].Award} onChangeText={(val) => { setAwardValue(idx, val) }}/>
                    <Icon key={'award-icon-' + idx} name="mic" size={25} color="#004481" style={styles.searchIcon} />
                </View>);
        });
        setAwardInputs(tempArr);
    }

    const removeAwardItem = () => {
        if(awards.current.length > 1) {
            awards.current = [...awards.current.slice(0, awards.current.length - 1)];
            addAwardText();
        }
    }
    
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
        mosData.current = mosData.current.slice(0,10);
        setFilteredMOS([...mosData.current]);
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
                <View style={styles.tagSection} key={'tag-item-m-' + idx}>
                    <Text style={styles.tagText} key={'tag-text-m-' + idx}>{item.name}</Text>
                    <TouchableOpacity key={'tag-button-m-' + idx} onPress={() => {removeMOSTag(item.id)}}>
                        <FontAwesome name="remove" key={'tag-icon-m-' + idx} size={15} color="white" style={styles.tagIcon} />
                    </TouchableOpacity>
                </View>);
        });
        setMOSTags(tempArr);
    }

    const renderMOS = (key) => {
        return (
            <TouchableOpacity key={'mos-'+ key.id} style={styles.category} onPress={() => { addMOSTag(key) }}><Text key={'mosT-'+ key.id} style={styles.listItem}>{key.name}</Text></TouchableOpacity>
        )
    }

    const fillBadgeList = (text) => {
        badgeData.current = new Array();
        setFilteredBadges([...badgeData.current]);
        let counter = 0;

        for(let key = 1; key <= Object.keys(Badges).length; key++) {
            if((text.length > 0 && text != null && Badges[key].toLowerCase().indexOf(text.toLowerCase()) > -1) || text.length == 0 || text == null) {
                badgeData.current.push({ id: key, name: Badges[key]});
                counter++; 
            }
            if(counter >= 10) break;
        }
        badgeData.current = badgeData.current.slice(0,10);
        setFilteredBadges([...badgeData.current]);
    }

    const clearBadgeList = () => {
        setFilteredBadges([]);
    }

    const addBadgeTag = (item) => {
        let idx = selectedBadges.current.find(x => x.id == item.id);

        if(idx == null) {
            selectedBadges.current.push(item);
            setBadgeFilter('');
            clearBadgeList();
            drawBadgeTags();
        }
    }

    const removeBadgeTag = (id) => {
        selectedBadges.current = selectedBadges.current.filter(x => x.id != id);
        drawBadgeTags();
    }

    const updateBagdeList = (text) => {
        setBadgeFilter(text);
        fillBadgeList(text);
    }

    const drawBadgeTags = () => {
        setBadgeTags([]);
        let tempArr = new Array();
        selectedBadges.current.forEach((item, idx) => {
            tempArr.push(            
                <View style={styles.tagSection} key={'tag-item-b-' + idx}>
                    <Text style={styles.tagText} key={'tag-text-b-' + idx}>{item.name}</Text>
                    <TouchableOpacity key={'tag-button-b-' + idx} onPress={() => {removeBadgeTag(item.id)}}>
                        <FontAwesome name="remove" key={'tag-icon-b-' + idx} size={15} color="white" style={styles.tagIcon} />
                    </TouchableOpacity>
                </View>);
        });
        setBadgeTags(tempArr);
    }

    const renderBadge = (key) => {
        return (
            <TouchableOpacity key={'badge-'+ key.id} style={styles.category} onPress={() => { addBadgeTag(key) }}><Text key={'badgeT-'+ key.id} style={styles.listItem}>{key.name}</Text></TouchableOpacity>
        )
    }

    const saveAndContinue = async (idx) => {
        setShowSaving(true);
        let veteran = await prepareVeteranInfo();

        fetch(AWS_URL + '/Veteran/Titles/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'veteran': veteran
            })
        })
        .then((response) => response.text())
        .then(data => { 
            if(JSON.parse(data).error || data.message) {
                showErrorMessage("Save failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                setShowSaving(false);
                return false;
            }

            setFormSaved(true);
            setShowSaving(false);
            showOkMessage("Veteran profile saved","The veteran information has been updated correctly")
        })
        .catch(function(error) {
            console.log(error);
            setShowSaving(false);
            showErrorMessage("Save failed. Please try again","There was an error while trying to save the veteran information")
        });
    }

    const GoToNext = () => {
        navigateToScreen(navigation, "MediaVeteran", { currentVeteran: currentVeteran.current });
    }

    const GoToPrevious = () => {
        navigateToScreen(navigation, "ServiceVeteran", { currentVeteran: currentVeteran.current });
    }

    const prepareVeteranInfo = async () => {
        let veteranInfo = {};

        veteranInfo.VeteranId = await AsyncStorage.getItem(REACT_APP_CURRENT_VETERANID);
        veteranInfo.MOSCodes = selectedMOS.current;
        veteranInfo.Units = units.current;
        veteranInfo.Engagements = engagements.current;
        veteranInfo.Awards = awards.current;
        veteranInfo.Badges = selectedBadges.current;

        return veteranInfo;
    }

    const restoreVeteranInfo = (veteran) => {
        if(currentVeteran.current == null)
        {
            setShowLoading(true);

            currentVeteran.current = veteran;
            veteran.MOSCodes.map((item) => { selectedMOS.current.push({ id: item.MOSCodeId, name: MOSCodes[item.MOSCodeId]}) });
            units.current = veteran.Units;
            engagements.current = veteran.Engagements;
            awards.current = veteran.Awards;
            veteran.Badges.map((item) => { selectedBadges.current.push({ id: item.RibbonId, name: Badges[item.RibbonId]}) });

            addUnitText();
            addEngagementText();
            addAwardText();
            drawMOSTags();
            drawBadgeTags();
            setFormSaved(true);

            setShowLoading(false);
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.scene} contentContainerStyle={{alignItems: "center"}} >
                <Spinner visible={showLoading} textContent={"Loading profile..."} overlayColor={'#00448188'} color={'black'} />
                <Spinner visible={showSaving} textContent={"Saving changes..."} overlayColor={'#00448188'} color={'black'} />
                <Text style={styles.welcome}>Military Service</Text>
                <View style={{width:'80%'}}>
                    <Text style={[styles.message,{marginBottom:20}]}>Let’s continue to build the details of this Veteran’s military service. Follow the prompts below to enter what you know. When you do not know, leave the field blank.</Text>
                    <View style={{alignItems:'center'}}>
                        <Text style={[styles.title,{textAlign:'center', marginTop:10}]}>MILITARY OPERATIONS {'\n'}SPECIALTY (MOS)</Text>
                    </View>
                    <View>
                        <FlatList style={{flex:1, width:'100%'}} data={filteredMOS} renderItem={({item}) => renderMOS(item)} keyExtractor={item => item.id.toString()}
                            ItemSeparatorComponent={() => { return ( <View style={{ width: '100%', backgroundColor: '#004481' }} /> ) }} >
                        </FlatList>
                        <View style={[styles.searchSection,{marginBottom:10}]}>
                            <TextInput style={styles.input} value={mosFilter} placeholder="Search..." onFocus={() => fillMOSList(mosFilter)} onChangeText={updateMOSList}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <View style={{flexDirection:'row', alignItems:'flex-start', flexWrap: 'wrap', width:'95%', margin:5}}>
                        {
                            mosTags.map(mosItem => { return mosItem })
                        }
                        </View>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={[styles.title,{marginTop:10}]}>UNITS</Text>
                    </View>
                    {
                        unitTextInputs.map(textInput => { return textInput })
                    }
                    <View style={[styles.buttonArea,{marginTop:-20,flexDirection:'row',justifyContent:'center'}]}>
                        <TouchableOpacity style={styles.addFieldButton} onPress={addUnitItem}>
                            <Image source={require('../../images/add-field.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.addFieldButton,{margin:10}]} onPress={removeUnitItem}>
                            <Image source={require('../../images/remove-field.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={[styles.title,{marginTop:10}]}>ENGAGEMENTS</Text>
                    </View>
                    {
                        engagementTextInputs.map(textInput => { return textInput })
                    }
                    <View style={[styles.buttonArea,{marginTop:-20,flexDirection:'row',justifyContent:'center'}]}>
                        <TouchableOpacity style={styles.addFieldButton} onPress={addEngagementItem}>
                            <Image source={require('../../images/add-field.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.addFieldButton,{margin:10}]} onPress={removeEngagementItem}>
                            <Image source={require('../../images/remove-field.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={[styles.title,{marginTop:10}]}>AWARDS</Text>
                        <Text style={[styles.message,{textAlign:'center'}]}>Decorations, Medals, Badges, Citations and Campaign Ribbons Awarded or Authorized</Text>
                    </View>
                    {
                        awardTextInputs.map(textInput => { return textInput })
                    }
                    <View style={[styles.buttonArea,{marginTop:-20,flexDirection:'row',justifyContent:'center'}]}>
                        <TouchableOpacity style={styles.addFieldButton} onPress={addAwardItem}>
                            <Image source={require('../../images/add-field.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.addFieldButton,{margin:10}]} onPress={removeAwardItem}>
                            <Image source={require('../../images/remove-field.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={[styles.title,{marginTop:10}]}>BADGES</Text>
                        <Text style={[styles.message,{textAlign:'center'}]}>Qualifications and Accomplishments</Text>
                    </View>
                    <View>
                        <FlatList style={{flex:1, width:'100%', marginBottom:1}} data={filteredBadges} renderItem={({item}) => renderBadge(item)} keyExtractor={item => item.id.toString()}
                            ItemSeparatorComponent={() => { return ( <View style={{width: '100%', backgroundColor: '#004481' }} /> ) }} >
                        </FlatList>
                        <View style={[styles.searchSection,{marginBottom:10}]}>
                            <TextInput style={styles.input} placeholder="Search..." value={badgeFilter} onFocus={() => fillBadgeList(badgeFilter)} onChangeText={updateBagdeList}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <View style={{flexDirection:'row', alignItems:'flex-start', flexWrap: 'wrap', width:'95%', margin:5}}>
                        {
                            badgeTags.map(badgeItem => { return badgeItem })
                        }
                        </View>
                    </View>
                    <View style={[styles.buttonArea,{marginBottom:30}]}>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={[styles.button,{width:'15%'}]} onPress={GoToPrevious}>
                                <FontAwesome5 name="arrow-circle-left" size={28} color="white"/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={saveAndContinue}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button,{width:'15%',backgroundColor: formSaved ? '#00A1D8':'#004481'}]} disabled={!formSaved} onPress={GoToNext}>
                                <FontAwesome5 name="arrow-circle-right" size={28} color={formSaved ? "white":'#004481'}/>
                            </TouchableOpacity>
                        </View>
                        <Image source={require('../../images/tab-progress-3.png')} style={styles.progress}></Image>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    welcome: {
        fontFamily: 'Montserrat',
        fontSize: 28, 
        marginTop: 30,
        marginBottom: 10,
        color: 'white',
    },
    title: {
        fontFamily: 'Montserrat',
        fontSize: 22, 
        marginTop: 40,
        marginBottom: 10,
        color: 'white',
    },
    scene: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor:'#004481',
    },
    screen: {
        flex: 1,
        height: '100%',
    },
    buttonArea:{
        alignItems: "center",
        width: '100%',
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        fontFamily: 'Nunito',
        height: 50, 
        width: '40%',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        borderRadius:10,
        marginTop: 30,
        marginBottom: 30,
        backgroundColor: '#00A1D8'
    },
    searchIcon: {
        padding: 7,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius:10,
        height:40,
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius:10,
        fontSize:18,
        color: '#424242',
    },
    progress: {
        marginTop: 20,
    },
    addFieldButton: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
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
  
export default TitleVetScreen;
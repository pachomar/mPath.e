import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoggedUser } from '../../helpers/globals';
import { Picker } from '@react-native-picker/picker';
import { Icon, CheckBox } from 'react-native-elements';
import { REACT_APP_CURRENT_VETERANID, AWS_URL } from '@env';
import { navigateToScreen, showErrorMessage, showOkMessage } from '../../helpers/navigation'; 
import { State, DeathCause, Relationship, BurialPlace } from '../../helpers/enums'; 
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';

const CreateVetScreen = ({ navigation, route }) => {
    const currentVeteran = React.useRef(null);
    const [formSaved, setFormSaved] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);
    const [showSaving, setShowSaving] = React.useState(false);

    const [veteranId, setVeteranId] = React.useState(null);
    const [chosenRelationship, setRelationShip] = React.useState(null);
    const [ownProfile, setOwnProfile] = React.useState(null);
    const [helpProfile, setHelpProfile] = React.useState(null);
    const [otherProfile, setOtherProfile] = React.useState(null);
    const [firstName, setFirstName] = React.useState(null);
    const [middleName, setMiddleName] = React.useState(null);
    const [lastName, setLastName] = React.useState(null);
    const [suffix, setSuffix] = React.useState(null);
    const [birthMonth, setBirthMonth] = React.useState(null);
    const [birthDay, setBirthDay] = React.useState(null);
    const [birthYear, setBirthYear] = React.useState(null);
    const [city, setCity] = React.useState(null);
    const [stateUS, setStateUS] = React.useState(null);
    const [country, setCountry] = React.useState(null);
    const [isDeceased, setDeceased] = React.useState(false);
    const [deathMonth, setDeathMonth] = React.useState(null);
    const [deathDay, setDeathDay] = React.useState(null);
    const [deathYear, setDeathYear] = React.useState(null);
    const [chosenDeathCause, setDeathCause] = React.useState(null);
    const [chosenBurialPlace, setBurialPlace] = React.useState(null);

    React.useEffect(() => {
        if(route.params && route.params.currentVeteran)
            restoreVeteranInfo(route.params.currentVeteran);
    }, []);

    const ownProfileChosen = (callFunction, isOwn) => {
        setOwnProfile(false);
        setHelpProfile(false);
        setOtherProfile(false);

        callFunction(true);
        isOwn ? setRelationShip(1) : setRelationShip(null);
    };

    const saveAndContinue = () => {
        if(firstName == null || lastName == null)
        {
            showErrorMessage("Save failed. Missing required fields","First and Last Name are required fields to save Veteran information")
        }
        else
        {        
            setShowSaving(true);
            let veteranInfo = prepareVeteranInfo();

            fetch(AWS_URL + '/Veteran/Basic/', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'veteran': veteranInfo
                })
            })
            .then((response) => response.text())
            .then(async data => { 
                if(JSON.parse(data).error || data.message) {
                    showErrorMessage("Save failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                    setShowSaving(false);
                    return false;
                }

                await AsyncStorage.setItem(REACT_APP_CURRENT_VETERANID, JSON.parse(data).VeteranId);
                setVeteranId(JSON.parse(data).VeteranId);
                setShowSaving(false);
                setFormSaved(true);

                showOkMessage("Veteran profile saved","The veteran information has been updated correctly")
            })
            .catch(function(error) {
                console.log(error);
                setShowSaving(false);
                showErrorMessage("Save failed. Please try again","There was an error while trying to save the veteran information")
            });
        }
    }

    const GoToNext = () => {
        navigateToScreen(navigation, "ServiceVeteran", { currentVeteran: currentVeteran.current });
    }

    const prepareVeteranInfo = () => {
        let owner = {
            UserId: getLoggedUser().UserId, VeteranId: veteranId, RelationshipId: chosenRelationship,
            IsOwn: ownProfile, IsHelp: helpProfile, IsOther: otherProfile 
        };

        let veteranInfo = {};
        veteranInfo.VeteranId = veteranId;
        veteranInfo.FirstName = firstName;
        veteranInfo.MiddleName = middleName;
        veteranInfo.LastName = lastName;
        veteranInfo.Suffix = suffix;
        veteranInfo.BirthMonth = birthMonth;
        veteranInfo.BirthDay = birthDay;
        veteranInfo.BirthYear = birthYear;
        veteranInfo.City = city;
        veteranInfo.StateCode = stateUS;
        veteranInfo.Country = country;
        veteranInfo.IsDeceased = isDeceased;
        veteranInfo.DeathMonth = deathMonth;
        veteranInfo.DeathDay = deathDay;
        veteranInfo.DeathYear = deathYear;
        veteranInfo.CauseId = chosenDeathCause;
        veteranInfo.BurialId = chosenBurialPlace;
        veteranInfo.Owner = owner;

        return veteranInfo;
    }

    const restoreVeteranInfo = async (veteran) => {
        if(currentVeteran.current == null)
        {
            setShowLoading(true);
            setVeteranId(veteran.VeteranId);
            await AsyncStorage.setItem(REACT_APP_CURRENT_VETERANID, veteran.VeteranId);

            currentVeteran.current = veteran;

            setRelationShip(parseInt(currentVeteran.current.Owner.RelationshipId));
            setOwnProfile(currentVeteran.current.Owner.IsOwn);
            setHelpProfile(currentVeteran.current.Owner.IsHelp);
            setOtherProfile(currentVeteran.current.Owner.IsOther);
            setFirstName(currentVeteran.current.FirstName);
            setMiddleName(currentVeteran.current.MiddleName);
            setLastName(currentVeteran.current.LastName);
            setSuffix(currentVeteran.current.Suffix);
            setBirthMonth(currentVeteran.current.BirthMonth != null ? currentVeteran.current.BirthMonth.toString() : null);
            setBirthDay(currentVeteran.current.BirthDay != null ? currentVeteran.current.BirthDay.toString() : null);
            setBirthYear(currentVeteran.current.BirthYear != null ? currentVeteran.current.BirthYear.toString() : null);
            setCity(currentVeteran.current.City);
            setStateUS(currentVeteran.current.StateCode);
            setCountry(currentVeteran.current.Country);
            setDeceased(currentVeteran.current.IsDeceased);
            setDeathMonth(currentVeteran.current.DeathMonth != null ? currentVeteran.current.DeathMonth.toString() : null);
            setDeathDay(currentVeteran.current.DeathDay != null ? currentVeteran.current.DeathDay.toString() : null);
            setDeathYear(currentVeteran.current.DeathYear != null ? currentVeteran.current.DeathYear.toString() : null);
            setDeathCause(currentVeteran.current.CauseId);
            setBurialPlace(currentVeteran.current.BurialId);
            setFormSaved(true);

            setShowLoading(false);
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.scene} contentContainerStyle={{alignItems: "center"}}>
                <Spinner visible={showLoading} textContent={"Loading profile..."} overlayColor={'#00448188'} color={'black'} />
                <Spinner visible={showSaving} textContent={"Saving changes..."} overlayColor={'#00448188'} color={'black'} />
                <Text style={styles.welcome}>Create a Profile</Text>
                <View style={{width:'80%'}}>
                    <Text style={styles.message}>Follow the prompts below to start building this Veteran’s legacy. You can come back at any time to add or edit this information. Enter what you can and leave the other fields blank. Most of this information can be found on the Veteran’s form DD214 (discharge document).</Text>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.title}>ABOUT YOU</Text>
                    </View>
                    <Text style={styles.message}>Select your relationship to this Veteran</Text>
                    <View style={styles.pickerBoxContainer}>
                        <View style={styles.pickerBoxInner}>
                            <Picker onValueChange={(val) => { val == 1 ? ownProfileChosen(setOwnProfile, true) : setRelationShip(val)}} mode="dropdown" 
                                style={styles.pickerStyle} selectedValue={chosenRelationship}>
                                    <Picker.Item label="Select" style={{fontSize:18}} value={null} key={null}/>
                                    <Picker.Item label="This is my Veteran profile" style={{fontSize:18}} value={1} key={0}/>
                                    {  
                                        Object.keys(Relationship).map((item, key) => { 
                                           return key > 1 ? (<Picker.Item label={Relationship[item]} style={{fontSize:18}} value={key} key={item}/>) : null
                                        })
                                    }
                            </Picker>
                        </View>
                    </View>
                    <Text style={[styles.message, {marginBottom:20}]}>My relationship to this profile is:</Text>
                    <View style={{width: '90%'}}>
                        <CheckBox containerStyle={styles.checkbox} onPress={()=>{ownProfileChosen(setOwnProfile, true)}} checked={ownProfile} checkedColor={'white'} title={
                            <Text style={styles.messageCheckbox}>This is my Veteran profile</Text>}>
                        </CheckBox>
                        <CheckBox containerStyle={styles.checkbox} onPress={()=>{ownProfileChosen(setHelpProfile, false)}} checked={helpProfile} checkedColor={'white'} title={
                            <Text style={styles.messageCheckbox}>I am helping another Veteran</Text>}>
                        </CheckBox>
                        <CheckBox containerStyle={[styles.checkbox, {marginTop:-40}]} onPress={()=>{ownProfileChosen(setOtherProfile, false)}} checked={otherProfile} checkedColor={'white'} title={
                            <Text style={[styles.messageCheckbox, {marginTop:20}]}>I am building a legacy for another deceased or fallen Veteran</Text>}>
                        </CheckBox>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.title}>VETERAN INFORMATION</Text>
                    </View>
                    <Text style={styles.message}>First name</Text>
                    <View style={styles.searchSection}>
                        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
                        {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                    </View>
                    <Text style={styles.message}>Middle name or initial</Text>
                    <View style={styles.searchSection}>
                        <TextInput style={styles.input} value={middleName} onChangeText={setMiddleName}/>
                        {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                    </View>
                    <Text style={styles.message}>Last Name</Text>
                    <View style={styles.searchSection}>
                        <TextInput style={styles.input} value={lastName} onChangeText={setLastName}/>
                        {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                    </View>
                    <Text style={styles.message}>Suffix</Text>
                    <View style={[styles.searchSection, {marginBottom: 90}]}>
                        <TextInput style={styles.input} maxLength={16} value={suffix} onChangeText={setSuffix}/>
                        {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                    </View>
                    <Text style={styles.message}>Date of birth</Text>
                    <View style={{flexDirection:'row'}}>
                        <View style={[styles.pickerBoxContainer, {width:'32%', marginRight:10}]}>
                            <View style={styles.pickerBoxInner}>
                                <Picker onValueChange={setBirthMonth} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={birthMonth}>
                                    <Picker.Item label="Month" style={{fontSize:16}} value={null} key={null}/>
                                    {   
                                        ['1','2','3','4','5','6','7','8','9','10','11','12'].map((item) => {
                                            return (<Picker.Item label={item} style={{fontSize:16}} value={item} key={item}/>)
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                        <View style={[styles.pickerBoxContainer, {width:'32%', marginRight:10}]}>
                            <View style={styles.pickerBoxInner}>
                                <Picker onValueChange={setBirthDay} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={birthDay}>
                                    <Picker.Item label="Day" style={{fontSize:16}} value={null} key={null}/>
                                    {   
                                        ['1','2','3','4','5','6','7','8','9','10',
                                        '11','12','13','14','15','16','17','18','19','20',
                                        '21','22','23','24','25','26','27','28','29','30','31'].map((item) => {
                                            return ((['4','6','9','11'].indexOf(birthMonth) > -1 && item == '31') || (birthMonth == '2' && parseInt(item) > 28)) ? null : 
                                            (<Picker.Item label={item} style={{fontSize:16}} value={item} key={item}/>)
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                        <View style={[styles.pickerBoxContainer, {width:'30%'}]}>
                            <View style={styles.pickerBoxInner}>
                                <TextInput maxLength={4} onChangeText={setBirthYear} placeholder="Year" keyboardType='number-pad' style={[styles.input,{fontSize:14, fontWeight:'bold'}]} value={birthYear} />
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'70%'}}>
                            <Text style={styles.message}>City of Birth</Text>
                        </View>
                        <View style={{width:'30%'}}>
                            <Text style={styles.message}>State</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={[styles.searchSection,{marginRight:10}]}>
                            <TextInput style={styles.input} value={city} onChangeText={setCity}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <View style={[styles.pickerBoxContainer, {width:'30%'}]}>
                            <View style={styles.pickerBoxInner}>
                                <Picker onValueChange={setStateUS} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={stateUS} onValueChange={(value) => { setStateUS(value) }} >
                                    <Picker.Item label="State" style={{fontSize:16}} value={null} key={null}/>
                                    { 
                                        Object.keys(State).map((item, key) => {
                                           return (<Picker.Item label={item} style={{fontSize:16}} value={item} key={item}/>)
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.message}>Country</Text>
                    <View style={[styles.searchSection,{marginBottom:90}]}>
                        <TextInput style={styles.input} value={country} onChangeText={setCountry}/>
                        {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                    </View>
                    <CheckBox containerStyle={styles.checkbox} onPress={() => { setDeceased(!isDeceased) }} checked={isDeceased} checkedColor={'white'} title={
                        <Text style={styles.messageCheckbox}>Veteran is deceased</Text>}>
                    </CheckBox>
                    { isDeceased ?
                        <View>
                        <Text style={styles.message}>Date of death</Text>
                        <View style={{flexDirection:'row'}}>
                            <View style={[styles.pickerBoxContainer, {width:'32%', marginRight:10}]}>
                                <View style={styles.pickerBoxInner}>
                                    <Picker onValueChange={setDeathMonth} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={deathMonth}>
                                        <Picker.Item label="Month" style={{fontSize:16}} value={null} key={null}/>
                                        {   
                                            ['1','2','3','4','5','6','7','8','9','10','11','12'].map((item) => {
                                                return (<Picker.Item label={item} style={{fontSize:16}} value={item} key={item}/>)
                                            })
                                        }
                                    </Picker>
                                </View>
                            </View>
                            <View style={[styles.pickerBoxContainer, {width:'32%', marginRight:10}]}>
                                <View style={styles.pickerBoxInner}>
                                    <Picker onValueChange={setDeathDay} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={deathDay}>
                                        <Picker.Item label="Day" style={{fontSize:16}} value={null} key={null}/>
                                        {   
                                            ['1','2','3','4','5','6','7','8','9','10',
                                            '11','12','13','14','15','16','17','18','19','20',
                                            '21','22','23','24','25','26','27','28','29','30','31'].map((item) => {
                                                return ((['4','6','9','11'].indexOf(deathMonth) > -1 && item == '31') || (deathMonth == '2' && parseInt(item) > 28)) ? null : 
                                                (<Picker.Item label={item} style={{fontSize:16}} value={item} key={item}/>)
                                            })
                                        }
                                    </Picker>
                                </View>
                            </View>
                            <View style={[styles.pickerBoxContainer, {width:'30%'}]}>
                                <View style={styles.pickerBoxInner}>
                                    <TextInput maxLength={4} onChangeText={setDeathYear} placeholder="Year" keyboardType='number-pad' style={[styles.input,{fontSize:14, fontWeight:'bold'}]} value={deathYear} />
                                </View>
                            </View>
                        </View>
                        <Text style={styles.message}>Cause of death</Text>
                        <View style={styles.pickerBoxContainer}>
                            <View style={styles.pickerBoxInner}>
                                <Picker onValueChange={setDeathCause} mode="dropdown" style={styles.pickerStyle} selectedValue={chosenDeathCause} >
                                    <Picker.Item label="Select" style={{fontSize:18}} value={null} key={null}/>
                                    {
                                        Object.keys(DeathCause).map((item, key) => {
                                            return (<Picker.Item label={DeathCause[item]} style={{fontSize:18}} value={key+1} key={item}/>)
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                        <Text style={styles.message}>Place of interment</Text>
                        <View style={[styles.pickerBoxContainer,{marginBottom:30}]}>
                            <View style={styles.pickerBoxInner}>
                                <Picker onValueChange={setBurialPlace} mode="dropdown" style={styles.pickerStyle} selectedValue={chosenBurialPlace}>
                                    <Picker.Item label="Select" style={{fontSize:18}} value={null} key={null}/>
                                    { 
                                        Object.keys(BurialPlace).map((item, key) => {
                                            return (<Picker.Item label={BurialPlace[item]} style={{fontSize:18}} value={key+1} key={item}/>)
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                    </View> : null
                    }
                    <View style={[styles.buttonArea,{marginBottom:30}]}>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity visible={false} style={[styles.button,{width:'15%',backgroundColor:'#004481'}]}>
                                <FontAwesome5 name="arrow-circle-left" size={28} color="#004481"/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={saveAndContinue}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button,{width:'15%', backgroundColor: formSaved ? '#00A1D8':'#004481'}]} disabled={!formSaved} onPress={GoToNext}>
                                <FontAwesome5 name="arrow-circle-right" size={28} color={formSaved ? "white":'#004481'}/>
                            </TouchableOpacity>
                        </View>
                        <Image source={require('../../images/tab-progress-1.png')} style={styles.progress}></Image>
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
    pickerBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    pickerBoxInner: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        height: 40,
    },
    pickerStyle: {
        width: '120%',
        transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
        left: -32,
        position: 'absolute',
    },
    pickerStyleSmall: {
        width: '120%',
        transform: [{ scaleX: 0.90 }, { scaleY: 0.90 }],
        left: -5,
        position: 'absolute',
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
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    checkbox:{
        backgroundColor:'transparent',
        borderWidth: 0,
        marginTop: -20,
        marginLeft: -10,
    },
    messageCheckbox: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'left',
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
    searchIcon: {
        padding: 7,
    },
    progress: {
        marginTop: 20,
    },
    addFieldButton: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
  });
  
export default CreateVetScreen;
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { isLoggedUser } from '../../helpers/globals';
import { REACT_APP_CURRENT_VETERANID, AWS_URL } from '@env';
import { navigateToScreen, showErrorMessage, showOkMessage } from '../../helpers/navigation';
import { ServiceBranch, State, SeparationType, RankByBranch } from '../../helpers/enums'; 
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
 
const ServiceVetScreen = ({ navigation, route }) => {
    const currentVeteran = React.useRef(null);
    const diff = React.useRef(0);
    const [formSaved, setFormSaved] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);
    const [showSaving, setShowSaving] = React.useState(false);

    const [chosenBranch, setChosenBranch] = React.useState(null);
    const [enlistMonth, setEnlistMonth] = React.useState(null);
    const [enlistDay, setEnlistDay] = React.useState(null);
    const [enlistYear, setEnlistYear] = React.useState(null);
    const [entryCity, setEntryCity] = React.useState(null);
    const [entryState, setEntryState] = React.useState(null);
    const [completedMonth, setCompletedMonth] = React.useState(null);
    const [completedDay, setCompletedDay] = React.useState(null);
    const [completedYear, setCompletedYear] = React.useState(null);
    const [chosenSeparationType, setSeparationType] = React.useState(null);
    const [chosenRank, setChosenRank] = React.useState(null);

    React.useEffect(() => {
        if(route.params.currentVeteran)
            restoreVeteranInfo(route.params.currentVeteran);
    }, []);

    const saveAndContinue = async () => {
        setShowSaving(true);
        let veteran = await prepareVeteranInfo();

        fetch(AWS_URL + '/Veteran/Service/', {
            method: 'post',
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
        navigateToScreen(navigation, "TitleVeteran", { currentVeteran: currentVeteran.current });
    }

    const GoToPrevious = () => {
        navigateToScreen(navigation, "CreateVeteran", { currentVeteran: currentVeteran.current });
    }

    const prepareVeteranInfo = async () => {
        let veteranInfo = {};

        veteranInfo.VeteranId = await AsyncStorage.getItem(REACT_APP_CURRENT_VETERANID);
        veteranInfo.BranchId = chosenBranch;
        veteranInfo.EnlistMonth = enlistMonth;
        veteranInfo.EnlistDay = enlistDay;
        veteranInfo.EnlistYear = enlistYear;
        veteranInfo.EntryCity = entryCity;
        veteranInfo.EntryState = entryState;
        veteranInfo.CompletedMonth = completedMonth;
        veteranInfo.CompletedDay = completedDay;
        veteranInfo.CompletedYear = completedYear;
        veteranInfo.TypeId = chosenSeparationType;
        veteranInfo.RankId = chosenRank;

        return veteranInfo;
    }

    const restoreVeteranInfo = (veteran) => {
        if(currentVeteran.current == null)
        {
            setShowLoading(true);
            currentVeteran.current = veteran;

            setChosenBranch(currentVeteran.current.BranchId);
            setChosenRank(currentVeteran.current.RankId);
            setEnlistMonth(currentVeteran.current.EnlistMonth != null ? currentVeteran.current.EnlistMonth.toString() : null);
            setEnlistDay(currentVeteran.current.EnlistDay != null ? currentVeteran.current.EnlistDay.toString() : null);
            setEnlistYear(currentVeteran.current.EnlistYear != null ? currentVeteran.current.EnlistYear.toString() : null);
            setEntryCity(currentVeteran.current.EntryCity);
            setEntryState(currentVeteran.current.EntryState);
            setCompletedMonth(currentVeteran.current.CompletedMonth != null ? currentVeteran.current.CompletedMonth.toString() : null);
            setCompletedDay(currentVeteran.current.CompletedDay != null ? currentVeteran.current.CompletedDay.toString() : null);
            setCompletedYear(currentVeteran.current.CompletedYear != null ? currentVeteran.current.CompletedYear.toString() : null);
            setSeparationType(currentVeteran.current.TypeId);

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
                    <Text style={styles.message}>Now let’s build this Veteran’s military service. Follow the prompts below to enter what you know. When you do not know, leave the field blank.</Text>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.title}>BRANCH OF SERVICE</Text>
                    </View>
                    <View style={styles.pickerBoxContainer}>
                        <View style={styles.pickerBoxInner}>
                            <Picker onValueChange={setChosenBranch} mode="dropdown" style={styles.pickerStyle} selectedValue={chosenBranch}>
                                <Picker.Item label="Select" style={{fontSize:18}} value={null} key={null}/>
                                {   
                                    Object.keys(ServiceBranch).map((item, key) => {
                                       return (<Picker.Item label={ServiceBranch[item]} style={{fontSize:18}} value={key+1} key={item}/>)
                                    })
                                }
                            </Picker>
                        </View>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.title}>ENLISTMENT DATE</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={[styles.pickerBoxContainer, {width:'32%', marginRight:10}]}>
                            <View style={styles.pickerBoxInner}>
                                <Picker onValueChange={setEnlistMonth} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={enlistMonth}>
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
                                <Picker onValueChange={setEnlistDay} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={enlistDay}>
                                    <Picker.Item label="Day" style={{fontSize:16}} value={null} key={null}/>
                                    {   
                                        ['1','2','3','4','5','6','7','8','9','10',
                                        '11','12','13','14','15','16','17','18','19','20',
                                        '21','22','23','24','25','26','27','28','29','30','31'].map((item) => {
                                            return ((['4','6','9','11'].indexOf(enlistMonth) > -1 && item == '31') || (enlistMonth == '2' && parseInt(item) > 28)) ? null : 
                                            (<Picker.Item label={item} style={{fontSize:16}} value={item} key={item}/>)
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                        <View style={[styles.pickerBoxContainer, {width:'30%'}]}>
                            <View style={styles.pickerBoxInner}>
                                <TextInput onChangeText={setEnlistYear} placeholder="Year" keyboardType='number-pad' maxLength={4} style={[styles.input,{fontSize:14, fontWeight:'bold'}]} value={enlistYear} />
                            </View>
                        </View>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.title}>PLACE OF ENTRY</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop:-20}}>
                        <View style={{width:'70%'}}>
                            <Text style={styles.message}>City</Text>
                        </View>
                        <View style={{width:'30%'}}>
                            <Text style={styles.message}>State</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={[styles.searchSection,{marginRight:10}]}>
                            <TextInput style={styles.input} value={entryCity} onChangeText={setEntryCity}/>
                            {/* <Icon name="mic" size={25} color="#004481" style={styles.searchIcon} /> */}
                        </View>
                        <View style={[styles.pickerBoxContainer, {width:'30%'}]}>
                            <View style={styles.pickerBoxInner}>
                                <Picker onValueChange={setEntryState} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={entryState}>
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
                    <View style={{alignItems:'center', width:'120%', marginLeft:-30}}>
                        <Text style={styles.title}>COMPLETED SERVICE DATE</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={[styles.pickerBoxContainer, {width:'32%', marginRight:10}]}>
                            <View style={styles.pickerBoxInner}>
                                <Picker onValueChange={setCompletedMonth} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={completedMonth}>
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
                                <Picker onValueChange={setCompletedDay} mode="dropdown" style={styles.pickerStyleSmall} selectedValue={completedDay}>
                                    <Picker.Item label="Day" style={{fontSize:16}} value={null} key={null}/>
                                    {   
                                        ['1','2','3','4','5','6','7','8','9','10',
                                        '11','12','13','14','15','16','17','18','19','20',
                                        '21','22','23','24','25','26','27','28','29','30','31'].map((item) => {
                                            return ((['4','6','9','11'].indexOf(completedMonth) > -1 && item == '31') || (completedMonth == '2' && parseInt(item) > 28)) ? null : 
                                            (<Picker.Item label={item} style={{fontSize:16}} value={item} key={item}/>)
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                        <View style={[styles.pickerBoxContainer, {width:'30%'}]}>
                            <View style={styles.pickerBoxInner}>
                                <TextInput onChangeText={setCompletedYear} placeholder="Year" keyboardType='number-pad' maxLength={4} style={[styles.input,{fontSize:14, fontWeight:'bold'}]} value={completedYear} />
                            </View>
                        </View>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.title}>TYPE OF SEPARATION</Text>
                    </View>
                    <View style={styles.pickerBoxContainer}>
                        <View style={styles.pickerBoxInner}>
                            <Picker onValueChange={setSeparationType} mode="dropdown" style={styles.pickerStyle} selectedValue={chosenSeparationType}>
                                <Picker.Item label="Select" style={{fontSize:18}} value={null} key={null}/>
                                {   
                                    Object.keys(SeparationType).map((item, key) => {
                                        return (<Picker.Item label={SeparationType[item]} style={{fontSize:18}} value={key+1} key={item}/>)
                                    })
                                }
                            </Picker>
                        </View>
                    </View>
                    <View style={{alignItems:'center', width:'130%', marginLeft: -40}}>
                        <Text style={styles.title}>RANK AT TIME OF SEPARATION</Text>
                    </View>
                    <View style={[styles.pickerBoxContainer,{marginBottom:30}]}>
                        <View style={styles.pickerBoxInner}>
                            <Picker onValueChange={setChosenRank} mode="dropdown" style={styles.pickerStyle} selectedValue={chosenRank}>
                                <Picker.Item label="Select" style={{fontSize:18}} value={null} key={null}/>
                                {   
                                    chosenBranch != null ? Object.keys(RankByBranch[chosenBranch]).map((item, key) => {
                                        return (<Picker.Item label={RankByBranch[chosenBranch][item]} style={{fontSize:18}} value={key+(chosenBranch == 6 ? 139 : (chosenBranch == 5 ? 109 : (chosenBranch == 4 ? 80 : (chosenBranch == 3 ? 55 : (chosenBranch == 2 ? 25 : 1)))))} key={item}/>)
                                    }) : null
                                }
                            </Picker>
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
                        <Image source={require('../../images/tab-progress-2.png')} style={styles.progress}></Image>
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
  });
  
export default ServiceVetScreen;
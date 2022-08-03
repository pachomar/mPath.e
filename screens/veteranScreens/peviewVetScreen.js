import React from 'react';
import Voice from '@react-native-community/voice';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, CheckBox } from 'react-native-elements';
import { navigateToScreen, showErrorMessage, showOkMessage } from '../../helpers/navigation'; 
import { REACT_APP_CURRENT_VETERANID, REACT_APP_LOGIN_TOKEN, AWS_URL } from '@env';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';

const PreviewVetScreen = ({ navigation, route }) => {
    const [showLoading, setShowLoading] = React.useState(false);
    const [imageSource, setImageSource] = React.useState(null);
    const [caption, setCaption] = React.useState(null);
    const [isProfile, setIsprofile] = React.useState(false);
    const tagList = React.useRef([]);
    const [tagListItems, setTaglistItems] = React.useState([]);
    const [imageHeight, setImageHeight] = React.useState(300);
    const [imageWidth, setImageWidth] = React.useState(350);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => { 
            setImageSource(route.params.imageSrc);

            if(route.params.imageHeight > route.params.imageWidth) {
                let h1 = (350 / route.params.imageHeight).toFixed(2);
                setImageHeight(Math.round(route.params.imageHeight * h1));
                setImageWidth(Math.round(route.params.imageWidth * h1 ));
            }
            else {
                let h1 = (350 / route.params.imageWidth).toFixed(2);
                setImageHeight(Math.round(route.params.imageHeight * h1));
                setImageWidth(Math.round(route.params.imageWidth * h1 ));
            }
            
        });

        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        Voice.onSpeechResults = (e) => {
            setCaption(e.value[0])
            showOkMessage(e.value.flat(), e.value[0])
        }

        Voice.onSpeechPartialResults = (e) => {
            setCaption('partial' + e.value[0])
            showOkMessage(e.value.flat(), e.value[0])
        }
    }, []);

    const addTagItem = (tag) => {
        tagList.current.push(tag.nativeEvent.text);
        addTagTexts();
    }

    const addTagTexts = () => { 
        setTaglistItems([]);

        let tempArr = new Array();
        tagList.current.forEach((item, idx) => {
            tempArr.push(            
                <View style={styles.tagSection} key={'tag-item-' + idx}>
                    <Text style={styles.tagText} key={'tag-text-' + idx}>{item}</Text>
                    <TouchableOpacity key={'tag-button-' + idx} onPress={() => {removeTagItem(idx)}}>
                        <FontAwesome name="remove" key={'tag-icon-' + idx} size={15} color="#004481" style={styles.tagIcon} />
                    </TouchableOpacity>
                </View>);
        });
        setTaglistItems(tempArr);
    }

    const removeTagItem = (idx) => {
        if(tagList.current.length > 0) 
        {
            tagList.current = [...tagList.current.slice(0, idx),...tagList.current.slice(idx+1)];
            addTagTexts();
        }
    }

    const saveAndContinue = async () => {
        setShowLoading(true);
        fetch(AWS_URL + '/Veteran/Media/', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'media': {
                    VeteranId: await AsyncStorage.getItem(REACT_APP_CURRENT_VETERANID),
                    IsProfile: isProfile,
                    Comments: caption,
                    Tags: tagList.current.join("||"),
                    ImageStr: imageSource, 
                    Height: route.params.imageHeight,
                    Width: route.params.imageWidth
                }
            })
        })
        .then((response) => response.text())
        .then(async data => { 
            if(JSON.parse(data).error || data.message) {
                showErrorMessage("Save failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                setShowLoading(false);
                return false;
            }

            if(JSON.parse(data).IsOwn && isProfile) {
                let user = JSON.parse(await AsyncStorage.getItem(REACT_APP_LOGIN_TOKEN));
                user.Profile.UserImage = imageSource;
                await AsyncStorage.setItem(REACT_APP_LOGIN_TOKEN, JSON.stringify(user));
            }

            setShowLoading(false);
            showOkMessage("Veteran media saved","The veteran information has uploaded correctly");
            navigateToScreen(navigation, 'UploadMediaVeteran');    
        })
        .catch(function(error) {
            console.log(error);
            setShowLoading(false);
            showErrorMessage("Save failed. Please try again","There was an error while trying to upload the veteran media")
        });
    }

    const startRecord = async() => {
        await Voice.start('en-US');
    }

    const stopRecord = async (setFunction) => {
        await Voice.stop();
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.scene} contentContainerStyle={{alignItems: "center"}} >
                <Spinner visible={showLoading} textContent={"Saving media..."} overlayColor={'#00448188'} color={'black'} />
                <Image source={{uri: 'data:image/jpg;base64,' + imageSource}} height={imageHeight} width={imageWidth}
                    style={[styles.preview, { height: imageHeight, width: imageWidth}]}></Image>
                <View style={{width:'80%', alignItems:'flex-start'}}>
                    <Text style={[styles.message,{fontWeight:'bold'}]}>Add a caption to your media</Text>
                </View>
                <View style={styles.textButtonRow}>
                    <TextInput placeholder={'Tell us about your media'} value={caption} multiline={true} onChangeText={setCaption} style={[styles.description,{height: 100, width:'87%'}]}></TextInput>
                    {/* <TouchableOpacity style={styles.roundButton} onPressIn={startRecord} onPressOut={() => { stopRecord(setCaption) }}>
                        <Icon name="mic" size={25} color="#004481" />
                    </TouchableOpacity> */}
                </View>
                <View style={{width:'90%', alignItems:'flex-start'}}>
                    <CheckBox containerStyle={styles.checkbox} onPress={()=>{setIsprofile(!isProfile)}} checked={isProfile} checkedColor={'white'} title={
                        <Text style={styles.messageCheckbox}>Use this as profile picture</Text>}>
                    </CheckBox>
                </View>
                <Text style={[styles.message,{fontWeight:'bold', marginTop:20}]}>Tag your media</Text>
                <Text style={[styles.message,{textAlign:'center', marginTop:-5, marginBottom:20}]}>(names, service branch, engagement,{'\n'}year, equipment, location, etc.)</Text>
                <View style={styles.textButtonRow}>
                    <TextInput placeholder={'Choose your tags'} maxLength={56} style={[styles.description,{height:40,width:'87%'}]} onSubmitEditing={addTagItem}></TextInput>
                    <TouchableOpacity style={[styles.roundButton, {marginTop:0}]}>
                        <Icon name="mic" size={25} color="#004481" />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row', alignItems:'flex-start', flexWrap: 'wrap', width:'80%', margin:5, marginLeft:-10}}>
                {
                    tagListItems.map(tagItem => { return tagItem })
                }
                </View>
                <View style={styles.buttonArea}>
                    <TouchableOpacity style={[styles.button,{marginBottom:50, marginTop:30}]} onPress={saveAndContinue}>
                        <Text style={styles.buttonText}>Save {'\&'} Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scene: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor:'#004481',
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
        width: '50%',
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
    preview: {
        margin: 20,
    },
    description: {
        width: '90%',
        padding: 10,
        borderRadius:10,
        fontSize:16,
        backgroundColor: 'white',
        textAlignVertical: 'top',
    },
    textButtonRow: {
       width: '80%',
       flexDirection: 'row', 
    },
    roundButton: {
        height: 40, 
        width: 40,
        alignItems: 'center',
        padding: 5,
        paddingTop: 7,
        margin: 10,
        marginTop: 30,
        borderRadius: 25,
        backgroundColor: 'white',
    },
    tagSection: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius:5,
        marginLeft:5,
        marginTop:5,
        height:25,
        width: 95,
    },
    tagText: {
        fontFamily: 'Nunito',
        fontSize:14,
        padding:2,
        paddingLeft:8,
        color:'black',
        width:'80%',
    },
    tagIcon: {
        paddingRight: 4,
        paddingTop: 4,
    },
    checkbox:{
        backgroundColor:'transparent',
        borderWidth: 0,
    },
    messageCheckbox: {
        fontFamily: 'SourceSansPro',
        fontSize: 18, 
        color: 'white',
        textAlign: 'left',
    },
  });
  
export default PreviewVetScreen;
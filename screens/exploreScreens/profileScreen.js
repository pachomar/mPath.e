import React from 'react';
import YouTube from 'react-native-youtube';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOSCodes } from '../../helpers/enums';
import { isLoggedUser } from '../../helpers/globals';
import { navigateToScreen, showErrorMessage } from '../../helpers/navigation';
import { REACT_APP_CURRENT_VETERANID, AWS_URL } from '@env';
import { Collapse, CollapseHeader, CollapseBody} from 'accordion-collapse-react-native';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, RecyclerViewBackedScrollViewBase } from 'react-native';

const ProfileScreen = ({ navigation }) => { 
    const [showLoading, setShowLoading] = React.useState(true);
    const [loadOpacity, setLoadOpacity] = React.useState(1);
    const [insigniaHeight, setInsigniaHeight] = React.useState(70);

    const [branch, setBranch] = React.useState('');
    const [name, setName] = React.useState('');
    const [profile, setProfile] = React.useState('');
    const [rank, setRank] = React.useState('');
    const [enlistYear, setEnlistYear] = React.useState(null);
    const [completedYear, setCompletedYear] = React.useState(null);
    const [imgBranch, setImageBranch] = React.useState('');
    const [imgInsignia, setImgInsignia] = React.useState('');
    const [insigniaH, setInsigniaH] = React.useState(70);
    const [insigniaW, setInsigniaW] = React.useState(70);
    const [imgInsignia2, setImgInsignia2] = React.useState('');
    const [insignia2H, setInsignia2H] = React.useState(70);
    const [insignia2W, setInsignia2W] = React.useState(70);
    const [imgInsignia3, setImgInsignia3] = React.useState('');
    const [insignia3H, setInsignia3H] = React.useState(70);
    const [insignia3W, setInsignia3W] = React.useState(70);
    const [entryPlace, setEntryplace] = React.useState(null);
    const [separationStatus, setSeparationStatus] = React.useState(null);
    const [isDeceased, setDeceased] = React.useState(false);
    const [deathCause, setDeathCause] = React.useState('');
    const [burialPlace, setBurialPlace] = React.useState('');
    const [engagements, setEngagements] = React.useState([]);
    const [mosCodes, setMOSCodes] = React.useState([]);
    const [units, setUnits] = React.useState([]);
    const [awards, setAwards] = React.useState([]);
    const [badges, setBadges] = React.useState([]);
    const [mediaPreview, setMediaPreview] = React.useState([]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            loadVeteranProfile();
        })
        return unsubscribe;
    }, [navigation]);

    const loadVeteranProfile = async () => {
        setShowLoading(true);
        let vetId = await AsyncStorage.getItem(REACT_APP_CURRENT_VETERANID);

        fetch(AWS_URL + '/Veteran/Profile?veteranId=' + vetId + '&images=true')
        .then((response) => response.text())
        .then(data => { 
            if(JSON.parse(data).error || data.message) {
                showErrorMessage("Profile load failed. Please try again", JSON.parse(data).error ? JSON.parse(data).error : data.message);
                setShowLoading(false);
                return false;
            }

            data = JSON.parse(data);

            setBranch(data.Branch);
            setName(data.FirstName + (data.MiddleName != null ? ' ' + data.MiddleName : '') + ' ' + data.LastName);
            setProfile(data.Profile);
            setRank(data.Rank);
            setEnlistYear(data.EnlistYear);
            setCompletedYear(data.CompletedYear);
            setImageBranch(data.BranchLogo != null ? data.BranchLogo : '');

            if(data.Insignia != null) { 
                if(data.Insignia2 != null) {
                    if(data.Insignia3 != null)
                    {
                        let h1 = (50 / data.InsigniaW).toFixed(2);
                        let h2 = (50 / data.Insignia2W).toFixed(2);
                        let h3 = (50 / data.Insignia3W).toFixed(2);
                        let highest = data.InsigniaH > data.Insignia2H ? (data.InsigniaH > data.Insignia3H ? data.InsigniaH : data.Insignia3H) : (data.Insignia2H > data.Insignia3H ? data.Insignia2H : data.Insignia3H);
                        
                        setInsigniaHeight(highest == h1 ? Math.round(data.InsigniaH * h1) : (highest == h2 ? Math.round(data.Insignia2H * h2) : Math.round(data.Insignia3H * h3)));
                        setInsigniaH(data.InsigniaH != null ? Math.round(data.InsigniaH * h1) : 70);
                        setInsigniaW(data.InsigniaW != null ? Math.round(data.InsigniaW * h1) : 70);
                        setInsignia2H(data.Insignia2H != null ? Math.round(data.Insignia2H * h2) : 70);
                        setInsignia2W(data.Insignia2W != null ? Math.round(data.Insignia2W * h2) : 70);
                        setInsignia3H(data.Insignia3H != null ? Math.round(data.Insignia3H * h3) : 70);
                        setInsignia3W(data.Insignia3W != null ? Math.round(data.Insignia3W * h3) : 70);
                    }
                    else
                    {
                        let d1 = data.InsigniaW > 70 ? (70 / data.InsigniaW).toFixed(2) : 1;
                        let d2 = (70 / data.Insignia2W).toFixed(2);
                        let highest = data.InsigniaH > data.Insignia2H ? data.InsigniaH : data.Insignia2H;

                        setInsigniaHeight(highest == data.InsigniaH ? Math.round(data.InsigniaH * d1) : Math.round(data.Insignia2H * d2) );
                        setInsigniaH(data.InsigniaH != null ? Math.round(data.InsigniaH * d1) : 70);
                        setInsigniaW(data.InsigniaW != null ? Math.round(data.InsigniaW * d1) : 70);
                        setInsignia2H(data.Insignia2H != null ? Math.round(data.Insignia2H * d2) : 70);
                        setInsignia2W(data.Insignia2W != null ? Math.round(data.Insignia2W * d2) : 70);
                    }
                }
                else
                {
                    let c1 = data.InsigniaW > 110 ? (110 / data.InsigniaW).toFixed(2) : 1;

                    setInsigniaHeight(data.InsigniaH != null ? Math.round(data.InsigniaH * c1) : 70);
                    setInsigniaH(data.InsigniaH != null ? Math.round(data.InsigniaH * c1) : 70);
                    setInsigniaW(data.InsigniaW != null ? Math.round(data.InsigniaW * c1) : 70);
                }
            }

            setImgInsignia(data.Insignia != null ? data.Insignia : '');
            setImgInsignia2(data.Insignia2 != null ? data.Insignia2 : '');
            setImgInsignia3(data.Insignia3 != null ? data.Insignia3 : '');
            setEntryplace((data.EntryCity != null ? data.EntryCity : '') + (data.EntryCity != null && data.EntryState != null ? ',':'') + (data.EntryCity != null ? ' ' : '') + (data.EntryState != null ? data.EntryState : ''));
            setSeparationStatus((data.Rank != null ? data.Rank : '') + (data.Rank != null && data.SeparationType != null ? ',':'') + (data.Rank != null ? ' ':'') + (data.SeparationType != null ? data.SeparationType : ''));
            setDeceased(data.IsDeceased);
            setDeathCause(data.DeathCause);
            setBurialPlace(data.BurialPlace);

            let arr = [];
            if(data.BadgeImgs && data.BadgeImgs.length > 0) {
                data.BadgeImgs.forEach((item, idx) => {
                    arr.push(<Image key={'bdg-'+ idx} style={{height:45, width:160, margin: 5, marginRight: 10}} height={45} width={160} source={{uri: 'data:image/jpg;base64,' + item.Img }}></Image>);
                });
                setBadges([...arr]);
            }

            setLoadOpacity(0.75);

            arr = [];
            if(data.Engagements && data.Engagements.length > 0) {
                arr.push(<Text key={'eng-top'} style={{marginTop:4}}></Text>);
                data.Engagements.forEach((item, idx) => {
                    arr.push(<Text key={'eng-' + idx} style={styles.bulletText}>{'\u2022' + " " + item.Engagement}</Text>);
                });
                arr.push(<Text key={'eng-bot'} style={{marginBottom:4}}></Text>);
                setEngagements([...arr]);
            }

            arr = [];
            if(data.MOSCodes && data.MOSCodes.length > 0) {
                arr.push(<Text key={'mos-top'} style={{marginTop:4}}></Text>);
                data.MOSCodes.forEach((item, idx) => {
                    arr.push(<Text key={'mos-' + idx} style={styles.bulletText}>{'\u2022' + " " + MOSCodes[item.MOSCodeId]}</Text>);
                });
                arr.push(<Text key={'mos-bot'} style={{marginBottom:4}}></Text>);
                setMOSCodes([...arr]);
            }

            arr = [];
            if(data.Units && data.Units.length > 0) {
                arr.push(<Text key={'unt-top'} style={{marginTop:4}}></Text>);
                data.Units.forEach((item, idx) => {
                    arr.push(<Text key={'unt-' + idx} style={styles.bulletText}>{'\u2022' + " " + item.Unit}</Text>);
                });
                arr.push(<Text key={'unt-bot'} style={{marginBottom:4}}></Text>);
                setUnits([...arr]);
            }

            arr = [];
            if(data.Awards && data.Awards.length > 0) {
                arr.push(<Text key={'awd-top'} style={{marginTop:4}}></Text>);
                data.Awards.forEach((item, idx) => {
                    arr.push(<Text key={'awd-' + idx} style={styles.bulletText}>{'\u2022' + " " + item.Award}</Text>);
                });
                arr.push(<Text key={'awd-bot'} style={{marginBottom:4}}></Text>);
                setAwards([...arr]);
            }
            
            setLoadOpacity(0.25);

            fetch(AWS_URL + '/Veteran/Story?veteranId=' + vetId )
            .then((response) => response.text())
            .then(media => { 
                if(media.error || media.message) {
                    showErrorMessage("Stories load failed. Please try again later", media.error ? media.error : media.message);
                    setShowLoading(false);
                    return false;
                }

                createMediaPreview(JSON.parse(media))
            })
            .catch(function(error) {
                console.log(error)
                showErrorMessage("Stories load failed. Please try again","There was an error while trying to load the veteran stoires");
                setShowLoading(false);
            });
        })
        .catch(function(error) {
            console.log(error)
            showErrorMessage("Profile load failed. Please try again","There was an error while trying to load the veteran information");
            setShowLoading(false);
        });
    }

    const createMediaPreview = (media) => {
        let preview = []; 
        media.forEach((item, idx) =>{
            if(!item.IsProfile) {
                preview.push(<View key={'media-view-' + idx}>
                        <Image key={'media-img-' + idx} style={{width:160,height:90, marginTop:20, marginLeft:15}} height={90} width={145} source={{uri: 'data:image/jpg;base64,' + item.ImageSrc}}></Image>
                        <Text ket={'media-txt-' + idx} style={[styles.message,{width:160,marginLeft:18}]}>{item.Comments != null ? item.Comments : ''}</Text>
                    </View>);
            }
        });

        setMediaPreview([...preview]);
        setShowLoading(false);
    }

    return (
        <SafeAreaView>
            <ScrollView style={{backgroundColor: 'white'}}>
                <View style={styles.topView}>
                    <Spinner visible={showLoading} textContent={"Loading profile"} overlayColor={'rgba(255,255,255,' + loadOpacity + ')'} color={'black'} />
                    <View style={{flexDirection:'row', marginTop:30}}>
                        <View style={{ width:'45%'}}>
                            { profile != '' ?
                                <Image style={[styles.profileImage,{marginLeft:20}]} height={120} width={120} source={{uri: 'data:image/jpg;base64,' + profile}} /> :
                                <Image style={[styles.profileImage,{marginLeft:20}]} height={120} width={120} source={require('../../images/no-profile.png')} />
                            }
                            <Text style={[styles.message,{fontWeight:'bold', marginTop:20}]}>{name}</Text>
                            <Text style={styles.message}>{rank}</Text>
                            {
                                enlistYear != null || completedYear != null ? 
                                <Text style={[styles.message,{marginTop:20}]}><Text style={{fontWeight:'bold'}}>Service: </Text>{enlistYear != null ? enlistYear : 'Unknown'} - {completedYear != null ? completedYear : 'Unknown'}</Text> : null
                            }
                        </View>
                        <View style={{ width:'50%', alignItems: 'center'}}>
                            <View>
                                <Image style={{width:120,height:120, marginBottom:15}} height={120} width={120} source={{uri: 'data:image/jpg;base64,' + imgBranch}}></Image>
                            </View>
                            <View style={{flexDirection: 'row', height: insigniaHeight, alignItems:'center', margin: 3}}>
                                {
                                    imgInsignia.length > 0 ? <Image style={{width:insigniaW,height:insigniaH, margin: 2}} height={insigniaH} width={insigniaW} source={{uri: 'data:image/jpg;base64,' + imgInsignia}}></Image> : null
                                }
                                {
                                    imgInsignia2.length > 0 ? <Image style={{width:insignia2W,height:insignia2H, margin: 2}} height={insignia2H} width={insignia2W} source={{uri: 'data:image/jpg;base64,' + imgInsignia2}}></Image> : null
                                }
                                {
                                    imgInsignia3.length > 0 ? <Image style={{width:insignia3W,height:insignia3H, margin: 2}} height={insignia3H} width={insignia3W} source={{uri: 'data:image/jpg;base64,' + imgInsignia3}}></Image> : null
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{width:'95%', flexDirection:'row', alignItems:'flex-start', flexWrap: 'wrap', marginLeft:35, marginTop: 20}}>
                        {
                            badges.map(item => { return item })
                        }
                    </View>
                    <View style={{width:'95%', alignItems:'flex-start', marginBottom:40}}>
                        {
                            entryPlace != '' ?
                            <View>
                                <Text style={[styles.message,{fontWeight:'bold', marginTop:20}]}>Place of Entry into Active Duty</Text>
                                <Text style={styles.message}>{entryPlace}</Text>
                            </View> : null
                        }
                        { 
                            separationStatus != '' ?
                            <View>
                                <Text style={[styles.message,{fontWeight:'bold'}]}>Status</Text>
                                <Text style={styles.message}>{separationStatus}</Text>
                            </View> : null
                        }
                        { 
                            isDeceased ?
                            <View>
                                {
                                   burialPlace != null ?
                                   <View>
                                        <Text style={[styles.message,{fontWeight:'bold'}]}>Place of Interment</Text>
                                        <Text style={styles.message}>{burialPlace}</Text> 
                                   </View> : null
                                }
                                {   deathCause != null ? 
                                    <View>
                                        <Text style={[styles.message,{fontWeight:'bold'}]}>Cause of Death</Text>
                                        <Text style={styles.message}>{deathCause}</Text>
                                    </View> : null
                                }
                                </View>  : null                       
                        }
                    </View>
                    <Collapse style={{width:'100%'}}>
                        <CollapseHeader style={styles.accordionHeader}>
                            <Text style={[styles.message,{fontWeight:'bold',color:'white'}]}>Military Occupation Specialty</Text>
                        </CollapseHeader>
                        <CollapseBody style={{alignItems:'center'}}>
                            {
                                mosCodes.map(item => { return item })
                            }
                        </CollapseBody>
                    </Collapse>
                    <Collapse style={{width:'100%',marginTop:1}}>
                        <CollapseHeader style={styles.accordionHeader}>
                            <Text style={styles.accordionText}>Training</Text>
                        </CollapseHeader>
                        <CollapseBody style={{alignItems:'center'}}>
                            <Text style={[styles.message,{fontWeight:'bold', marginTop:20,marginBottom:20}]}></Text>
                        </CollapseBody>
                    </Collapse>
                    <Collapse style={{width:'100%',marginTop:1}}>
                        <CollapseHeader style={styles.accordionHeader}>
                            <Text style={styles.accordionText}>Engagements</Text>
                        </CollapseHeader>
                        <CollapseBody style={{alignItems:'center'}}>
                            {
                                engagements.map(item => { return item })
                            }
                        </CollapseBody>
                    </Collapse>
                    <Collapse style={{width:'100%',marginTop:1}}>
                        <CollapseHeader style={styles.accordionHeader}>
                            <Text style={styles.accordionText}>Units</Text>
                        </CollapseHeader>
                        <CollapseBody style={{alignItems:'center'}}>
                            {
                                units.map(item => { return item })
                            }
                        </CollapseBody>
                    </Collapse>
                    <Collapse style={{width:'100%',marginTop:1}}>
                        <CollapseHeader style={styles.accordionHeader}>
                            <Text style={styles.accordionText}>Decorations</Text>
                        </CollapseHeader>
                        <CollapseBody style={{alignItems:'center'}}>
                            {
                                awards.map(item => { return item})
                            }
                        </CollapseBody>
                    </Collapse>
                    <Collapse style={{width:'100%',marginTop:1}}>
                        <CollapseHeader style={styles.accordionHeader}>
                            <Text style={styles.accordionText}>My Life {'\&'} Legacy</Text>
                        </CollapseHeader>
                        <CollapseBody style={{alignItems:'center'}}>
                            {/* <YouTube apiKey="AIzaSyD4SVAfN5V1aKXghDOziLFfqab3_p8B1wE" videoId="d32IKFahHI8" play={false} style={{ margin:20, width:'80%', height:180 }} /> */}
                            <View style={{alignItems:'flex-start', flexWrap: 'wrap', width:'95%', flexDirection:'row'}}> 
                            {
                                mediaPreview.map(media => { return media })
                            }
                            </View>
                        </CollapseBody>
                    </Collapse>
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
    },
    message: {
        fontFamily: 'SourceSansPro',
        fontSize: 16, 
        textAlign: 'left',
        color: 'black',
        marginLeft:20,
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
    bulletText: {
        fontFamily: 'SourceSansPro',
        fontSize: 16, 
        textAlign: 'left',
        color: 'black',
        marginLeft:20,
        width:'90%', 
    },
    profileImage: {
        height: 120,
        width: 120,
    }
  });
  
export default ProfileScreen;
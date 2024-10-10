import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Animated, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
var globalStyles = require('../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import UserService from '../services/userService';
import { DataTable } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import GoogleService from '../services/googleService';
import LoadingComponent from '../components/Loader';

export default class SummaryScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { fadeValue: new Animated.Value(1), posValue: new Animated.Value(10), user: null };
        this._isMounted = true;
        // this.openCameraImmediately = this.props.route.params.openCameraImmediately;

        //Get property details
        UserService.getUser().then((user) => {
            if (!user) {
                // Reset navigation
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Register' },
                        ],
                    })
                );
            }
            else {
                this.setState({ user: user });
            }
        })

        Animated.parallel([
            Animated.timing(this.state.posValue, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            })
        ]).start();
    }

    componentDidMount() {
        this._isMounted = false;
    }

    snap = async () => {
        let status = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status.status == 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
                base64: true
            });
            if (!result.cancelled) {
                // Get data
                this.setState({ loading: true });
                console.log("summary")
                GoogleService.GetCloudVision(result.base64).then((result) => {
                    this.setState({ loading: false }, () => {
                        if (result.responses[0].textAnnotations) {
                            this.props.navigation.navigate("Confirm", { item: result.responses[0].textAnnotations[0].description });
                        }
                        else {
                            Alert.alert(
                                "Oops!",
                                "We didn't quite catch that, please try taking the photo again",
                                [
                                    {
                                        text: "Okay",
                                    },
                                ],
                            );
                        }
                    });
                });
            }
        }
        else {
            Alert.alert(
                "Permission Required",
                "Munipal needs permission to your device's camera and photos, please allow by enabling it in Settings",
                [
                    {
                        text: "Okay",
                    },
                ],
            );
        }
    };

    render() {
        return (
            <View style={globalStyles.container}>
                {this.state.loading ? <LoadingComponent /> : <View></View>}

                <ScrollView style={globalStyles.container} keyboardShouldPersistTaps={'always'}>

                    <Animated.View style={{ flex: 1, opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>
                        <Text style={globalStyles.heading}>Scan Meter</Text>
                        <TouchableOpacity style={globalStyles.btn} onPress={() => this.snap()}>
                            <Text style={globalStyles.btnText}>Scan Meter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={globalStyles.btn} onPress={() => this.props.navigation.navigate("Failure")}>
                            <Text style={globalStyles.btnText}>Unable To Scan</Text>
                        </TouchableOpacity>

                        {
                            this.state.user ?
                                <View style={globalStyles.div}>
                                    <Text style={globalStyles.divTitle}>Property Summary</Text>
                                    <Text style={styles.textItem}>Address: {this.state.user.address}</Text>
                                    <Text style={styles.textItem}>Account Number: {this.state.user.accountNumber}</Text>
                                    <Text style={styles.textItem}>Email To Send Reading To: {this.state.user.emailToSendReadingTo}</Text>
                                    <Text style={styles.textItem}>ERF: {this.state.user.ERF}</Text>
                                    <Text style={styles.textItem}>tariff: R{this.state.user.tariff}</Text>
                                    <Text style={styles.textItem}>Utility Type: {this.state.user.utilityType}</Text>
                                </View>
                                :
                                <View></View>
                        }


                    </Animated.View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5
    },
    textItem: {
        padding: 10
    },
    reading: {
        fontSize: 50,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.dark,
        textAlign: "center",
        letterSpacing: 10
    }
});

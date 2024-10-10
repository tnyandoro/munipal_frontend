import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Animated, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
var globalStyles = require('../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import UserService from '../services/userService';
import { DataTable } from 'react-native-paper';
import MeterService from '../services/meterService';
import LoadingComponent from '../components/Loader';

export default class DetailScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { fadeValue: new Animated.Value(1), posValue: new Animated.Value(10), details: {}, loading: true, user: {} };
        this._isMounted = true;

        if (this.props.route.params.item) {
            this.item = this.props.route.params.item;
        }

        if (this.props.route.params.confirm) {
            this.confirm = true;
        }

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
                if (!this.confirm) {
                    console.log("clicked on existing item")
                    MeterService.getReadingDetails(this.item.id, user.id, user.tariff).then((r) => {
                        // Add two hours for sql timezone bug
                        r.data.date = new Date(r.data.date).setHours(new Date(r.data.date).getHours() + 2);
                        r.data.date = new Date(r.data.date).toISOString().slice(0, 19).replace('T', ' ')
                        this.setState({ details: r.data, loading: false, user: user });
                    });
                }
                else {
                    console.log("came from new reading")
                    this.setState({ details: this.item, loading: false, user: user });
                }
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

    SendEmail = () => {
        this.setState({ loading: true }, () => {
            MeterService.sendReadingEmail(this.state.user.id, this.state.details.reading, this.state.user.emailToSendReadingTo, this.state.details.utilityType, this.state.details.date).then((r) => {
                this.setState({ loading: false });
                Alert.alert(
                    "Great!",
                    "The details have been emailed",
                    [
                        {
                            text: "Okay",
                        },
                    ],
                );
            });
        });
    }

    Save = () => {
        this.setState({ loading: true }, () => {
            var image = {
                uri: this.state.details.photo,
                name: 'image.jpg',
                type: 'image/jpeg',
            };
            let formData = new FormData();
            formData.append("userID", this.state.user.id);
            formData.append("reading", this.state.details.reading);
            formData.append("emailToSendReadingTo", this.state.user.emailToSendReadingTo);
            formData.append("utilityType", this.state.details.utilityType);
            formData.append("file", image);

            MeterService.save(formData).then((r) => {
                this.setState({ loading: false });
                if (r.status == "success") {
                    Alert.alert(
                        "Great!",
                        "The reading has been saved",
                        [
                            {
                                text: "Okay",
                            },
                        ],
                    );
                    this.props.navigation.navigate("List")
                }
            });
        });

    }

    render() {
        return (
            <View style={globalStyles.container}>
                {this.state.loading ? <LoadingComponent /> : <View></View>}
                <ScrollView style={globalStyles.container} keyboardShouldPersistTaps={'always'}>

                    <Animated.View style={{ flex: 1, opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>

                        <View style={globalStyles.div}>
                            <Text style={styles.textItemBlue}>Date</Text>
                            <Text style={styles.textItem}>{this.state.details.date}</Text>
                            <Text style={styles.textItemBlue}>Previous Reading</Text>
                            <Text style={styles.textItem}>{this.state.details.prev}</Text>
                            <Text style={styles.textItemBlue}>Current Reading</Text>
                            <Text style={styles.textItem}>{this.state.details.reading}</Text>
                            <Text style={styles.textItemBlue}>Consumption</Text>
                            <Text style={styles.textItem}>{this.state.details.consumption}</Text>
                            <Text style={styles.textItemBlue}>Tariff</Text>
                            <Text style={styles.textItem}>{this.state.details.tariff}</Text>
                            <Text style={styles.textItemBlue}>Expected Charge</Text>
                            <Text style={styles.textItem}>{this.state.details.charge}</Text>
                            <Image source={{ uri: this.state.details.photo }} style={styles.logo}></Image>
                        </View>

                        {
                            this.confirm ?
                                <TouchableOpacity style={styles.btnBlue} onPress={() => this.Save()}>
                                    <Text style={globalStyles.btnText}>Save</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.btnBlue} onPress={() => this.SendEmail()}>
                                    <Text style={globalStyles.btnText}>Send Email</Text>
                                </TouchableOpacity>
                        }

                    </Animated.View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    textItem: {
        padding: 10,
        fontFamily: "comfortaa",
    },
    textItemBlue: {
        padding: 10,
        fontFamily: "comfortaa",
        color: Colors.blue,
        fontSize: 20
    },
    logo: {
        height: 100,
        width: '100%',
        alignSelf: "center",
        margin: 10,
        borderRadius: 5
    },
    btnBlue: {
        backgroundColor: Colors.blue,
        margin: 10,
        borderRadius: 5,
        padding: 10,
        flex: 1
    },
    cell: {
        width: 200,
        fontFamily: "comfortaa",
    },
    cellReading: {
        width: 150,
        fontFamily: "comfortaa",
    },
});

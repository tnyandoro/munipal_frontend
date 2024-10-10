import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Animated, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
var globalStyles = require('../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import UserService from '../services/userService';
import { DataTable } from 'react-native-paper';
import MeterService from '../services/meterService';
import LoadingComponent from '../components/Loader';


export default class ConfirmScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { fadeValue: new Animated.Value(1), posValue: new Animated.Value(10), newNumber: null, user: null, loading: false };
        this._isMounted = true;
        this.arr = [];
        if (this.props.route.params.item && this.props.route.params.utilityType) {
            this.item = this.props.route.params.item;
            this.item = this.item.replace(/[^0-9]/g, '');
            this.arr = this.item.split("");

            this.utilityType = this.props.route.params.utilityType;
            this.photo = this.props.route.params.photo;
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
                this.setState({ user: user });
            }
        });

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

    Details() {
        this.setState({ loading: true });
        if (this.state.newNumber) {

            var formattedDate = new Date().setHours(new Date().getHours() + 2);

            MeterService.getLatestReading(this.state.user.id, this.state.user.tariff, this.state.newNumber, this.props.route.params.utilityType).then((previousReading) => {

                if (previousReading.status == "success") {

                    var d = {
                        utilityType: previousReading.data.utilityType,
                        photo: this.photo,
                        reading: previousReading.data.reading,
                        date: previousReading.data.date,
                        prev: previousReading.data.prev,
                        consumption: previousReading.data.consumption,
                        charge: previousReading.data.charge,
                        tariff: previousReading.data.tariff
                    }
                    this.setState({ loading: false });
                    this.props.navigation.navigate("Detail", { item: d, confirm: true });
                }
                else {
                    Alert.alert(
                        "Oops!",
                        previousReading.status,
                        [
                            {
                                text: "Okay",
                            },
                        ],
                    );
                    this.setState({ loading: false });
                }
            });
        }
        else {
            var string = this.arr.toString();
            string = string.replace(/[^0-9]/g, '');

            var formattedDate = new Date().setHours(new Date().getHours() + 2);

            MeterService.getLatestReading(this.state.user.id, this.state.user.tariff, string, this.props.route.params.utilityType).then((previousReading) => {

                if (previousReading.status == "success") {

                    var d = {
                        utilityType: previousReading.data.utilityType,
                        photo: this.photo,
                        reading: previousReading.data.reading,
                        date: previousReading.data.date,
                        prev: previousReading.data.prev,
                        consumption: previousReading.data.consumption,
                        charge: previousReading.data.charge,
                        tariff: previousReading.data.tariff
                    }
                    this.setState({ loading: false });
                    this.props.navigation.navigate("Detail", { item: d, confirm: true });
                }
                else {
                    Alert.alert(
                        "Oops!",
                        previousReading.status,
                        [
                            {
                                text: "Okay",
                            },
                        ],
                    );
                    this.setState({ loading: false });
                }
            });
        }
    }

    render() {
        return (
            <View style={globalStyles.container}>
                {this.state.loading ? <LoadingComponent /> : <View></View>}

                <Animated.View style={{ flex: 1, opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>
                    {
                        this.arr.length > 0 ?
                            <View>
                                <Text style={globalStyles.heading}>Confirm the number that you see</Text>
                                <View style={globalStyles.div}>
                                    <View style={styles.numberholder}>
                                        <View style={globalStyles.rowEven}>
                                            {
                                                this.arr.map((item, key) => {
                                                    return (
                                                        <Text key={key} style={styles.number}>{item}</Text>
                                                    );
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>

                                <View style={globalStyles.div}>
                                    <Text style={globalStyles.heading}>If not, enter the number correctly:</Text>
                                    <TextInput
                                        style={styles.input}
                                        allowFontScaling={false}
                                        returnKeyType={"done"}
                                        autoCapitalize={"none"}
                                        keyboardType={"number-pad"}
                                        placeholderTextColor={"#ccc"}
                                        onChangeText={(text) => this.setState({ newNumber: text })}
                                        onSubmitEditing={() => this.Details()}
                                        value={this.state.newNumber} />
                                </View>

                                <TouchableOpacity style={globalStyles.btn} onPress={() => this.Details()}>
                                    <Text style={globalStyles.btnText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View>
                                <Text style={globalStyles.heading}>Something is wrong, please go back and try can the meter again</Text>

                            </View>
                    }


                </Animated.View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    numberholder: {
        marginVertical: 20
    },
    number: {
        padding: 5,
        borderColor: "black",
        borderRadius: 50,
        borderWidth: 1,
        height: 30,
        width: 30,
        alignSelf: 'center',
        fontSize: 14,
        textAlign: "center"
    },
    input: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
        margin: 10,
    },
});

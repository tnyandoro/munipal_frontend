import React from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Alert, Animated, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
var globalStyles = require('../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import UserService from '../services/userService';
import { DataTable } from 'react-native-paper';
import MeterService from '../services/meterService';
import LoadingComponent from '../components/Loader';
import { Picker } from '@react-native-picker/picker';

export default class AccountDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fadeValue: new Animated.Value(1),
            posValue: new Animated.Value(10),
            user: null,
            loading: false,
            address: "",
            accountNumber: "",
            emailToSendReadingTo: "",
            ERF: "",
            tariff: null,
            utilityType: "",
        };
        this._isMounted = true;

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
                this.setState({
                    user: user,
                    address: user.address,
                    accountNumber: user.accountNumber,
                    emailToSendReadingTo: user.emailToSendReadingTo,
                    ERF: user.ERF,
                    tariff: user.tariff,
                    utilityType: user.utilityType
                });
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

    Save = () => {
        this.setState({ loading: true }, () => {
            UserService.updateAccountDetails(
                this.state.user.id,
                this.state.address,
                this.state.accountNumber,
                this.state.emailToSendReadingTo,
                this.state.ERF,
                this.state.tariff,
                this.state.utilityType
            )
                .then((r) => {
                    // Get latest user details
                    UserService.getDetailsByID(this.state.user.id).then((login) => {
                        // Update local user
                        UserService.Save(login.data).then(() => {

                            Alert.alert(
                                "Great!",
                                "Account details have been updated",
                                [
                                    {
                                        text: "Ok",
                                    },
                                ],
                            );
                            this.setState({ loading: false }, () => { this.props.navigation.navigate('List'); })
                        });
                    });
                })
        })
    }

    render() {
        return (
            <View style={globalStyles.container}>
                {this.state.loading ? <LoadingComponent /> : <View></View>}

                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
                    <ScrollView keyboardShouldPersistTaps={'handled'}>

                        <Animated.View style={{ flex: 1, opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>
                            {
                                this.state.user ?
                                    <View>
                                        <View style={globalStyles.div}>

                                            <Text style={globalStyles.divTitle}>Address</Text>
                                            <TextInput
                                                ref={(input) => { this.addInput = input; }}
                                                style={styles.input}
                                                allowFontScaling={false}
                                                returnKeyType={"next"}
                                                placeholderTextColor={"#ccc"}
                                                placeholder={"Optional"}
                                                onChangeText={(text) => this.setState({ address: text })}
                                                onSubmitEditing={() => this.accountINpuit.focus()}
                                                value={this.state.address} />
                                            <Text style={globalStyles.divTitle}>Account Number</Text>
                                            <TextInput
                                                ref={(input) => { this.accountINpuit = input; }}
                                                style={styles.input}
                                                allowFontScaling={false}
                                                returnKeyType={"next"}
                                                placeholderTextColor={"#ccc"}
                                                placeholder={"Optional"}
                                                onChangeText={(text) => this.setState({ accountNumber: text })}
                                                onSubmitEditing={() => this.emailReadinInput.focus()}
                                                value={this.state.accountNumber} />
                                            <Text style={globalStyles.divTitle}>Email To Send Reading To</Text>
                                            <TextInput
                                                ref={(input) => { this.emailReadinInput = input; }}
                                                style={styles.input}
                                                allowFontScaling={false}
                                                returnKeyType={"next"}
                                                placeholderTextColor={"#ccc"}
                                                placeholder={"Optional"}
                                                onChangeText={(text) => this.setState({ emailToSendReadingTo: text })}
                                                onSubmitEditing={() => this.erfINput.focus()}
                                                value={this.state.emailToSendReadingTo} />
                                            <Text style={globalStyles.divTitle}>ERF</Text>
                                            <TextInput
                                                ref={(input) => { this.erfINput = input; }}
                                                style={styles.input}
                                                allowFontScaling={false}
                                                returnKeyType={"next"}
                                                placeholderTextColor={"#ccc"}
                                                placeholder={"Optional"}
                                                onChangeText={(text) => this.setState({ ERF: text })}
                                                onSubmitEditing={() => this.tariffInput.focus()}
                                                value={this.state.ERF} />
                                            <Text style={globalStyles.divTitle}>tariff (R)</Text>
                                            <TextInput
                                                ref={(input) => { this.tariffInput = input; }}
                                                style={styles.input}
                                                keyboardType={"decimal-pad"}
                                                allowFontScaling={false}
                                                returnKeyType={"next"}
                                                placeholderTextColor={"#ccc"}
                                                placeholder={"Optional"}
                                                onChangeText={(text) => this.setState({ tariff: text })}
                                                value={this.state.tariff} />
                                            <Text style={globalStyles.divTitle}>Utility</Text>
                                            <View style={styles.input}>
                                                <Picker
                                                    selectedValue={this.state.utilityType}
                                                    style={{ padding: 10, color: "black", fontFamily: "comfortaa", }}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.setState({ utilityType: itemValue })
                                                    }>
                                                    <Picker.Item label="Optional" value="Optional" />
                                                    <Picker.Item label="Water" value="Water" />
                                                    <Picker.Item label="Electricity" value="Electricity" />
                                                    <Picker.Item label="Electricity and Water" value="Electricity and Water" />
                                                </Picker>
                                            </View>
                                        </View>

                                        <TouchableOpacity style={globalStyles.btn} onPress={() => this.Save()}>
                                            <Text style={globalStyles.btnText}>Update</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View>
                                        <Text style={globalStyles.heading}>Something is wrong, please go back and try can the meter again</Text>
                                    </View>
                            }


                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        color: "black"

    },
});

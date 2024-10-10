import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Animated, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
var globalStyles = require('../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import UserService from '../services/userService';
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import FailureService from '../services/failureService';
import LoadingComponent from '../components/Loader';

export default class FailureScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { fadeValue: new Animated.Value(1), posValue: new Animated.Value(10), reason: 'Property Locked', user: null, loading: false };
        this._isMounted = true;

        Animated.parallel([
            Animated.timing(this.state.posValue, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            })
        ]).start();

        // Checked if logged in
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
    }

    componentDidMount() {
        this._isMounted = false;
    }

    confirm = () => {
        this.setState({ loading: true });
        FailureService.confirm(this.state.user.id, this.state.reason).then((r) => {
            this.setState({ loading: false });
            if (r.status == "success") {
                this.props.navigation.navigate("List");
            }
        });
    }

    render() {
        return (
            <View style={globalStyles.container}>
                {this.state.loading ? <LoadingComponent /> : <View></View>}

                <ScrollView style={globalStyles.container} keyboardShouldPersistTaps={'always'}>

                    <Animated.View style={{ flex: 1, opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>
                        <Text style={globalStyles.heading}>Unable To Scan Meter</Text>

                        <View style={globalStyles.div}>
                            <Text style={globalStyles.divTitle}>Select a failure reason</Text>
                            <Picker
                                selectedValue={this.state.reason}
                                style={{ height: 50 }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ reason: itemValue })
                                }>
                                <Picker.Item label="Property Locked" value="Property Locked" />
                                <Picker.Item label="Dogs on Property" value="Dogs on Property" />
                                <Picker.Item label="Customer Instruction" value="Customer Instruction" />
                                <Picker.Item label="Damaged Meter" value="Damaged Meter" />
                                <Picker.Item label="Obsctruction" value="Obsctruction" />
                                <Picker.Item label="Meter Inaccessible" value="Meter Inaccessible" />
                            </Picker>
                        </View>

                        {/* <View style={globalStyles.div}>
                            <Text style={globalStyles.divTitle}>Projected average reading</Text>
                            <Text style={globalStyles.divBody}>Please provide info</Text>
                            <Text style={globalStyles.divBody}>Please provide info</Text>
                        </View> */}


                        <TouchableOpacity style={globalStyles.btn} onPress={() => this.confirm()}>
                            <Text style={globalStyles.btnText}>Confirm</Text>
                        </TouchableOpacity>
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
        padding: 10,
        fontFamily: "comfortaa",
    }
});

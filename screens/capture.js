import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Animated, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
var globalStyles = require('../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import UserService from '../services/userService';
import { DataTable } from 'react-native-paper';


export default class CaptureScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { fadeValue: new Animated.Value(1), posValue: new Animated.Value(10) };
        this._isMounted = true;
        this.item = this.props.route.params.item;
        console.log(this.item)

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

    render() {
        return (
            <ScrollView style={globalStyles.container} keyboardShouldPersistTaps={'always'}>
                <Animated.View style={{ flex: 1, opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>
                    <Text style={globalStyles.heading}>Property Summary</Text>
                    <Text style={styles.textItem}>ERF no.: {this.item.er}</Text>
                    <Text style={styles.textItem}>Address: {this.item.address}</Text>
                    <Text style={styles.textItem}>Meter No: {this.item.er}</Text>
                    <Text style={styles.textItem}>Start Reading: {this.item.er}</Text>
                    <Text style={styles.textItem}>End Reading: {this.item.er}</Text>
                    <Text style={styles.textItem}>Consumption: {this.item.er}</Text>
                    <Text style={styles.textItem}>Tariff: {this.item.er}</Text>
                    <Text style={styles.textItem}>Prjected billing for month end: {this.item.er}</Text>
                    <Text style={styles.textItem}>R0.00</Text>

                    <TouchableOpacity style={globalStyles.btn} onPress={() => this.props.navigation.navigate("Dispute", { item: this.item })}>
                        <Text style={globalStyles.btnText}>Dispute</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
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

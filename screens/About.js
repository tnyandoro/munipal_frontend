import React from 'react';
import { StyleSheet, Text, View, ScrollView, Linking, Image, TouchableOpacity, Alert, Animated } from 'react-native';
var globalStyles = require('../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { CommonActions } from '@react-navigation/routers';
import UserService from '../services/userService';

export default class AboutScreen extends React.Component {

  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = { fadeValue: new Animated.Value(1), posValue: new Animated.Value(10) };

    Animated.parallel([
      Animated.timing(this.state.posValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  ShowPopup = navigation => {
    Alert.alert(
      "Add a card",
      "How you would like to add a new card?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Scan barcode",
          onPress: () => navigation.navigate('Add a card', { scan: true }),
        },
        {
          text: "Card number (No barcode on card)",
          onPress: () => navigation.navigate('Add a card', { scan: false }),
        },
      ],
    );
  }

  Logout = () => {
    UserService.Logout().then(() => {
      // Reset navigation
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Landing' },
          ],
        })
      );
    })
  }

  render() {
    return (
      <ScrollView style={globalStyles.container} keyboardShouldPersistTaps={'always'}>

        <Animated.View style={{ flex: 1, opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>

          <Image source={require("../assets/logo_wtext.png")} style={styles.logo}></Image>
          <View style={globalStyles.div}>
            <Text style={globalStyles.divTitle}>Version</Text>
            <Text style={globalStyles.divBody}>{Constants.manifest.version}</Text>
          </View>

          {/* <View style={globalStyles.div}>
            <Text style={globalStyles.divTitle}>About Munipal</Text>
            <Text style={globalStyles.divBody}>Please provide info</Text>
          </View> */}

          <View style={globalStyles.div}>
            <Text style={globalStyles.divTitle}>Account</Text>
            <TouchableOpacity style={globalStyles.btn} onPress={() => this.props.navigation.navigate('Account Details')}>
              <Text style={globalStyles.btnText}>Account Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.btn} onPress={() => this.Logout()}>
              <Text style={globalStyles.btnText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* <View style={globalStyles.div}>
            <Text style={globalStyles.divTitle}>Feedback</Text>
            <Text style={globalStyles.divBody}>Like or dislike Munipal? Give us some feedback!</Text>
            <TouchableOpacity style={globalStyles.btn} onPress={() => StoreReview.requestReview()}>
              <Text style={globalStyles.btnText}>Leave Review</Text>
            </TouchableOpacity>
          </View> */}



          <View style={globalStyles.div}>
            <Text style={globalStyles.divTitle}>Terms and conditions</Text>
            <Text style={globalStyles.divBody}>By using this app, you are agreeing to the Terms and Conditions, Privacy Policy</Text>
            <Text allowFontScaling={false} style={globalStyles.divBody} onPress={() => Linking.openURL('https://www.qwertsy.co.za')}>
              <Ionicons name={'logo-chrome'} size={15} color={"grey"} /> Terms and Conditions, Privacy Policy</Text>
          </View>

          <View style={globalStyles.div}>
            <Text style={styles.center}>This app has been developed by Qwertsy Pty Ltd</Text>
          </View>

        </Animated.View>

      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
    alignSelf: "center",
    margin: 10,
    borderRadius: 5
  },
  center: {
    margin: 5,
    marginVertical: 10,
    fontFamily: "comfortaa",
    color: "grey",
    textAlign: "center",

  }
});

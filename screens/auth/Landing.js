import React from 'react';
import { StyleSheet, Text, View, Alert, ImageBackground, Image, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView, ScrollView } from 'react-native';
var globalStyles = require('../../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import UserService from '../../services/userService';
import LoadingComponent from '../../components/Loader';
import Constants from 'expo-constants';
import { CommonActions } from '@react-navigation/routers';

export default class LandingScreen extends React.Component {

  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = { fadeValue: new Animated.Value(0), posValue: new Animated.Value(10) };

    // Checked if logged in
    UserService.getUser().then((user) => {
      if (user) {
        // Reset navigation
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'List' },
            ],
          })
        );
      }
    });

    Animated.parallel([
      Animated.timing(this.state.fadeValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
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

  render() {
    return (
      <ImageBackground source={require("../../assets/bk.jpg")} style={globalStyles.containerCenter}>

        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
          <ScrollView keyboardShouldPersistTaps={'handled'}>

            <Animated.View style={{ flex: 1, flexDirection: "column", justifyContent: "center", opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>

              <Image source={require("../../assets/icon.png")} style={styles.logo}></Image>
              <Text style={styles.title}>Welcome</Text>

              <TouchableOpacity style={globalStyles.btn} onPress={() => this.props.navigation.navigate("Login")} >
                <Text style={globalStyles.btnText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={globalStyles.btn} onPress={() => this.props.navigation.navigate("Register")} >
                <Text style={globalStyles.btnText}>Register</Text>
              </TouchableOpacity>

            </Animated.View>

          </ScrollView>

        </KeyboardAvoidingView>

      </ImageBackground>
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
  title: {
    textAlign: "center",
    fontFamily: "comfortaa",
    fontSize: 30,
    color: "#fff"
  },
  link: {
    margin: 10,
    fontFamily: "comfortaa",
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    padding: 10
  },
  label: {
    margin: 5,
    marginVertical: 10,
    fontFamily: "comfortaa",
    color: "#fff"
  },
  input: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 10,
    fontFamily: "comfortaa",
    color: "#fff"
  },
});

import React from 'react';
import { StyleSheet, Text, View, Alert, ImageBackground, Image, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView, ScrollView } from 'react-native';
var globalStyles = require('../../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import UserService from '../../services/userService';
import LoadingComponent from '../../components/Loader';
import Constants from 'expo-constants';
import { CommonActions } from '@react-navigation/routers';

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = { email: "", password: "", loading: false, fadeValue: new Animated.Value(0), posValue: new Animated.Value(10) };

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

  Login = () => {
    this._isMounted && this.setState({ loading: true }, () => {
      // Get unique device id for login sesison
      UserService.login(this.state.email, this.state.password).then((r) => {
        // Clear All Dummy Cards
        if (r.status == "success") {
          UserService.Save(r.data).then(() => {
            // Reset navigation
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'List' },
                ],
              })
            );
          })
        }
        else {
          this._isMounted && this.setState({ loading: false })
          Alert.alert(
            "Oops!",
            "Email/password is incorrect",
            [
              {
                text: "Ok",
              },
            ],
          );
        }
      })
    });
  }


  render() {
    return (
      <ImageBackground source={require("../../assets/bk.jpg")} style={globalStyles.containerCenter}>
        {this.state.loading ? <LoadingComponent /> : <View></View>}

        <TouchableOpacity onPress={() => this._isMounted && this.props.navigation.goBack()} style={globalStyles.closeBtn}>
          <Ionicons name="md-arrow-back" size={30} color={"#fff"} />
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
          <ScrollView keyboardShouldPersistTaps={'handled'}>

            <Animated.View style={{ flex: 1, flexDirection: "column", justifyContent: "center", opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>

              <Image source={require("../../assets/icon.png")} style={styles.logo}></Image>
              <Text style={styles.title}>Login</Text>


              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                allowFontScaling={false}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                placeholder={"Johndoe@gmail.com"}
                placeholderTextColor={"#ccc"}
                onChangeText={(text) => this.setState({ email: text })}
                onSubmitEditing={() => this.paddInput.focus()}
                value={this.state.email} />
              <Text style={styles.label}>Password</Text>
              <TextInput
                ref={(input) => { this.paddInput = input; }}
                style={styles.input}
                allowFontScaling={false}
                secureTextEntry={true}
                returnKeyType={"next"}
                placeholderTextColor={"#ccc"}
                placeholder={"TryingToRemember"}
                onChangeText={(text) => this.setState({ password: text })}
                onSubmitEditing={() => this.Login()}
                value={this.state.password} />
              <TouchableOpacity style={globalStyles.btn} onPress={() => this.Login()} >
                <Text style={globalStyles.btnText}>Login</Text>
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.link} onPress={() => this._isMounted && this.props.navigation.navigate("ForgotPassword")}>
                Forgot Password?</Text>

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

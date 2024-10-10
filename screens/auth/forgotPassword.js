import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View, ImageBackground, Alert, Animated, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image } from 'react-native';
import LoadingComponent from '../../components/Loader';
import UserService from '../../services/userService';
var globalStyles = require('../../constants/Styles');


export default class ForgotPasswordScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', token: '', askForToken: false, validated: false, loading: false, fadeValue: new Animated.Value(0), posValue: new Animated.Value(10) };

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

  ResetPassword = () => {
    this.setState({ loading: true }, () => { });
    UserService.ResetPassword(this.state.email, this.state.password).then((result) => {
      this.setState({ loading: false }, () => { });

      this.props.navigation.navigate('Login');

    }).catch(error => { });
  }

  ValidateToken = () => {
    this.setState({ loading: true }, () => { });
    UserService.VerifyPasswordResetToken(this.state.email, this.state.token).then((result) => {
      this.setState({ loading: false }, () => { });
      if (result.status != "success") {
        Alert.alert(
          'Oops !',
          result.status,
          [
            { text: 'OK' },
          ],
          { cancelable: false },
        );
      }
      else {
        this.setState({ validated: true });
      }
    }).catch(error => { });
  }

  Reset = () => {
    if (this.state.email.length > 0) {
      this.setState({ loading: true }, () => { });
      UserService.GenerateResetToken(this.state.email).then((result) => {
        this.setState({ loading: false }, () => { });
        if (result.status != "success") {
          Alert.alert(
            'Oops !',
            result.status,
            [
              { text: 'OK' },
            ],
            { cancelable: false },
          );
        }
        else {
          this.setState({ askForToken: true });
          Alert.alert(
            'Password reset',
            result.message,
            [
              { text: 'OK' },
            ],
            { cancelable: false },
          );
        }

      }).catch(error => { });
    }
    else {
      Alert.alert(
        'Oops!',
        'Please enter your email first',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
    }
  }

  render() {
    return (
      <ImageBackground source={require('../../assets/bk.jpg')} style={globalStyles.containerCenter}>
        {this.state.loading ? <LoadingComponent /> : <View></View>}

        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={globalStyles.closeBtn}>
          <Ionicons name="md-arrow-back" size={30} color={"#fff"} />
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
          <ScrollView keyboardShouldPersistTaps={'handled'}>

            <Animated.View style={{ flex: 1, flexDirection: "column", justifyContent: "center", opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>

              <Image source={require("../../assets/icon.png")} style={styles.logo}></Image>
              <Text style={styles.title}>Forgot Password</Text>
              {
                !this.state.askForToken && !this.state.validated ?
                  <View  >
                    <TextInput allowFontScaling={false} autoCapitalize='none' keyboardType={"email-address"} style={styles.input} placeholder="Email address" returnKeyType={"done"}
                      placeholderTextColor="white" onChangeText={(text) => this.setState({ email: text })} value={this.state.email} onSubmitEditing={() => this.Reset()} />

                    <TouchableOpacity style={globalStyles.btn} onPress={() => this.Reset()}>
                      <Text allowFontScaling={false} style={globalStyles.btnText}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View></View>
              }

              {
                this.state.askForToken && !this.state.validated ?
                  <View  >
                    <TextInput autoCapitalize='none' allowFontScaling={false} style={styles.input} placeholder="Password reset token" returnKeyType={"done"}
                      placeholderTextColor="white" onChangeText={(text) => this.setState({ token: text })} value={this.state.token} onSubmitEditing={() => this.ValidateToken()} />

                    <TouchableOpacity style={globalStyles.btn} onPress={() => this.ValidateToken()}>
                      <Text allowFontScaling={false} style={globalStyles.btnText}>Verify token</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View></View>
              }

              {
                this.state.askForToken && this.state.validated ?
                  <View  >
                    <TextInput autoCapitalize='none' allowFontScaling={false} style={styles.input} placeholder="New password" returnKeyType={"done"}
                      placeholderTextColor="white" onChangeText={(text) => this.setState({ password: text })} value={this.state.password} onSubmitEditing={() => this.ResetPassword()} />

                    <TouchableOpacity style={globalStyles.btn} onPress={() => this.ResetPassword()}>
                      <Text allowFontScaling={false} style={globalStyles.btnText}>Reset password</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View></View>
              }

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

    );
  }

}

ForgotPasswordScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
    alignSelf: "center",
    margin: 10,
    borderRadius: 5
  },
  container: {
    flex: 1,
    flexGrow: 1,
    height: "100%"
  },
  background: {
    width: "100%", height: "100%"
  },
  title: {
    alignSelf: "center",
    color: "white",
    fontSize: 40,
    marginBottom: 50,
    fontFamily: "comfortaa"
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

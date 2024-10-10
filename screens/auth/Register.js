import React from 'react';
import { StyleSheet, Text, View, Alert, Image, TouchableOpacity, TextInput, ImageBackground, Animated, KeyboardAvoidingView, Linking, ScrollView, Platform, StatusBar } from 'react-native';
var globalStyles = require('../../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import UserService from '../../services/userService';
import LoadingComponent from '../../components/Loader';
import { CommonActions } from '@react-navigation/routers';
import { Picker } from '@react-native-picker/picker';

export default class RegisterScreen extends React.Component {

  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      email: "",
      password: "",
      first_name: "",
      address: "",
      accountNumber: "",
      emailToSendReadingTo: "",
      ERF: "",
      tariff: null,
      utilityType: "",
      loading: false,
      fadeValue: new Animated.Value(0),
      posValue: new Animated.Value(10),
      step: 1
    };

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

    StatusBar.setBarStyle("light-content");
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  Register = () => {
    if (this.validateEmail(this.state.email) && this.state.password.length >= 3 && this.state.first_name.length >= 1) {
      this._isMounted && this.setState({ loading: true }, () => {
        UserService.register(this.state.first_name, this.state.email, this.state.password, this.state.address, this.state.accountNumber, this.state.emailToSendReadingTo, this.state.ERF, this.state.tariff, this.state.utilityType).then((r) => {
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
              "This email is already registered",
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
    else {
      this._isMounted && this.setState({ loading: false })

      Alert.alert(
        "Sorry!",
        "Please enter a name, valid email and a password of at least 3 characters first",
        [
          {
            text: "Ok",
          },
        ],
      );
    }

  }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email));
  }

  Next = () => {
    var currentIndex = this.state.step;
    this._isMounted && this.setState({ step: currentIndex + 1 });
  }

  Previous = () => {
    var currentIndex = this.state.step;
    this._isMounted && this.setState({ step: currentIndex - 1 });
  }


  render() {
    return (
      <ImageBackground source={require("../../assets/bk.jpg")} style={globalStyles.containerCenter}>

        {this.state.loading ? <LoadingComponent /> : <View></View>}

        <TouchableOpacity onPress={() => this.state.step > 1 ? this.Previous() : this.props.navigation.goBack()} style={globalStyles.closeBtn}>
          <Ionicons name="md-arrow-back" size={30} color={"#fff"} />
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >

          <ScrollView keyboardShouldPersistTaps={'handled'}>

            <Animated.View style={{ flex: 1, paddingTop: 20, flexDirection: "column", justifyContent: "center", opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>

              <Image source={require("../../assets/icon.png")} style={styles.logo}></Image>
              <Text style={styles.title}>Register</Text>

              {
                this.state.step == 1 ?
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      returnKeyType={"next"}
                      allowFontScaling={false}
                      placeholder={"John Doe"}
                      placeholderTextColor={"#ccc"}
                      onChangeText={(text) => this.setState({ first_name: text })}
                      onSubmitEditing={() => this.emailInput.focus()}
                      value={this.state.first_name} />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      ref={(input) => { this.emailInput = input; }}
                      style={styles.input}
                      returnKeyType={"next"}
                      allowFontScaling={false}
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
                      secureTextEntry={true}
                      allowFontScaling={false}
                      returnKeyType={"next"}
                      placeholderTextColor={"#ccc"}
                      placeholder={"OopsIDidItAgain"}
                      onChangeText={(text) => this.setState({ password: text })}
                      onSubmitEditing={() => this.addInput.focus()}
                      value={this.state.password} />
                    <TouchableOpacity style={globalStyles.btn} onPress={() => this.Next()} >
                      <Text style={globalStyles.btnText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View></View>
              }

              {
                this.state.step == 2 ?
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Address</Text>
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
                    <Text style={styles.label}>Account Number</Text>
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
                    <Text style={styles.label}>Email To Send Reading To</Text>
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
                    <TouchableOpacity style={globalStyles.btn} onPress={() => this.Next()} >
                      <Text style={globalStyles.btnText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View></View>
              }

              {
                this.state.step == 3 ?
                  <View style={{ flex: 1 }}>

                    <Text style={styles.label}>ERF</Text>
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
                    <Text style={styles.label}>tariff (R)</Text>
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
                    <Text style={styles.label}>Utility</Text>
                    <View style={styles.input}>
                      <Picker
                        selectedValue={this.state.utilityType}
                        style={{ padding: 10, color: "#fff", fontFamily: "comfortaa", }}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ utilityType: itemValue })
                        }>
                        <Picker.Item label="Optional" value="Optional" />
                        <Picker.Item label="Water" value="Water" />
                        <Picker.Item label="Electricity" value="Electricity" />
                        <Picker.Item label="Electricity and Water" value="Electricity and Water" />
                      </Picker>
                    </View>
                    <TouchableOpacity style={globalStyles.btn} onPress={() => this.Next()} >
                      <Text style={globalStyles.btnText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View></View>
              }

              {
                this.state.step == 4 ?
                  <View style={{ flex: 1 }}>
                    <Text style={styles.terms} onPress={() => Linking.openURL('https://www.qwertsy.co.za/scanny-policy')}>
                      By Registering You Are Agreeing With These Terms and Conditions</Text>
                    <TouchableOpacity style={globalStyles.btn} onPress={() => this.Register()} >
                      <Text style={globalStyles.btnText}>Register</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View></View>
              }



              <Text allowFontScaling={false} style={styles.link} onPress={() => this._isMounted && this.props.navigation.navigate("Login")}>
                Already have an account? Login here</Text>

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
    margin: 20,
    borderRadius: 5,
    marginTop: 50
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
  terms:
  {
    margin: 5,
    marginVertical: 10,
    fontFamily: "comfortaa",
    color: "grey",
    textAlign: "center"
  }
});

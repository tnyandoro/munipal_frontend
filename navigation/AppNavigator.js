import React, { Component } from 'react';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from '../screens/list';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AboutScreen from '../screens/About';
import Colors from '../constants/Colors';
var globalStyles = require('../constants/Styles');
import { navigationRef } from './RootNavigation';
import * as RootNavigation from './RootNavigation';
import RegisterScreen from '../screens/auth/Register';
import LoginScreen from '../screens/auth/Login';
import UserService from '../services/userService';
import ForgotPasswordScreen from '../screens/auth/forgotPassword';
import DetailScreen from '../screens/details';
import ConfirmScreen from '../screens/confirm';
import FailureScreen from '../screens/failure';
import CaptureScreen from '../screens/capture';
import SummaryScreen from '../screens/summary';
import AccountDetails from '../screens/accountDetails';
import LandingScreen from '../screens/auth/Landing';

class AppNavigator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewCardModalShowing: false,
      selectedCard: null,
      navigation: null,
      mainMenuShowing: false,
      user: null
    }

    UserService.getUser().then((r) => {
      this.setState({ user: r })
    });
  }

  OnMainMenuPress = () => {
    UserService.getUser().then((r) => {
      if (r) {
        this.setState({ mainMenuShowing: true, user: r });
      }
      else {
        this.setState({ mainMenuShowing: true });
      }
    });
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

  AddDummyCard = () => {
    Alert.alert(
      "This is a test card",
      "You will need to register a free account in order to save your cards.\n\nHow you would like to add a new card?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Scan barcode",
          onPress: () => { this.setState({ mainMenuShowing: false, viewCardModalShowing: false }, () => { RootNavigation.navigate('Add a card', { scan: true, dummy: true }) }) },
        },
        {
          text: "Card number (No barcode on card)",
          onPress: () => { this.setState({ mainMenuShowing: false, viewCardModalShowing: false }, () => { RootNavigation.navigate('Add a card', { scan: false, dummy: true }) }) },
        },
      ],
    );
  }

  AddCard = () => {
    Alert.alert(
      "Add a new card",
      "How you would like to add a new card?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Scan barcode",
          onPress: () => { this.setState({ mainMenuShowing: false, viewCardModalShowing: false }, () => { RootNavigation.navigate('Add a card', { scan: true, dummy: false }) }) },
        },
        {
          text: "Card number (No barcode on card)",
          onPress: () => { this.setState({ mainMenuShowing: false, viewCardModalShowing: false }, () => { RootNavigation.navigate('Add a card', { scan: false, dummy: false }) }) },
        },
      ],
    );
  }

  Navigate = (screen) => {
    this.setState({ mainMenuShowing: false, viewCardModalShowing: false }, () => { RootNavigation.navigate(screen) })
  }

  render() {
    const Stack = createStackNavigator();

    return (
      <NavigationContainer ref={navigationRef}>

        <Stack.Navigator >

          {/* Auth */}
          <Stack.Screen name="Landing" component={LandingScreen} options={() => ({ headerShown: false })} />
          <Stack.Screen name="Register" component={RegisterScreen} options={() => ({ headerShown: false })} />
          <Stack.Screen name="Login" component={LoginScreen} options={() => ({ headerShown: false })} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={() => ({ headerShown: false })} />

          <Stack.Screen
            name="List"
            component={ListScreen}
            options={{
              headerRight: () => (
                <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={() => RootNavigation.navigate('About')}>
                  <Text style={{color: Colors.blue}}>Settings</Text>
                </TouchableOpacity>
              )
            }}
          />

          <Stack.Screen
            name="Detail"
            component={DetailScreen}
          />

          <Stack.Screen
            name="Account Details"
            component={AccountDetails}
          />

          <Stack.Screen
            name="Capture"
            component={CaptureScreen}
          />

          <Stack.Screen
            name="Confirm"
            component={ConfirmScreen}
          />

          <Stack.Screen
            name="Summary"
            component={SummaryScreen}
          />

          <Stack.Screen
            name="Failure"
            component={FailureScreen}
          />

          <Stack.Screen
            name="About"
            component={AboutScreen}
          />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default AppNavigator;
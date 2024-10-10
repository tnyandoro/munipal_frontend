import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import * as Font from 'expo-font';
var globalStyles = require('./constants/Styles');

export default class App extends React.Component {

  //expo build:android
  //expo build:ios

  // Flow for saving reading
  // Cloud vision runs and then goes to confirm page
  // Get latest (previous) reading runs
  // Goes to detail page to save reading 

  constructor(props) {
    super(props);
    this.state = { fontLoaded: false };
  }

  componentDidMount() {
    Font.loadAsync({
      'comfortaa': require('./assets/fonts/comfortaa.ttf'),
    }).then(() => {
      this.setState({ fontLoaded: true });
    });
  }

  render() {
    return (
      this.state.fontLoaded ?
        <View style={globalStyles.container}>
          <AppNavigator style={globalStyles.container} />
        </View>
        :
        <View style={globalStyles.container}></View>
    );
  }
}

const styles = StyleSheet.create({
});

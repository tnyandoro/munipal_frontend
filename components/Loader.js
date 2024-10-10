import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
var globalStyles = require('../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';

export default class LoadingComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>

        <ActivityIndicator size="large" color={Colors.pink}/>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0.8,
    position: "absolute",
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    zIndex: 10,
    justifyContent: "center"
  }
});

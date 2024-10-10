import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, StatusBar, Alert } from 'react-native';
import Colors from '../constants/Colors';
var globalStyles = require('../constants/Styles');
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import UserService from '../services/userService';
import { DataTable } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import MeterService from '../services/meterService';
import LoadingComponent from '../components/Loader';
import * as ImagePicker from 'expo-image-picker';
import GoogleService from '../services/googleService';

// import MlkitOcr from 'react-native-mlkit-ocr';

export default class ListScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fadeValue: new Animated.Value(1), posValue: new Animated.Value(10),
      activeTab: 'current',
      date: new Date(),
      showPicker: false,
      currentMonthData: [],
      historyData: [],
      loading: true,
      refreshing: false,
      user: null
    };
    this._isMounted = true;

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
        this.setState({ user: user }, () => {
          this.Init();
        })
      }
    })

    Animated.parallel([
      Animated.timing(this.state.posValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();

    StatusBar.setBarStyle("dark-content");
  }

  Init() {
    // Get data
    this.setState({ loading: true }, () => {
      MeterService.getCurrentMonthReadings(this.state.user.id).then((r) => {
        this.setState({ currentMonthData: r.data, loading: false })
      })
    })
  }

  componentDidMount() {
    this._isMounted = false;
  }

  onDateChange = (event, date) => {
    this.setState({ loading: true, showPicker: false })
    var d = new Date(date);
    MeterService.getHistoryReadings(d, this.state.user.id).then((r) => {
      this.setState({ historyData: r.data, loading: false })
    })
  }

  snap = async (utilityType) => {

    let status = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status.status == 'granted') {
      let image = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true
      });
      if (!image.cancelled) {
        // Get data
        this.setState({ loading: true });
        GoogleService.GetCloudVision(image.base64).then((result) => {
          this.setState({ loading: false }, () => {
            if (result.responses[0].textAnnotations) {
              this.props.navigation.navigate("Confirm", { item: result.responses[0].textAnnotations[0].description, utilityType: utilityType, photo: image.uri });
            }
            else {
              Alert.alert(
                "Oops!",
                "We didn't quite catch that, please try taking the photo again",
                [
                  {
                    text: "Okay",
                  },
                ],
              );
            }

          });
        });
      }
    }
    else {
      Alert.alert(
        "Permission Required",
        "Munipal needs permission to your device's camera and photos, please allow by enabling it in Settings",
        [
          {
            text: "Okay",
          },
        ],
      );
    }
  };

  render() {
    return (
      <View style={globalStyles.container}>

        <Animated.View style={{ flex: 1, opacity: this.state.fadeValue, transform: [{ translateY: this.state.posValue }] }}>

          {this.state.loading ? <LoadingComponent /> : <View></View>}

          <View style={globalStyles.rowCenter}>
            <TouchableOpacity style={this.state.activeTab == 'current' ? styles.tabBtnActive : styles.tabBtn} onPress={() => this.setState({ activeTab: 'current' })}>
              <Text style={globalStyles.btnText}>Current Month</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.activeTab == 'history' ? styles.tabBtnActive : styles.tabBtn} onPress={() => this.setState({ activeTab: 'history' })}>
              <Text style={globalStyles.btnText}>History</Text>
            </TouchableOpacity>
          </View>

          {
            this.state.activeTab == 'history' ?
              <TouchableOpacity style={globalStyles.btn} onPress={() => this.setState({ showPicker: true })}>
                <Text style={globalStyles.btnText}>Select Date</Text>
              </TouchableOpacity>
              :
              <View></View>
          }

          {
            this.state.showPicker ?
              <DateTimePicker
                testID="dateTimePicker"
                value={this.state.date}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={this.onDateChange}
              />
              :
              <View></View>
          }

          <TouchableOpacity style={styles.refresh} onPress={() => this.Init()}>
            <Ionicons name={'md-refresh'} size={25} color={Colors.blue} />
          </TouchableOpacity>


          <ScrollView style={styles.container} horizontal={true}
            keyboardShouldPersistTaps={'always'}>

            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.cellUtility}>Utility Type</DataTable.Title>
                <DataTable.Title style={styles.cellReading}>Reading</DataTable.Title>
                <DataTable.Title style={styles.cell}>Date</DataTable.Title>
              </DataTable.Header>

              <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>

                {
                  this.state.activeTab == 'current' ?
                    this.state.currentMonthData.map((item, key) => {
                      return (
                        <TouchableOpacity key={key} onPress={() => this.props.navigation.navigate("Detail", { item: item })}>
                          <DataTable.Row>
                            {
                              item.utilityType == 'Water' ?
                                <Text style={styles.cellWater}>W</Text>
                                :
                                item.utilityType == 'Electricity' ?
                                  <Text style={styles.cellElectricity}>E</Text>
                                  :
                                  <DataTable.Cell style={styles.cellUtility}></DataTable.Cell>
                            }
                            <DataTable.Cell style={styles.cellReading}>{item.reading}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{new Date(item.date).toISOString().slice(0, 19).replace('T', ' ')}</DataTable.Cell>
                          </DataTable.Row>
                        </TouchableOpacity>
                      );
                    })
                    :
                    this.state.historyData.map((item, key) => {
                      return (
                        <TouchableOpacity key={key} onPress={() => this.props.navigation.navigate("Detail", { item: item })}>
                          <DataTable.Row>
                            {
                              item.utilityType == 'Water' ?
                                <Text style={styles.cellWater}>W</Text>
                                :
                                item.utilityType == 'Electricity' ?
                                  <Text style={styles.cellElectricity}>E</Text>
                                  :
                                  <DataTable.Cell style={styles.cellUtility}></DataTable.Cell>
                            }
                            <DataTable.Cell style={styles.cellReading}>{item.reading}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{new Date(item.date).toISOString().slice(0, 19).replace('T', ' ')}</DataTable.Cell>
                          </DataTable.Row>
                        </TouchableOpacity>
                      );
                    })
                }

              </ScrollView>

            </DataTable>

          </ScrollView>


          {
            this.state.user ?
              <View style={globalStyles.rowEven}>
                {
                  this.state.user.utilityType == 'Water' || this.state.user.utilityType == 'Electricity and Water' ?
                    <TouchableOpacity style={styles.btnBlue} onPress={() => this.snap('Water')}>
                      <Text style={globalStyles.btnText}>Scan Water</Text>
                    </TouchableOpacity>
                    :
                    <View></View>
                }
                {
                  this.state.user.utilityType == 'Electricity' || this.state.user.utilityType == 'Electricity and Water' ?
                    <TouchableOpacity style={styles.btnYellow} onPress={() => this.snap('Electricity')}>
                      <Text style={globalStyles.btnText}>Scan Electricity</Text>
                    </TouchableOpacity>
                    :
                    <View></View>
                }
              </View>
              :
              <View></View>
          }


        </Animated.View>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5
  },
  cell: {
    // width: 120,
    width: 200,
    fontFamily: "comfortaa",
  },
  cellUtility: {
    width: 100,
    fontFamily: "comfortaa",
  },
  cellReading: {
    width: 150,
    fontFamily: "comfortaa",
  },
  cellWater: {
    fontFamily: "comfortaa",
    backgroundColor: Colors.blue,
    color: "#fff",
    textAlign: "center",
    borderRadius: 50,
    elevation: 1,
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    width: 50,
    height: 50,
    textAlignVertical: "center",
    marginVertical: 10,
    marginRight: 50
  },
  cellElectricity: {
    fontFamily: "comfortaa",
    backgroundColor: Colors.yellow,
    color: "#fff",
    textAlign: "center",
    borderRadius: 50,
    elevation: 1,
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    width: 50,
    height: 50,
    textAlignVertical: "center",
    marginVertical: 10,
    marginRight: 50
  },
  tabBtn: {
    backgroundColor: Colors.dark,
    padding: 10,
    flex: 1
  },
  tabBtnActive: {
    backgroundColor: Colors.blue,
    padding: 10,
    flex: 1
  },
  refresh: {
    height: 50,
    width: 50,
    backgroundColor: "white",
    position: "absolute",
    right: 0,
    top: 60,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    zIndex: 8,
    elevation: 1,
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  btnBlue: {
    backgroundColor: Colors.blue,
    margin: 10,
    borderRadius: 5,
    padding: 10,
    flex: 1
  },
  btnYellow: {
    backgroundColor: Colors.yellow,
    margin: 10,
    borderRadius: 5,
    padding: 10,
    flex: 1
  },
});

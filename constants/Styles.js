'use strict';

var React = require('react-native');
const { default: Colors } = require('./Colors');

var { StyleSheet } = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCenter: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  row: {
    flexDirection: 'row',
    alignItems:"center"
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems:"center",
    justifyContent: "center"
  },
  rowEven: {
    flexDirection: 'row',
    alignItems:"center",
    justifyContent: "space-evenly"
  },
  heading: {
    margin: 5,
    fontFamily: "comfortaa",
    textAlign: "center",
    fontSize: 20,
    marginVertical: 10
  },
  btn: {
    backgroundColor: Colors.blue,
    margin: 10,
    borderRadius: 50,
    padding: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "comfortaa",
  },
  div: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 5,
    padding: 5,
    elevation: 1,
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  divTitle: {
    margin: 5,
    color: Colors.blue,
    fontFamily: "comfortaa",
  },
  divBody: {
    margin: 5,
    marginVertical: 10,
    fontFamily: "comfortaa",
    color: "grey"
  },
  closeBtn: {
    position: "absolute",
    left: 10,
    top: 30,
    padding: 20,
    zIndex: 9
  },
});
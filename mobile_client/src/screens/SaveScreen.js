import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Alert,
  Text,
} from "react-native";

//Import userLocation from location Context
import { useLocation } from "../context/LocationContext";
import { MaterialIcons } from "@expo/vector-icons";

import axios from "axios";

export default SaveScreen = (props) => {
  const { currentUserLocation } = useLocation();
  const { image, imageBase64 } = props.route.params;
  const { navigation } = props;

  const [caption, setCaption] = useState("");

  const cancel = () => {
    navigation.navigate("Camera");
  };
  const handelNavigation = () => {
    navigation.popToTop();
  };

  // HTTP REQUEST to server withdata
  const handleCaption = () => {
    axios
      .post("http://localhost:5000/post", {
        caption,
        postLocation: currentUserLocation,
        postPhoto: imageBase64,
      })
      .then((res) => {
        // feedback on success: sucessful upload, alert and navigate to landing screen
        let date = res.data.date;
        Alert.alert(
          "Success Message",
          `Post was successfully created at: ${res.data.date}`,
          { text: "OK", onPress: () => navigation.popToTop() }
        );
      })
      .catch((error) => {
        //  error from server or message error status(400)
        if (error.res.status === 403) {
          let errorMessage = error.res.data.msg;
          Alert.alert("Error Message", `${errorMessage}, Try again`, {
            text: "OK",
            onPress: () => navigation.navigate("Camera"),
          });
        }
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      {imageBase64 ? (
        <View style={styles.container}>
          <Image style={styles.chosenImage} source={{ uri: imageBase64 }} />

          <MaterialIcons
            style={styles.cancelIcon}
            name="cancel"
            size={40}
            color="black"
            onPress={cancel}
          />
          <Image source={{ uri: imageBase64 }} style={styles.pickedImage} />

          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setCaption(text)}
            placeholder="Write your caption . . ."
          />
          <TouchableOpacity style={styles.submitBtn} onPress={handleCaption}>
            <Text style={styles.btnText}>Share Heritage</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}></View>
        </View>
      ) : (
        <Text
          style={{
            marginTop: Dimensions.get("window").height / 2,
            alignSelf: "center",
          }}
        >
          image unreadable
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    alignItems: "center",
  },
  cancelIcon: {
    position: "absolute",
    top: 0,
    left: Dimensions.get("window").width / 2 + 83,
  },
  chosenImage: {
    marginTop: 20,
    height: 250,
    width: 200,
    borderRadius: 5,
    resizeMode: "cover",
  },
  textInput: {
    marginTop: 20,
    height: 300,
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    width: Dimensions.get("window").width / 1.2,
    borderColor: "gray",
    borderWidth: 1,
  },
  submitBtn: {
    marginTop: 100,
    borderRadius: 5,
    backgroundColor: "black",
    padding: 20,
  },
  btnText: {
    color: "white",
    borderRadius: 5,
    fontSize: 18,
    fontWeight: "500",
  },
});

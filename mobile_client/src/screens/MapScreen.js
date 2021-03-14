import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
} from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

import { useLocation } from "../context/LocationContext";

export default MapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUserCurrentLocation } = useLocation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult.coords);
      console.log(location);
      setUserCurrentLocation(locationResult.coords);
      //   setErrorMsg(JSON.stringify(location));

      // fetch users' locations
    })();
  }, []);

  if (errorMsg) {
    setErrorMsg("Waiting to detect location...");
  } else if (location) {
    // setErrorMsg(JSON.stringify(location));
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          {/* <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="UserLocation"
            description="desc"
          /> */}
        </MapView>
      )}

      <Pressable
        style={styles.btn}
        onPress={() => navigation.navigate("Camera")}
      >
        <Text style={styles.btnText}>Share Photo</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: "wrap",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  btn: {
    position: "absolute",
    backgroundColor: "black",
    padding: 20,
    borderRadius: 5,
    bottom: 70,
    width: Dimensions.get("window").width / 2,
    left: Dimensions.get("window").width / 4,
  },
  btnText: {
    fontSize: 20,
    marginLeft: 25,
    fontWeight: "bold",
    color: "white",
  },
});

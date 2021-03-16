import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  Alert,
} from "react-native";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";

import { useLocation } from "../context/LocationContext";

import axios from "axios";

export default MapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUserCurrentLocation } = useLocation();
  const [posts, setPosts] = useState([]);
  const [popupInfo, setPopupInfo] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult.coords);
      setUserCurrentLocation(locationResult.coords);

      // fetch users' locations
      axios
        .get("http://localhost:5000/posts")
        .then((response) => {
          setPosts(response.data);
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
    })();
  }, []);

  if (errorMsg) {
    setErrorMsg("Waiting to detect location...");
  } else if (location) {
    // setErrorMsg(JSON.stringify(location));
  }

  //////////////  Shows info numeber of posts
  //////////////  and if one post then show caption
  const showPopupInfo = (caption, lat, lon) => {
    let detectedPosts = [];
    posts.forEach((post) => {
      if (
        lat === post.postLocation.latitude &&
        lon === post.postLocation.longitude
      ) {
        detectedPosts.push(post);

        // check if one post then show update state with caption
        if (detectedPosts.length === 1) {
          setPopupInfo(`${caption}`);
        } else setPopupInfo("");

        // ADD ALERT With number and popup
        Alert.alert(`${detectedPosts.length} Post`, popupInfo, {
          text: "OK",
          onPress: () => console.log("OK was pressed"),
        });
      }
    });
  };

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
          {posts &&
            posts.map((post, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: post.postLocation.latitude,
                  longitude: post.postLocation.longitude,
                }}
                onPress={() =>
                  showPopupInfo(
                    post.caption,
                    post.postLocation.latitude,
                    post.postLocation.longitude
                  )
                }
              />
            ))}
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

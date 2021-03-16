import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";

import { MaterialIcons } from "@expo/vector-icons";

export default CameraScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  // Take picture function
  const takePicuter = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({
        base64: true,
      });
      handelNavigation(data.uri, `data:image/jpeg;base64,${data.base64}`);
    }
  };

  const handelNavigation = (image, imageBase64) => {
    // only change screen when state is saved and pass image data as props
    if (image && imageBase64) {
      navigation.navigate("save", { image, imageBase64 });
    } else
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
  };

  // handeling permission errors
  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return alert("No access to camera");
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View style={styles.cameraConatiner}>
        <Camera
          style={styles.fixedRatio}
          ref={(ref) => setCamera(ref)}
          type={type}
          ratio={"4:5"}
        />
      </View>

      <TouchableOpacity
        style={styles.cameraIcons}
        onPress={() => takePicuter()}
      >
        <MaterialIcons name="camera" size={70} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraConatiner: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 4,
    aspectRatio: 0.5, //return to 1 if the camera view is to big, when adding top&bottom navigations
  },

  cameraIcons: {
    position: "absolute",
    bottom: 60,
    flex: 1,
    flexDirection: "row",
    width: Dimensions.get("window").width,
    justifyContent: "space-around",
    alignItems: "center",
  },

  // Loader
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

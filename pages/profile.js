import { StyleSheet, Text, View } from "react-native";
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber/native";
import Trigger from "../components/3dmodel/Trigger";
import Loader from "../components/3dmodel/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import Starlink from "../components/3dmodel/Starlink";
import useControls from "r3f-native-orbitcontrols";
import { StatusBar } from "expo-status-bar";
import Gradient from "../components/3dmodel/Gradient";
import { TouchableOpacity, GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";

const Index = () => {
  const [loading, setLoading] = useState(false);  // Removed the TypeScript boolean type
  const [OrbitControls, events] = useControls();

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
      <StatusBar animated style="light" />
      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>Paired Successfully</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          sed bibendum elit. Nam aliquet, mi eget ullamcorper tempor,
        </Text>
      </View>
      <View style={styles.modelContainer} {...events}>
        <Gradient />
        {loading && <Loader />}
        <Canvas>
          <OrbitControls enablePan={false} enableZoom={false} />
          <directionalLight position={[1, 0, 0]} args={["white", 2]} />
          <directionalLight position={[-1, 0, 0]} args={["white", 2]} />
          <directionalLight position={[0, 0, 1]} args={["white", 2]} />
          <directionalLight position={[0, 0, -1]} args={["white", 2]} />
          <directionalLight position={[0, 1, 0]} args={["white", 15]} />
          <directionalLight position={[0, -1, 0]} args={["white", 2]} />
          <Suspense fallback={<Trigger setLoading={setLoading} />}>
            <Starlink />
          </Suspense>
        </Canvas>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.back();
        }}
      >
        <Text style={styles.textButton}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  modelContainer: {
    flex: 1,
  },
  textContainer: {
    marginHorizontal: 24,
    gap: 4,
    marginVertical: 20,
  },
  textTitle: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    padding: 14,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  textButton: {
    color: "black",
    fontSize: 14,
  },
});

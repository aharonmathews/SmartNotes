import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { useSharedValue, withTiming } from "react-native-reanimated";

const ActionName = "someActionName"; // Update this to the correct action name

const Starlink = (props) => {
  const y = useSharedValue(0);
  const group = useRef(null);
  const { nodes, materials, animations } = useGLTF(
    require("../../assets/model/pilot_avatar.glb")
  );
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions[ActionName]?.play(); // Play the correct animation if needed
    y.value = withTiming(2, { duration: 2000 });
  }, []);

  useFrame(() => {
    group.current?.rotation.set(0, y.value, 0);
  });

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      position={[0, 0, 0]}
      scale={1}
    >
      <group name="Scene">
        <group
          name="Object_2" // Root group name based on the structure
          position={[0, 0, 0]}
          rotation={[0, 750, 0]}
          scale={1}
        >
          <group name="RootNode">
            <group name="Object_6">
              <mesh
                name="Object_67"
                castShadow
                receiveShadow
                geometry={nodes.Object_67.geometry}
                material={materials["someMaterialName"]} // Update this with the correct material name
              />
              {/* Add more meshes or objects as necessary */}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

export default Starlink;

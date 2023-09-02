import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, { useState, useRef, Suspense, useLayoutEffect } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { TextureLoader } from 'expo-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function Box(props) {
  const [active, setActive] = useState(false)
  const mesh = useRef()
  useFrame((state, s) => {
    mesh.current.rotation.y += s
  })
  return <mesh
    {...props}
    scale={active ? 1.5 : 1}
    ref={mesh}
    onClick={(e) => { setActive(!active) }}>
    <boxGeometry />
    <meshStandardMaterial color={active ? 'orange' : 'black'} />
  </mesh>
}

function Shoe(props) {

  const [base, normal, rough] = useLoader(TextureLoader, [
    require('./assets/Airmax/textures/BaseColor.jpg'),
    require('./assets/Airmax/textures/Normal.jpg'),
    require('./assets/Airmax/textures/Roughness.png'),
  ]);
  const mesh=useRef();
  const material = useLoader(MTLLoader, require('./assets/Airmax/shoe.mtl'))
  const obj = useLoader(OBJLoader, require('./assets/Airmax/shoe.obj'),
    (loader) => {
      material.preload()
      loader.setMaterials(material);
    }
  );

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = base;
        child.material.normalMap = normal;
        child.material.roughnessMap = rough;
      }
    });
  }, [obj]);

  useFrame((state, delta) => {
    // if (true) {
      mesh.current.rotation.y += delta
      mesh.current.rotation.x += delta
    // }

  })

  return (<mesh ref={mesh} {...props}>
    <primitive object={obj} scale={15} />
  </mesh>)
}

function Coach(props){

  const mesh=useRef();
  const obj = useLoader(GLTFLoader, require('./assets/Bruce/Bruce.glb'));


  // useFrame((state, delta) => {
  //   // if (true) {
  //     mesh.current.rotation.y += delta
  //     mesh.current.rotation.x += delta
  //   // }

  // })

  return (<mesh ref={mesh} {...props}>
    <primitive object={obj} scale={15} />
  </mesh>)
}

export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight intensity={10} position={[-1, 0, 1]} />
      {/* <Box position={[1, 4, -10]} />
      <Box position={[1, 0, -10]} 
      /> */
<Box position={[1, 0, -10]} 
      />

      
      }

      <Suspense fallback={null}>
        {/* <Shoe position={[0, 0, -1]} rotation={[1, 1, 0]} /> */}
        {/* <Coach  /> */}

      </Suspense>




    </Canvas>
  );
}


import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useRef } from 'react'
import FPSStats from 'react-fps-stats'
import './styles.css'
import { Canvas } from 'react-three-fiber'
import { Cubes } from './Cubes'
import { OrthographicCamera, OrbitControls } from 'drei'

const App = () => {
  const cam = useRef()
  return (
    <>
      <Canvas
        gl={{ antialias: false, alpha: false }}
        camera={{ position: [0, 0, 20], near: 5, far: 200 }}
        onCreated={({ gl }) => gl.setClearColor('lightpink')}
      >
        <OrthographicCamera ref={cam} position={[0, 0, 100]} zoom={1} />
        <ambientLight position={[10, 10, 10]} intensity={0.55} />
        <pointLight position={[10, 10, 10]} intensity={0.55} />
        <Cubes />
        <axesHelper args={[5]} />
        <OrbitControls />
      </Canvas>
      <FPSStats />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

// This is based on https://codesandbox.io/embed/r3f-instanced-colors-8fo01
// With added orbit controls and transform controls

import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import niceColors from 'nice-color-palettes'
import FPSStats from 'react-fps-stats'
import Effects from './Effects'
import './styles.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

extend({ OrbitControls, TransformControls })

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()
const colors = new Array(1000).fill().map(() => niceColors[17][Math.floor(Math.random() * 5)])

function Boxes() {
  const [transformControl, setTControl] = useState()

  useEffect(() => {
    console.log(`To change the transform options you have the following: 
    q: toggle the transform between world and local
    w: set to translate mode
    e: set to rotate mode
    r: set to scale mode`)
  }, [])
  window.addEventListener('keydown', function (event) {
    if (!transformControl) return

    switch (event.key) {
      case 'q':
        transformControl.setSpace(transformControl.space === 'local' ? 'world' : 'local')
        break

      case 'w':
        transformControl.setMode('translate')
        break

      case 'e':
        transformControl.setMode('rotate')
        break

      case 'r':
        transformControl.setMode('scale')
        break
    }
  })

  const [hovered, set] = useState()
  const colorArray = useMemo(
    () => Float32Array.from(new Array(1000).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())),
    [],
  )

  const orbit = useRef()
  const { camera, gl, scene } = useThree()

  useFrame(() => orbit.current.update())
  useEffect(() => {
    if (transformControl) {
      const callback = event => (orbit.current.enabled = !event.value)
      transformControl.addEventListener('dragging-changed', callback)
      return () => transformControl.removeEventListener('dragging-changed', callback)
    }
  })

  const ref = useRef()
  const previous = useRef()
  useEffect(() => void (previous.current = hovered), [hovered])

  useFrame(state => {
    const time = state.clock.getElapsedTime()
    ref.current.rotation.x = Math.sin(time / 4)
    ref.current.rotation.y = Math.sin(time / 2)
    let i = 0
    for (let x = 0; x < 10; x++)
      for (let y = 0; y < 10; y++)
        for (let z = 0; z < 10; z++) {
          const id = i++
          tempObject.position.set(5 - x, 5 - y, 5 - z)
          tempObject.rotation.y = Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time)
          tempObject.rotation.z = tempObject.rotation.y * 2
          if (hovered !== previous.current) {
            tempColor.set(id === hovered ? 'white' : colors[id]).toArray(colorArray, id * 3)
            ref.current.geometry.attributes.color.needsUpdate = true
          }
          const scale = id === hovered ? 2 : 1
          tempObject.scale.set(scale, scale, scale)
          tempObject.updateMatrix()
          ref.current.setMatrixAt(id, tempObject.matrix)
        }
    ref.current.instanceMatrix.needsUpdate = true
  })

  useEffect(() => {
    if (!transformControl && ref.current) {
      let transformC = new TransformControls(camera, gl.domElement)
      transformC.attach(ref.current)

      scene.add(transformC)
      setTControl(transformC)
    }

    return () => {
      if (transformControl) {
        scene.remove(transformControl)
        setTControl(undefined)
      }
    }
  }, [transformControl, camera, scene, gl])

  return (
    <>
      <instancedMesh
        ref={ref}
        args={[null, null, 1000]}
        onPointerMove={e => set(e.instanceId)}
        onPointerOut={e => set(undefined)}
      >
        <boxBufferGeometry attach="geometry" args={[0.7, 0.7, 0.7]}>
          <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
        </boxBufferGeometry>
        <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
      </instancedMesh>
      <orbitControls ref={orbit} args={[camera, gl.domElement]} enableDamping dampingFactor={1} rotateSpeed={1} />
    </>
  )
}

ReactDOM.render(
  <>
    <Canvas
      gl={{ antialias: false, alpha: false }}
      camera={{ position: [0, 0, 15], near: 5, far: 200 }}
      onCreated={({ gl }) => gl.setClearColor('lightpink')}
    >
      <ambientLight />
      <pointLight position={[150, 150, 150]} intensity={0.55} />
      <Boxes />
      {/* <Effects /> */}
    </Canvas>
    <FPSStats />
  </>,
  document.getElementById('root'),
)

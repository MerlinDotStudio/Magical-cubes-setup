import { BoxHelper, DirectionalLightHelper, DoubleSide } from 'three'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'
import { FaceNormalsHelper } from 'three/examples/jsm/helpers/FaceNormalsHelper'
import ReactDOM from 'react-dom'
import React, { useRef, useEffect } from 'react'
import { Stats } from './Stats'
import './styles.css'
import { Canvas, useThree } from 'react-three-fiber'
import { Cubes } from './Cubes'
import { OrthographicCamera, OrbitControls, useHelper } from 'drei'
import { ControlsProvider, Controls, useControl } from 'react-three-gui'
import { a, config } from '@react-spring/three'

function Box() {
  // const [show, set] = useState(false);
  // const posX = useControl('Pos X', { type: 'number', spring: true })
  // const posY = useControl('Pos Y', {
  //   type: 'number',
  //   spring: config.wobbly,
  // })
  // const rotateXY = useControl('Rotation', { type: 'xypad', distance: Math.PI })
  const color = useControl('Material Color', { type: 'color' })
  // useControl('Toggle cube', {
  //   group: GROUP,
  //   type: 'button',
  //   onClick: () => set(s => !s),
  // });
  const mesh = useRef()
  useHelper(mesh, BoxHelper, '#272740')
  useHelper(mesh, VertexNormalsHelper, 1, '#272740')
  useHelper(mesh, FaceNormalsHelper, 0.5, '#272740')
  return (
    <>
      <a.mesh ref={mesh}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <a.meshStandardMaterial attach="material" color={color} />
      </a.mesh>
      {/* {show && <Extra />} */}
    </>
  )
}

function Lighting() {
  const { camera, scene } = useThree()
  const ambientIntensity = useControl('ambient intensity', { type: 'number', value: 0.55 })

  const pointGroup = 'point'
  const pointX = useControl('point X', { group: pointGroup, type: 'number', min: 0, max: 100, value: 10, spring: true })
  const pointY = useControl('point Y', { group: pointGroup, type: 'number', min: 0, max: 100, value: 10, spring: true })
  const pointZ = useControl('point Z', { group: pointGroup, type: 'number', min: 0, max: 100, value: 10, spring: true })
  const pointIntensity = useControl('point intensity', { group: pointGroup, type: 'number', value: 0.55 })

  const spotlightRef = useRef()
  // useHelper(spotlightRef, SpotLightHelper, 'cyan')

  const target = useRef()
  const plane = useRef()
  // useEffect(() => {
  //   const spotlight = spotlightRef.current
  //   scene.add(spotlight.target)
  //   spotlight.target = target.current

  //   console.log('spotlight.target', spotlight.target)
  //   return () => {
  //     scene.remove(spotlight.target)
  //   }
  // }, [scene])

  useEffect(() => {
    spotlightRef.current.target = plane.current
  }, [scene])

  useHelper(target, BoxHelper, '#272740')
  useHelper(target, VertexNormalsHelper, 1, '#272740')
  useHelper(target, FaceNormalsHelper, 0.5, '#272740')

  useHelper(spotlightRef, DirectionalLightHelper, 0.5, '#272740')

  console.log('spotlightRef', spotlightRef)
  return (
    <>
      {/* position={[ambientX, ambientY, ambientZ]} */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        ref={spotlightRef}
        position={[10, 10, 10]}
        // position-x={pointX}
        // position-y={pointY}
        // position-z={pointZ}
        color={'#272740'}
        intensity={pointIntensity}
        castShadow={true}
        shadow={{
          mapSize: {
            width: 2048,
            height: 2048,
          },
          camera: {
            left: -50,
            right: 50,
            top: 50,
            bottom: -50,
            far: 3500,
          },
          bias: -0.0001,
        }}
      />
      {/* <pointLight
        ref={spotlightRef}
        position-x={pointX}
        position-y={pointY}
        position-z={pointZ}
        intensity={pointIntensity}
        lookAt={[0, 0, 0]}
      /> */}
      <a.mesh ref={target} castShadow={true} receiveShadow={true}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <a.meshStandardMaterial attach="material" color={'#ffffff'} />
      </a.mesh>

      <a.mesh ref={plane} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow={true} name={'plane'}>
        <planeGeometry args={[100, 100, 100]} />
        <meshStandardMaterial color={'#eeeeee'} side={DoubleSide} />
      </a.mesh>
      {/* <spotLightHelper args={[point]} /> */}
    </>
  )
}

const App = () => {
  const cam = useRef()

  const color = useControl('Material Color', { type: 'color' })

  const posX = useControl('Pos X', { type: 'number', spring: true })
  const posY = useControl('Pos Y', {
    type: 'number',
    spring: config.wobbly,
  })
  const width = window.innerWidth
  const height = window.innerHeight
  const aspect = width / height
  const viewSize = 800
  return (
    <>
      <ControlsProvider>
        <Canvas
          pixelRatio={window.devicePixelRatio}
          gl={{ antialias: false, alpha: false }}
          camera={{ near: 150, far: 1000 }}
          onCreated={({ gl }) => gl.setClearColor('lightpink')}
        >
          <OrthographicCamera
            makeDefault
            ref={cam}
            position={[50, 50, 100]}
            left={(-aspect * viewSize) / 2}
            right={(aspect * viewSize) / 2}
            top={viewSize / 2}
            bottom={-viewSize / 2}
            near={-1000}
            far={1000}
            zoom={20}
          />
          <Lighting />
          {/* <a.mesh position-x={posX} position-y={posY}>
            <boxGeometry attach="geometry" args={[1, 1, 1]} />
            <a.meshStandardMaterial attach="material" color={color} />
          </a.mesh> */}
          {/* <Box /> */}
          <Cubes />
          <axesHelper args={[5]} />
          <OrbitControls />
        </Canvas>
        <Stats />
        <Controls />
      </ControlsProvider>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import niceColors from 'nice-color-palettes'

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()
const colors = new Array(1000).fill().map(() => niceColors[17][Math.floor(Math.random() * 5)])

export const Cubes = () => {
  const mesh = useRef()
  const ref = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  //   useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  useFrame(state => {
    const time = state.clock.getElapsedTime()
    // ref.current.rotation.x = Math.sin(time / 4)
    // ref.current.rotation.y = Math.sin(time / 2)
    let i = 0
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 3; y++) {
        //     for (let z = 0; z < 10; z++) {
        const id = i++
        const padX = x * 1
        const padY = y * 1
        tempObject.position.set(x + padX, y + padY, 0)
        //   tempObject.rotation.y = Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time)
        tempObject.rotation.z = tempObject.rotation.y * 2
        //   //   if (hovered !== previous.current) {
        //   //     tempColor.set(id === hovered ? 'white' : colors[id]).toArray(colorArray, id * 3)
        //   //     ref.current.geometry.attributes.color.needsUpdate = true
        //   //   }
        //   const scale = id === hovered ? 2 : 1
        //   tempObject.scale.set(scale, scale, scale)
        tempObject.updateMatrix()
        ref.current.setMatrixAt(id, tempObject.matrix)
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={ref} args={[null, null, 30]} position={[-9, 0, 0]} castShadow={true} receiveShadow={true}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color="lightblue" />
      </instancedMesh>
    </>
  )
}

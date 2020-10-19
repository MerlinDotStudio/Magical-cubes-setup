import Stats from '../../libs/stats.module.js'
import { Scene, PerspectiveCamera, OrthographicCamera, WebGLRenderer, Color } from '../../libs/three.module.js'
import { OrbitControls } from '../../libs/OrbitControls.js'
import { TransformControls } from '../../libs/TransformControls.js'

const scene = new Scene()
scene.background = new Color().setHex(0xdbdbdb)

// const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// camera.position.x = 50
// camera.position.y = 100
// camera.position.z = 100

const width = window.innerWidth
const height = window.innerHeight
var aspect = width / height
var viewSize = 800
var camera = new OrthographicCamera(
  (-aspect * viewSize) / 2,
  (aspect * viewSize) / 2,
  viewSize / 2,
  -viewSize / 2,
  -1000,
  10000,
)
camera.position.x = 150
camera.position.y = 150
camera.position.z = 300
camera.zoom = 2
camera.updateProjectionMatrix()

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const orbitcontrols = new OrbitControls(camera, renderer.domElement)
orbitcontrols.enableZoom = true

const stats = new Stats()
document.body.appendChild(stats.dom)

const transformControl = new TransformControls(camera, renderer.domElement)
scene.add(transformControl)

transformControl.addEventListener('dragging-changed', function (event) {
  orbitcontrols.enabled = !event.value
})

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
}

window.addEventListener('resize', resize)

export { scene, camera, renderer, stats, orbitcontrols, transformControl }

import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'

import gsap from 'gsap'
import * as dat from 'dat.gui'

/**
 * Base
 */
// const parameters = {
//   color: 0xff0000,
//   spin: () => {
//     gsap.to(mesh.rotation, 1, { y: mesh.rotation.y + Math.PI * 2 })
//   },
//   radius: 1,
//   detail: 1,
// }
const parameters = {}
parameters.radius = 1
parameters.detail = 1
parameters.wireframe = false

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
let geometry = null
let material = null
let icosahedron = null

const generateIcosahedron = () => {
  // const geometry = new THREE.BoxGeometry(1, 1, 1)
  // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

  if (icosahedron !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(icosahedron)
  }

  geometry = new THREE.IcosahedronGeometry(parameters.radius, parameters.detail)

  let t = new THREE.TextureLoader().load('/images/dune.jpg')
  t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping

  material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable',
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: 'f', value: 0 },
      landscape: {
        value: t,
      },
      resolution: { type: 'v4', value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1),
      },
    },
    wireframe: parameters.wireframe,
    // transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment,
  })
  icosahedron = new THREE.Mesh(geometry, material)
  scene.add(icosahedron)
}

generateIcosahedron()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Handle window resize
window.addEventListener('resize', () => {
  // update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.001,
  1000
)

camera.position.x = 0
camera.position.y = 0
camera.position.z = 2

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(0x111111, 1)
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Debug
 */
const gui = new dat.GUI({
  // closed: true,
  width: 400,
})
// gui.hide()

gui
  .add(parameters, 'radius')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(generateIcosahedron)
gui
  .add(parameters, 'detail')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(generateIcosahedron)
gui.add(parameters, 'wireframe').onChange(generateIcosahedron)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //   scene.rotation.x = elapsedTime * 0.1
  //   scene.rotation.y = elapsedTime * 0.1

  icosahedron.rotation.x = elapsedTime * 0.05
  icosahedron.rotation.y = elapsedTime * 0.06

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

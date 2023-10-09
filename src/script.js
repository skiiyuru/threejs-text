import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import { FontLoader } from "three/addons/loaders/FontLoader.js"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js"

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Axis helper
const helper = new THREE.AxesHelper(10, 10, 10)
// scene.add(helper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load("/textures/matcaps/8.png")

/**
 * Textures
 */
const fontLoader = new FontLoader()
fontLoader.load(
  "/fonts/rawson_regular.json",
  (font) => {
    const textGeometry = new TextGeometry("Stephen Kiiyuru", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    })
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //   -textGeometry.boundingBox.max.x / 2,
    //   -textGeometry.boundingBox.max.y / 2,
    //   -textGeometry.boundingBox.max.z / 2
    // )
    textGeometry.center()
    const material = new THREE.MeshMatcapMaterial()
    material.matcap = matcapTexture
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)

    // Donuts
    const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 40)

    for (let i = 0; i < 177; i++) {
      // slice

      const mesh = new THREE.Mesh(torusGeometry, material)

      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
      mesh.rotation.x = Math.random() * Math.PI
      mesh.rotation.y = Math.random() * Math.PI

      // random size
      const scale = Math.random()
      mesh.scale.set(scale, scale, scale)
      scene.add(mesh)
    }
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
  }
)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 5
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

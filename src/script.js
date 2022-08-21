import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const planetColor = textureLoader.load('/textures/snow/neptune.jpg')
const snowColor = textureLoader.load('/textures/snow/color.jpg')
const snowAmbientOcclusion = textureLoader.load('/textures/snow/ambientOcclusion.jpg')
const snowHeight = textureLoader.load('/textures/snow/height.jpg')
const snowNormal = textureLoader.load('/textures/snow/normal.jpg')
const snowRoughness = textureLoader.load('/textures/snow/roughness.jpg')
const snowAlpha = textureLoader.load('/textures/snow/alpha.jpg')

snowColor.repeat.set(8,8)
snowAmbientOcclusion.repeat.set(8,8)
snowHeight.repeat.set(8,8)
snowNormal.repeat.set(8,8)
snowRoughness.repeat.set(8,8)
snowAlpha.repeat.set(8,8)

snowColor.wrapS = THREE.RepeatWrapping
snowAmbientOcclusion.wrapS = THREE.RepeatWrapping
snowHeight.wrapS = THREE.RepeatWrapping
snowNormal.wrapS = THREE.RepeatWrapping
snowRoughness.wrapS = THREE.RepeatWrapping

snowColor.wrapT = THREE.RepeatWrapping
snowAmbientOcclusion.wrapT = THREE.RepeatWrapping
snowHeight.wrapT = THREE.RepeatWrapping
snowNormal.wrapT = THREE.RepeatWrapping
snowRoughness.wrapT = THREE.RepeatWrapping
snowAlpha.wrapT = THREE.RepeatWrapping





/**
 * Spheres
 */
// Planet
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(40, 80, 80),
    new THREE.MeshStandardMaterial({ 
        map: planetColor,
     })
)
sphere.position.y = 15
sphere.position.z = -110
sphere.position.x = 50
scene.add(sphere)

// Sun
// const sun = new THREE.Mesh(
//     new THREE.SphereGeometry(20, 60, 60),
//     new THREE.MeshStandardMaterial({
//         color: '#c1ccfe'
//     })
// )

// sun.position.y = 9
// sun.position.z = 100
// sun.position.x = 150
// scene.add(sun)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 80, 80),
    new THREE.MeshStandardMaterial({ 
        map: snowColor,
        // transparent: true,
        alphaMap: snowAlpha,
        displacementMap: snowHeight,
        displacementScale: 0.05,
        normalMap: snowNormal,
        aoMap: snowAmbientOcclusion,
        roughnessMap: snowRoughness
       
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#d1ebfe', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#d1ebfe', 1)
moonLight.position.set(150, 9, 3.648)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
moonLight.castShadow = true

const helper = new THREE.DirectionalLightHelper(moonLight, 5)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0.2
camera.position.z = 3.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y = elapsedTime * 0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
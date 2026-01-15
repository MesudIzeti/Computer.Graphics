import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// === Scene ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

// === Camera ===
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(35, 25, 35);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Loaders ===
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

// === Textures ===
const brickTexture = textureLoader.load('textures/brick_wall.jpg');     
const brickBlueTexture = textureLoader.load('textures/brick_blue.jpg'); 
const brickIronTexture = textureLoader.load('textures/brick_iron.jpg'); 
const blueMetalTexture = textureLoader.load('textures/blue_metal.jpg'); 
const grassTexture = textureLoader.load('textures/grass.jpg');
const roadTexture = textureLoader.load('textures/road.jpg');

// === Texture settings ===
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(1, 10);

// === GLTF MODEL ===
let gltfTree;

gltfLoader.load(
  "/models/jacaranda_tree_4k/jacaranda_tree_4k.gltf",
  (gltf) => {
    gltfTree = gltf.scene;
    gltfTree.position.set(-5, 0, 40);
    gltfTree.scale.set(2, 2, 2);
    scene.add(gltfTree);
  }
);

// === Lights ===
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(30, 50, 20);
scene.add(sunLight);

const pointLight = new THREE.PointLight(0xfff4cc, 0.7);
pointLight.position.set(10, 10, -10);
scene.add(pointLight);

// === Ground ===
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshLambertMaterial({ map: grassTexture })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// === Roads ===
const roadGeometry = new THREE.BoxGeometry(10, 1, 100);
const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });

[
  [-15, 0.5, 0, 0],
  [35, 0.5, 0, 0],
  [0, 0.5, -25, Math.PI / 2],
  [0, 0.5, 30, Math.PI / 2]
].forEach(([x, y, z, r]) => {
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.position.set(x, y, z);
  road.rotation.y = r;
  scene.add(road);
});

// === Buildings ===
const building1 = new THREE.Mesh(
  new THREE.BoxGeometry(8, 8, 18),
  new THREE.MeshStandardMaterial({ map: blueMetalTexture })
);
building1.position.set(-29, 4, -11);
scene.add(building1);

const building2 = new THREE.Mesh(
  new THREE.BoxGeometry(8, 8, 18),
  new THREE.MeshStandardMaterial({ map: brickBlueTexture })
);
building2.position.set(-29, 4, 10);
scene.add(building2);

const building3 = new THREE.Mesh(
  new THREE.BoxGeometry(32, 8, 22),
  new THREE.MeshLambertMaterial({ map: brickTexture })
);
building3.position.set(10, 4, 1);
scene.add(building3);

const building4 = new THREE.Mesh(
  new THREE.BoxGeometry(28, 8, 10),
  new THREE.MeshStandardMaterial({
    map: brickIronTexture,
    transparent: true,
    opacity: 0.4,
    roughness: 0.1,
    metalness: 0.3,
  })
);
building4.position.set(10, 4, -36);
scene.add(building4);

//INTERACTION 
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const interactiveObjects = [
  building1,
  building2,
  building3,
  building4
];

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects);

  if (intersects.length > 0) {
    const obj = intersects[0].object;

    if (!obj.userData.clicked) {
      obj.userData.originalMaterial = obj.material;
      obj.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      obj.userData.clicked = true;
    } else {
      obj.material = obj.userData.originalMaterial;
      obj.userData.clicked = false;
    }
  }
});

// === Animation ===
function animate() {
  controls.update();

  if (gltfTree) {
    gltfTree.rotation.y += 0.002;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// === Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

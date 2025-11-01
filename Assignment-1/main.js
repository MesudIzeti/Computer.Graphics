import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// === Scene ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5); // soft sky blue

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

// === Lights ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(30, 50, 20);
scene.add(sunLight);


const pointLight = new THREE.PointLight(0xfff4cc, 0.7);
pointLight.position.set(10, 10, -10);
scene.add(pointLight);


const groundGeo = new THREE.PlaneGeometry(100, 100);
const grassMat = new THREE.MeshLambertMaterial({ color: 0x4caf50 });
const ground = new THREE.Mesh(groundGeo, grassMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);


const roadGeometry = new THREE.BoxGeometry(10, 1,100);
const roadMaterial = new THREE.MeshBasicMaterial({color: 0x555555});
const road = new THREE.Mesh(roadGeometry, roadMaterial);
scene.add(road);


road.position.set(-15, 0.5, 0);

const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
road2.position.set(35, 0.5, 0);
scene.add(road2);

const road3 = new THREE.Mesh(roadGeometry, roadMaterial);
road3.position.set(0, 0.5, -25);
road3.rotation.y = Math.PI / 2;
scene.add(road3);

const road4 = new THREE.Mesh(roadGeometry, roadMaterial);
road4.position.set(0, 0.5, 30);
road4.rotation.y = Math.PI / 2;
scene.add(road4);

// === Buildings ===
const b1Geo = new THREE.BoxGeometry(8, 8, 18);
const b1Mat = new THREE.MeshPhongMaterial({ color: 0x4169E1 });
const building1 = new THREE.Mesh(b1Geo, b1Mat);
building1.position.set(-29, 4, -11);
scene.add(building1);

const b2Geo = new THREE.BoxGeometry(8, 8, 18);
const b2Mat = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
const building2 = new THREE.Mesh(b2Geo, b2Mat);
building2.position.set(-29, 4, 10);
scene.add(building2);

const b3Geo = new THREE.BoxGeometry(18, 8, 22);
const b3Mat = new THREE.MeshLambertMaterial({ color: 0x654321 });
const building3 = new THREE.Mesh(b3Geo, b3Mat);
building3.position.set(10, 4, 1);
scene.add(building3);

const b4Geo = new THREE.BoxGeometry(28, 8, 10);
const b4Mat = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
const building4 = new THREE.Mesh(b4Geo, b4Mat);
building4.position.set(10, 4, -36);
scene.add(building4);

// === Trees ===
const treeMat = new THREE.MeshLambertMaterial({ color: 0x2e7d32 });
const treeGeo = new THREE.ConeGeometry(1.5, 4, 8);

const treePositions = [
  [-5, 2, -10],
  [-5, 2, 18],
  [25, 2, -14],
  [25, 2, -5],
  [18, 2, 20]
];

treePositions.forEach(([x, y, z]) => {
  const tree = new THREE.Mesh(treeGeo, treeMat);
  tree.position.set(x, y, z);
  scene.add(tree);
});

// === Street Lamps ===
const lampMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const lampHeadMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffcc,
  emissive: 0xffff99,
  emissiveIntensity: 0.5
});

const lampPositions = [
  [-8, 3, -18],
  [-8, 3, 0],
  [-8, 3, 20],
  [25, 3, -18],
  [25, 3, 0],
  [25, 3, 20]
];

lampPositions.forEach(([x, y, z]) => {
  
  const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 8); 
  const pole = new THREE.Mesh(poleGeo, lampMaterial);
  pole.position.set(x, 3.3, z); 
  scene.add(pole);

 
  const headGeo = new THREE.SphereGeometry(0.5, 12, 12);
  const head = new THREE.Mesh(headGeo, lampHeadMaterial);
  head.position.set(x, 6.5, z); 
  scene.add(head);

 
  const lampLight = new THREE.PointLight(0xffeeaa, 1, 15);
  lampLight.position.set(x, 6.5, z);
  scene.add(lampLight);
});

// === Animation Loop ===
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// === Responsive Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

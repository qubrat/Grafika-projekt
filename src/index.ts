
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Wczytanie tekstur
const posx = require('./textures/px.jpg');
const posy = require('./textures/py.jpg');
const posz = require('./textures/pz.jpg');
const negx = require('./textures/nx.jpg');
const negy = require('./textures/ny.jpg');
const negz = require('./textures/nz.jpg');

//Ustawienia
const cubeColor = 0xbfbfbf; //kolor kostki
const minDistance = 300; //minimalna odległość kamery
const maxDistance = 2200; //maksymalna odległość kamery

// Zmienne globalne
let camera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let cameraCube: THREE.PerspectiveCamera;
let sceneCube: THREE.Scene;

// Funkcje
function init() {

	// Scena
	scene = new THREE.Scene();
	sceneCube = new THREE.Scene();

	// Światła
	const light = new THREE.AmbientLight(0x4f4f4f);
	scene.add(light);

	const pointlight = new THREE.PointLight(0xffffff, 2.5, 2000);
	pointlight.position.set(500, 700, 200);
	scene.add(pointlight);

	// Kamera
	const cameraParams = [
		70,
		window.innerWidth / window.innerHeight,
		1,
		100000
	];

	camera = new THREE.PerspectiveCamera(...cameraParams);
	camera.position.set(0, 0, 1000);
	cameraCube = new THREE.PerspectiveCamera(...cameraParams);


	// Ustawienie wcześniej załadowanych tekstur
	let texture = new THREE.CubeTextureLoader().load([
		posx, negx,
		posy, negy,
		posz, negz
	]);

	// Stworzenie shadera
	const mainShader = THREE.ShaderLib['cube'];
	const cubeMaterial = new THREE.ShaderMaterial({
		uniforms: THREE.UniformsUtils.clone(mainShader.uniforms),
		fragmentShader: mainShader.fragmentShader,
		vertexShader: mainShader.vertexShader,
		depthWrite: false,
		side: THREE.BackSide,
	});

	cubeMaterial['envMap'] = texture;

	// Skybox
	const boxBufferGeo = new THREE.BoxBufferGeometry(100, 100, 100)
	const cubeMesh = new THREE.Mesh(boxBufferGeo, cubeMaterial);
	sceneCube.add(cubeMesh);

	const geometry = new THREE.BoxGeometry(200, 200, 200, 2, 2, 2);
	const sphereMaterial = new THREE.MeshLambertMaterial({ color: cubeColor, envMap: texture });
	const sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
	scene.add(sphereMesh);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.autoClear = false;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//Kontrola widoku
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.minDistance = minDistance;
	controls.maxDistance = maxDistance;

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	cameraCube.aspect = window.innerWidth / window.innerHeight;
	cameraCube.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	camera.lookAt(scene.position);
	cameraCube.rotation.copy(camera.rotation);
	renderer.render(sceneCube, cameraCube);
	renderer.render(scene, camera);

}


// Wywołanie programu
init();
animate();

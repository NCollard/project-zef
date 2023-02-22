import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
import { values } from './options.js';

const canvas = document.querySelector('#preview')
const options = document.querySelector('#options')

const triggers = document.querySelectorAll('.option[name="options-effect"]');
const radioInputs = document.querySelectorAll('.option:not([name="options-color"])');
const colorInput = document.querySelector('.option[name="options-color"]');

///---DEBUG---///
// const gui = new dat.GUI();
// gui.domElement.id = "gui";


///---LOADING MODELS---///
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
    '/models/pedals/pedal1.gltf',
    (gltf) => {
        boxTypes[1] = gltf.scene;
    }
);

gltfLoader.load(
    '/models/pedals/pedal2.gltf',
    (gltf) => {
        boxTypes[2] = gltf.scene;
    }
);

gltfLoader.load(
    '/models/pedals/pedal3.gltf',
    (gltf) => {
        boxTypes[3] = gltf.scene;
    }
);

gltfLoader.load(
    '/models/knobs/knob1.gltf',
    (gltf) => {
        knobTypes[1] = gltf.scene;
    }
);

triggers.forEach(trigger => {
    trigger.addEventListener("input", startAnimation);
});

//Runs only once when the first effect is picked
function startAnimation() {
    controls.enabled = true;
    generatePedal();
    setColor();

    triggers.forEach(trigger => {
        trigger.removeEventListener("input", startAnimation);
    });

    radioInputs.forEach(input => {
        input.addEventListener("input", updateScene);
    });

    colorInput.addEventListener("input", setColor);
}

//Clears pedal, generates new one
function updateScene() {
    pedal.clear();
    generatePedal();
    setColor();
};

function generatePedal() {
    const boxValue = values.box;
    const knobType = values.knobtype;
    const knobCount = values.knobs;

    //Generate new box and add it to scene
    const box = boxTypes[boxValue];

    box.position.x = 0;
    box.position.y = 0 + (floor.geometry.parameters.height / 2);
    box.position.z = 0;

    box.rotation.y = (-Math.PI / 2);
    box.castShadow = true;
    box.receiveShadow = true;

    pedal.add(box);

    // Generating knobs and positioning them
    for (let i = 1; i <= values.knobs; i++) {
        const knob = knobTypes[knobType];
        const vector3 = new THREE.Vector3();
        const box3 = new THREE.Box3().setFromObject(box);

        console.log(boxValue, knobCount)

        //setting x position
        const boxCenter = (box3.max.x + box3.min.x);

        switch (boxValue) {
            case 1: switch (knobCount) {
                case 1:
                case 2: vector3.x = boxCenter;
                    break;
            }
                break;
            case 2: switch (knobCount) {
                case 1: vector3.x = boxCenter;
                    break;
                case 2: vector3.x = boxCenter + (i == 1 ? 1 : -1);
                    break;
                case 3: vector3.x = boxCenter + (i == 1 ? 1 : i == 2 ? -1 : boxCenter);
                    break;
            }
                break;
            case 3: switch (knobCount) {
                case 1: vector3.x = boxCenter;
                    break;
                case 2: vector3.x = boxCenter + (i == 1 ? 1.5 : -1.5);
                    break;
                case 3: vector3.x = boxCenter + (i == 1 ? 1.8 : i == 2 ? -1.8 : boxCenter);
                    break;
                case 4: vector3.x = boxCenter + (i == 1 ? 2.4 : i == 2 ? 0.8 : i == 3 ? -0.8 : -2.4);
                    break;
            }
                break;
        }
        //setting y position
        vector3.y = box3.max.y - box3.min.y;

        //setting z position
        const boxTop = box3.min.z;

        switch (boxValue) {
            case 1: switch (knobCount) {
                case 1:
                case 2: vector3.z = i == 1 ? boxTop + (-(boxTop) / 3) : boxTop + (-(boxTop) / 3) + i;
                    break;
            }
                break;
            case 2: switch (knobCount) {
                case 1:
                case 2: vector3.z = boxTop + (-(boxTop) / 3);
                    break;
                case 3: vector3.z = i == 1 || i == 2 ? boxTop + (-(boxTop) / 3) : boxTop + i;
            }
                break;
            case 3: switch (knobCount) {
                case 1:
                case 2:
                case 3:
                case 4: vector3.z = boxTop + (-(boxTop) / 3);
                    break;
            }
                break;
        }
        knob.position.set(...vector3);
        knob.castShadow = true;

        pedal.add(knob);
    }

    scene.add(pedal);
}

function setColor() {
    const box = { ...boxTypes[values.box] };
    const boxColor = box.children[0].material.color;
    boxColor.set(values.color);
}

//Setting canvas/options size
const sizes = {
    width: window.innerWidth > 1000 ? (window.innerWidth / 2) - 100 : (window.innerWidth / 2) + 100,
    height: window.innerWidth > 1000 ? Math.max((window.innerWidth / 3) - 100, 300) : Math.max((window.innerWidth / 3), 300)
}
const optionsSizes = {
    width: `${sizes.width}px`,
    height: `${sizes.height}px`
}

options.style.width = optionsSizes.width
options.style.height = optionsSizes.height

//Updating canvas/options sizes on window resize
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth > 1000 ? (window.innerWidth / 2) - 100 : (window.innerWidth / 2) + 100;
    sizes.height = window.innerWidth > 1000 ? Math.max((window.innerWidth / 3) - 100, 300) : Math.max((window.innerWidth / 3), 300);

    // Update options
    optionsSizes.width = `${sizes.width}px`;
    optionsSizes.height = `${sizes.height}px`;
    options.style.width = optionsSizes.width;
    options.style.height = optionsSizes.height;

    // Update camera
    camera.position.x = window.innerWidth > 480 ? 11 : 12;
    camera.position.y = window.innerWidth > 480 ? 10 : 11;
    camera.position.z = window.innerWidth > 480 ? 11 : 12;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//---SCENE---///
const scene = new THREE.Scene();

//---GEOMETRIES---///

const pedal = new THREE.Group();

const boxTypes = {
    1: new THREE.Group(),

    2: new THREE.Group(),

    3: new THREE.Group()
}

const knobTypes = {
    1: new THREE.Group(),

    2: new THREE.Group(),

    3: new THREE.Group()
}

const knobGeometry = {
    1: new THREE.CylinderGeometry(0.6, 0.6, 1, 15),
    2: new THREE.CylinderGeometry(0.6, 0.6, 1, 5),
    3: new THREE.CylinderGeometry(0.55, 6, 1, 15)
};

const floorGeometry = new THREE.CylinderGeometry(8, 7.95, 0.3, 50);

//---MATERIALS---///
const knobMaterial = new THREE.MeshStandardMaterial({ color: 0x101010 });

const floorMaterial = new THREE.MeshStandardMaterial();
floorMaterial.color.set(0xF8F8FF);

//---MESHES---///

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;

//Add to scene
scene.add(floor);

//---CAMERA AND CONTROLS---///
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.x = window.innerWidth > 480 ? 11 : 14;
camera.position.y = window.innerWidth > 480 ? 10 : 13;
camera.position.z = window.innerWidth > 480 ? 11 : 14;
camera.lookAt(floor.position)

const controls = new OrbitControls(camera, canvas);
controls.target = floor.position;
controls.enableDamping = true;
controls.rotateSpeed = 0.3;
controls.enableZoom = false;
controls.enabled = false;
controls.maxPolarAngle = 2;
controls.minPolarAngle = 0.9;

scene.add(camera);

//---LIGHTS---///
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
const cameraLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
const topLight = new THREE.DirectionalLight(0xFFFFFF, 2);

cameraLight.castShadow = true;
cameraLight.target = floor;
cameraLight.position.set(camera.position.x, camera.position.y, camera.position.z);

topLight.target = floor;
topLight.position.set(0, 5, 0);

scene.add(ambientLight, cameraLight, topLight);

//---RENDERER---///
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})

renderer.shadowMap.enabled = true;

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.render(scene, camera)

//---ANIMATION---///

function animate() {

    controls.update();

    renderer.render(scene, camera);

    cameraLight.position.set(camera.position.x, camera.position.y, camera.position.z);

    setTimeout(function () {
        requestAnimationFrame(animate);
    }, 1000 / 120);
}

animate();


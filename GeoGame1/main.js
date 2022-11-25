import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js"
import * as dat from 'https://cdn.skypack.dev/dat.gui';

import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


// URL imports for images 
const stars1 = new URL('./assets/image/stars1.jpg', import.meta.url).href;
const stARS = new URL('./assets/image/stARS.jpeg', import.meta.url).href;
const fake = new URL('./assets/image/fake.jpeg', import.meta.url).href;
const mypic = new URL('./assets/image/mypic.jpg', import.meta.url).href;
// Blender moneky import from Blender
const monkeyUrl = new URL('./assets/image/monkey.glb', import.meta.url); //also need GLTFLoader to load this type of file

// WebGLRenderer and shadow properties
const renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true; //assign object recieving shadows(planeGeo) and giving shadows on items
renderer.setSize(window.innerWidth, window.innerHeight);
//append to body of html
document.body.appendChild(renderer.domElement);

// add the scene 
const scene = new THREE.Scene();
//add camera and responsiveness 
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight,
    0.1, 
    1000
);

    //allows for users to control objects append to dom
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-10, 30, 30);
orbit.update();

    //install helper is a tool to help us as a guide
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


    //now lets put something in our scence box center
const boxGeomety = new THREE.BoxGeometry(2,2,2);  
const boxMaterial = new THREE.MeshStandardMaterial({ 
    color: 'yellow'});
const box = new THREE.Mesh(boxGeomety, boxMaterial);
scene.add(box);

// floor plane and will add grids
const planeGeometry = new THREE.PlaneGeometry(50, 50);    
    const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFF,
    side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane); 
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true; 

        //we need gridHelper to organize into grid
const gridHelper = new THREE.GridHelper(50);
scene.add(gridHelper);

        //sphere ball 
const sphereGeometry = new THREE.SphereGeometry(5, 0, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 'blue', wireframe: false});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true; 

//managing lights can be tricky so threejs has dirct.LightHelpers as well as spotlights
const spotLight = new THREE.SpotLight(0xFFffff);
scene.add(spotLight);
spotLight.position.set(-75, 150, 0);
spotLight.castShadow = true; 
spotLight.angle = 0.5; //wide angles makes shoadows pixelted 
//add to the scene
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//we can create fog effect in our scenes
scene.fog = new THREE.Fog(0xffffff, 0 , 200);
// scene.fog = new THREE.FogExp2(0xffffff, 0.01);

    //qw can clear the black background 
    renderer.setClearColor(0xfff);
    //to change backgorund to an image we need textureLoader and load it with images
 const textureLoader = new THREE.TextureLoader(); //instantiate loader
    scene.background = textureLoader.load(stars1); 
   
//GLTF folder reader to load the monkey from blender
const assetLoader = new GLTFLoader();
assetLoader.load(monkeyUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(5, 5, -7);
}, undefined, function(error) {
    console.log(error);
});

   //to change properties we use options with gui
const gui = new dat.GUI();

    //if we want to change color of sphere, we can manipulate these to create effects using gui
const options = {
    sphereColor: '#0000ff',
    wireframe: false,
    speed: 0.01,
    angle: 0.09,
    penumbra: 0,
    intensity: 1 
};

gui.addColor(options, 'sphereColor').onChange(function(e) {
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e) {
    sphere.material.wireframe = e; 
});

    //say we want to make the ball bounce starting with step 0
let step = 0;
    // let speed = 0.1; moved to options object as properties 

gui.add(options, 'speed', 0, 0.5);
gui.add(options, 'angle', 0, 0.14);
gui.add(options, 'penumbra', 0, 1.5);
gui.add(options, 'intensity', 0, 5);


    //box2 for set sides mypic profile
const box2Geometry = new THREE.BoxGeometry(7, 7, 7); 
const box2Material = new THREE.MeshBasicMaterial({ 
   color: 0x00ff00,
    map: textureLoader.load(stARS)//we can set this new box to image

});

    //array to apply texture on each side of the cube...
const box2eachSideMaterial = [
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stARS)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars1)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stARS)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars1)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(mypic)}),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stARS)}),
];

    //const box2 = new THREE.Mesh(box2Geometry, Box2Material);
const box2 = new THREE.Mesh(box2Geometry, box2eachSideMaterial);
scene.add(box2);
box2.position.set(10, 10, 5);
    box2.material.map = textureLoader.load(stARS); //to create each side with different texture must create an array above

        // plane2 fence geometry
        const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        const plane2Material = new THREE.MeshBasicMaterial({
            color: 'red',
            wireframe: true

        });
        const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
        scene.add(plane2);
        plane2.position.set(10, 10, -15);

        //we can change the array holding the position attributes of 
        plane2.geometry.attributes.position.array[0] -= 5 * Math.random();
        plane2.geometry.attributes.position.array[1] -= 5 * Math.random();
        plane2.geometry.attributes.position.array[2] -= 5 * Math.random();
        const lastPointZ = plane2.geometry.attributes.position.array.length -1;
        plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();
        


        // now say we want users to interact with objects in our 3d landing page 
    //1. this is called raycasting where camera is begin point and cursor is desitination using Vector2 
const mousePosition = new THREE.Vector2();
    //2. then add even listerent to capture mouse activity 
window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 -1;
    mousePosition.y = (e.clientY / window.innerHeight) * 2 + 1;
});
//3. create instance of rayCaster Class ..then set the two ends inside the animate function using setFromCamera Method
const rayCaster = new THREE.Raycaster(); 

const sphereId = sphere.id; //to be change color 
box2.name = 'theBox'; //if box i chosen or items is chosen 

    // //now we can rotate box we put into function
function animate(time) {
    // box.rotation.x += 0.01;
    box.rotation.x = time /1000 ;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 20 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
            //then create a const to intersect the cursor with raycaster on mouse position 
    const intersects = rayCaster.intersectObjects(scene.children); 
    console.log(intersects);
        //to choose objects on screen usually with objectId
    for(let i = 0; i < intersects.length; i++ ) {
        if(intersects[i].object.id === sphereId);
            intersects[i].object.material.color.set(0xfffff0);

            if(intersects[i].object.name === 'theBox') {
                intersects[i].object.rotation.x = time / 1000;
                intersects[i].object.rotation.y = time / 1000;
            }
    }
        // of course we need ot render our camera and scene 
    renderer.render (scene, camera);
}
//render our animation
renderer.setAnimationLoop(animate);

//to make it repsonive
window.addEventListener('resize', function() {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

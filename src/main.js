import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';


// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'


//to create 3d website we need 3 things: 1.a Scene 2.a Camera 3. a Renderer
const scene = new THREE.Scene(); //scene is like a container

//choose from camera types 
const camera = new THREE.PerspectiveCamera(
  80, window.innerWidth / window.innerHeight, 0.1, 1000 
  )

  //renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas1'),
  });
  renderer.setPixelRatio(window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );


  //to add object we need 3 things: 1.geomtry or vector points 2. material/texture of/for the geometry 3. a Mesh == geomtry + material 
  const torusGeometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
  // const torusMaterial = new THREE.MeshBasicMaterial({color: 0xff6347, wireframe: true });
  const torusMaterial = new THREE.MeshStandardMaterial({color: 0xff6347, wireframe: true }); //changing material type requires lighting to show
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.y += 10;
  torus.position.x += -35;
  scene.add(torus);

  //choose from different lighitng types to the scene to show objects
  const pointLight = new THREE.PointLight(0xffffff); //this is like a light bulb
  pointLight.position.set( 5, 5, 5 );
  scene.add(pointLight);

  //ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff); //this is like a flood light in the room 
  scene.add(ambientLight);

  //lightHelpers help us position the directio of light source
  const lightHelpers = new THREE.PointLightHelper(pointLight);
  const gridHelper = new THREE.GridHelper( 200, 50 ); //helps us perspective grids default is level perspective 
  scene.add(lightHelpers, gridHelper );

  //OrbitControls makes it interactive with website-pass args for elements we want to control
  const controls = new OrbitControls(camera, renderer.domElement); //listen mouse events on domElements to update scene or camera 

  //adding function to random generated stars to the scene
  function addStars() {
    const starGeometry = new THREE.SphereGeometry(0.25, 24, 24 );
    const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff}) 
    const stars = new THREE.Mesh( starGeometry, starMaterial );
    
    //now to randomly generate them in an array then using 'randFloatSpread()' 
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100) ); //then rand gen. nums used to set position of start
    stars.position.set(x,y,z);
    scene.add(stars);
  } // to add as many stars we want we need an array of with amount and pass addStars as args
  Array(400).fill().forEach(addStars);

  //set space image as background
  const spaceTexture = new THREE.TextureLoader().load('assets/space.jpg');
  scene.background= spaceTexture;

  //texture mapping is 2 dimensional pixel & mapping it to 3d geometry 
  const masoodTexture = new THREE.TextureLoader().load('assets/mypic.jpg'); //mapped my pic to geometry 

  const masoodMesh = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial( { map: masoodTexture })
  ); //now add this to the scene
    scene.add(masoodMesh); 


    const moonTexture = new THREE.TextureLoader().load('assets/moon.jpg');
    const normalTexture = new THREE.TextureLoader().load('assets/normal.jpg')
    //adding other elements -moon for example
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(3,32,32), 
      new THREE.MeshStandardMaterial( {
        map: moonTexture, 
        normalMap: normalTexture
      })
    ); 
    moon.position.z = 30;
    moon.position.setX(-10);
    scene.add(moon);


    const sphereGeometry = new THREE.SphereGeometry( 15, 32, 16 );
    const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphere.position.set(-30,60,-80)
    scene.add( sphere );

  //heart
const x = 0, y = 0;
const heartShape = new THREE.Shape();

heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

const heartGeometry = new THREE.ShapeGeometry( heartShape );
const heartMaterial = new THREE.MeshBasicMaterial( { color: 'red' } );
const heartMesh = new THREE.Mesh( heartGeometry, heartMaterial ) ;
heartMesh.position.set(5,5,-30);
scene.add( heartMesh );

//start burst in background
const burstGeometry = new THREE.TorusKnotGeometry( 120, 3, 64, 7, 33, 17 );
const burstMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const burst = new THREE.Mesh( burstGeometry, burstMaterial );
burst.position.set(300, -300, -700);  //13 17-
scene.add( burst );

const knotGeometry = new THREE.TorusKnotGeometry( 120, 3, 64, 7 );
const knotMaterial = new THREE.MeshBasicMaterial( { color: 'blue' } );
const torusKnot = new THREE.Mesh( knotGeometry, knotMaterial );
torusKnot.position.set(0, 300, -300);  //13 17-
scene.add( torusKnot );


    //now to move camera when scrolling using an eventHandler called getBoundingClientRect()
    function moverCamera() {

      const userScrol = document.body.getBoundingClientRect().top; //measure distance of cursor from top
      moon.rotation.x += 0.05; 
      moon.rotation.y +=0.075; 
      moon.rotation.z +=  0.5;

      masoodMesh.rotation.y += 0.01; //our mesh must rotate with camera 
      masoodMesh.rotation.z += 0.01;
      
      burst.rotation.z += 0.02;

      camera.position.z = userScrol * - 0.01;
      camera.position.x = userScrol * - 0.0002;
      camera.position.y = userScrol * - 0.002;

    }
    document.body.onscroll = moverCamera; 
  

 window.addEventListener('resize', function() {
   renderer.setSize(this.window.innerWidth, this.window.innerHeight);
   renderer.setPixelRatio(this.window.devicePixelRatio);
   camera.aspect= window.innerWidth, window.innerHeight

 })
//now to for renderer to render our camera and scene 
  // renderer.render( scene, camera ); //automate this making it a function 
  function animate() {
    requestAnimationFrame(animate); 
    
    //we can animate our elements/gemoetrt here
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    torus.rotation.z += 0.01;
    torusKnot.rotation.z += 0.02;

    renderer.render(scene, camera);
  }
  animate();






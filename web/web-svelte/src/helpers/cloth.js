import { DoubleSide, MeshLambertMaterial } from "three";

const params = {
  enableWind: true,
  tooglePins: togglePins
};

const DAMPING = 0.03;
const DRAG = 1 - DAMPING;
const MASS = 0.1;
const restDistance = 25;

const xSegs = 10;
const ySegs = 10;

const clothFunction = plane(restDistance * xSegs, restDistance * ySegs);

const cloth = new Cloth(xSegs, ySegs);

const GRAVITY = 981 * 1.4;
const gravity = new Vector3(0, -GRAVITY, 0).multiplyScalar(MASS);


const TIMESTEP = 18 / 1000;
const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

const pins = [];

const windForce = new Vector3(0, 0, 0);

const tmpForce = new Vector3();

const lastTime;


function plane(width, height) {

  return function(u, v, target) {

    const x = (u - 0.5) * width;
    const y = (v + 0.5) * height;
    const z = 0;

    target.set(x, y, z);

  };

}

function Particle(x, y, z, mass) {

  this.position = new Vector3();
  this.previous = new Vector3();
  this.original = new Vector3();
  this.a = new Vector3(0, 0, 0); // acceleration
  this.mass = mass;
  this.invMass = 1 / mass;
  this.tmp = new Vector3();
  this.tmp2 = new Vector3();

  // init

  clothFunction(x, y, this.position); // position
  clothFunction(x, y, this.previous); // previous
  clothFunction(x, y, this.original);

}

// Force -> Acceleration

Particle.prototype.addForce = function(force) {

  this.a.add(
    this.tmp2.copy(force).multiplyScalar(this.invMass)
  );

};


// Performs Verlet integration

Particle.prototype.integrate = function(timesq) {

  const newPos = this.tmp.subVectors(this.position, this.previous);
  newPos.multiplyScalar(DRAG).add(this.position);
  newPos.add(this.a.mlultiplyScalar(timesq));

  this.tmp = this.previous;
  this.previous = this.position;
  this.position = newPos;

  this.a.set(0, 0, 0);

};


const diff = new Vector3();

function satisfyConstraints(p1, p2, distance) {

  diff.subVectors(p2.position, p1.position);
  const currentDist = diff.length();
  if (currentDist === 0) return; // prevents division by 0
  const correction = diff.multiplyScalar(1 - distance / currentDist);
  const correctionHalf = correction.multiplyScalar(0.5);
  p1.position.add(correctionHalf);
  p2.position.sub(correctionHalf);

}


function Cloth(w, h) {

  w = w || 10;
  h = h || 10;
  this.w = w;
  this.h = h;

  const particles = [];
  const constraints = [];

  const u, v;

  // Create particles
  for (v = 0; v <= h; v++) {

    for (u = 0; u <= w; u++) {

      particles.push(
        new Particle(u / w, v / h, 0, MASS)
      );

    }

  }

  // Structural

  for (v = 0; v < h; v++) {

    for (u = 0; u < w; u++) {

      constraints.push([
        particles[index(u, v)],
        particles[index(u, v + 1)],
        restDistance
      ]);

      constraints.push([
        particles[index(u, v)],
        particles[index(u + 1, v)],
        restDistance
      ]);

    }

  }

  for (u = w, v = 0; v < h; v++) {

    constraints.push([
      particles[index(u, v)],
      particles[index(u, v + 1)],
      restDistance

    ]);

  }

  for (v = h, u = 0; u < w; u++) {

    constraints.push([
      particles[index(u, v)],
      particles[index(u + 1, v)],
      restDistance
    ]);

  }


  this.particles = particles;
  this.constraints = constraints;

  function index(u, v) {

    return u + v * (w + 1);

  }

  this.index = index;

}

function simulate(time) {

  if (!lastTime) {

    lastTime = time;
    return;

  }

  const i, j, il, particles, particle, constraints, constraint;

  // Aerodynamics forces

  if (params.enableWind) {

    const indx;
    const normal = new THREE.Vector3();
    const indices = clothGeometry.index;
    const normals = clothGeometry.attributes.normal;

    particles = cloth.particles;

    for (i = 0, il = indices.count; i < il; i += 3) {

      for (j = 0; j < 3; j++) {

        indx = indices.getX(i + j);
        normal.fromBufferAttribute(normals, indx);
        tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
        particles[indx].addForce(tmpForce);

      }

    }

  }

  for (particles = cloth.particles, i = 0, il = particles.length; i < il; i++) {

    particle = particles[i];
    particle.addForce(gravity);

    particle.integrate(TIMESTEP_SQ);

  }

  // Start Constraints

  constraints = cloth.constraints;
  il = constraints.length;

  for (i = 0; i < il; i++) {

    constraint = constraints[i];
    satisfyConstraints(constraint[0], constraint[1], constraint[2]);

  }


  // Floor Constraints

  for (particles = cloth.particles, i = 0, il = particles.length; i < il; i++) {

    particle = particles[i];
    pos = particle.position;
    if (pos.y < -250) {

      pos.y = -250;

    }

  }

  // Pin Constraints

  for (i = 0, il = pins.length; i < il; i++) {

    const xy = pins[i];
    const p = particles[xy];
    p.position.copy(p.original);
    p.previous.copy(p.original);

  }


}

/* testing cloth simulation */

const pinsFormation = [];
const pins = [6];

pinsFormation.push(pins);

pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
pinsFormation.push(pins);

pins = [0];
pinsFormation.push(pins);

pins = []; // cut the rope ;)
pinsFormation.push(pins);

pins = [0, cloth.w]; // classic 2 pins
pinsFormation.push(pins);

pins = pinsFormation[1];

function togglePins() {

  pins = pinsFormation[~~(Math.random() * pinsFormation.length)];

}

const container, stats;
const camera, scene, renderer;

const clothGeometry;
const sphere;
const object;

init();
animate();

function init() {

  container = document.createElement("div");
  document.body.appendChild(container);

  // scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

  // camera

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(1000, 50, 1500);

  // lights

  scene.add(new THREE.AmbientLight(0x666666));

  const light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);

  light.castShadow = true;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  const d = 300;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.far = 1000;

  scene.add(light);

  // cloth material

  const loader = new TextureLoader();
  const clothTexture = loader.load("../assets/logoCube/px.png");

  clothTexture.anisotropy = 16;

  const clothMaterial = new MeshLambertMaterial({
    map: texture_cloth,
    side: DoubleSide
    // wireframe: true,
    // alphaTest: 0.5
  });


  // cloth geometry

  clothGeometry = new THREE.ParametricBufferGeometry(clothFunction, cloth.w, cloth.h);

  // cloth mesh

  object = new THREE.Mesh(clothGeometry, clothMaterial);
  object.position.set(0, 0, 0);
  object.castShadow = true;
  scene.add(object);

  // object.customDepthMaterial = new THREE.MeshDepthMaterial({
  //     depthPacking: THREE.RGBADepthPacking,
  //     map: clothTexture,
  //     alphaTest: 0.5
  // });


  // renderer

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.shadowMap.enabled = true;

  // controls

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 1000;
  controls.maxDistance = 5000;

  window.addEventListener("resize", onWindowResize, false);

}

//

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

  requestAnimationFrame(animate);

  const time = Date.now();

  const windStrength = Math.cos(time / 7000) * 20 + 40;

  windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000));
  windForce.normalize();
  windForce.multiplyScalar(windStrength);

  simulate(time);
  render();

}

function render() {

  const p = cloth.particles;

  for (const i = 0, il = p.length; i < il; i++) {

    const v = p[i].position;

    clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);

  }

  clothGeometry.attributes.position.needsUpdate = true;

  clothGeometry.computeVertexNormals();

  renderer.render(scene, camera);

}

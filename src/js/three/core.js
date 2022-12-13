/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable no-return-await */
/* eslint-disable no-unreachable */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import * as THREE from 'three';
import CameraControls from 'camera-controls';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AxesHelper } from 'three';
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export default class Core {
  constructor({ dom }) {
    // THREE.Cache.enabled = true;

    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.container = dom;
    this.width = this.container.offsetWidth || this.container.innerWidth;
    this.height = this.container.offsetHeight || this.container.innerHeight;
    this.aspect = this.width / this.height;
    // console.log(window.innerWidth)
    this.isMobile = this.isMobile();

    this.clock = new THREE.Clock(true);
    this.raycaster = new THREE.Raycaster();
    this.mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
    };
    this.point = {
      x: 0,
      y: 0,
      z: 0,
      prevX: 0,
      prevY: 0,
    };
    this.touch = {
      x: 0,
      y: 0,
    };
    this.pointer = new THREE.Vector2();
    this.time = 0;
    this.cameraMoving = 0;
    this.dollyValue = 42;
    this.horizontallOffset = -10;
    // this.horizontallOffset = 0;
    this.isPlaying = false;
    this.isAnimationFinished = false;
    this.onResizeEvents = [];
    this.onRenderEvents = [];
    this.loadAssetsFunctions = [];

    this.setRenderer();
    this.setCamera();

    CameraControls.install({ THREE });
    this.setCameraControls();

    this.setLighting();
    this.setEventListeners();

    // const axesHelper = new THREE.AxesHelper(100);
    // this.scene.add(axesHelper);
  }

  loadAssets() {
    return Promise.all(this.loadAssetsFunctions.map(async (fn) => await fn()));
  }

  isMobile() {
    if (this.width <= 400) {
      return true;
    }

    return false;

    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      // tablet
      return true;
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      // mobile
      return true;
    }
    // desktop
    return false;
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    if (this.isMobile) {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    } else {
      this.renderer.setPixelRatio(1.2);
    }
    this.renderer.setSize(this.width, this.height);
    // this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    // this.renderer.autoClear = false;
    this.container.appendChild(this.renderer.domElement);
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.aspect,
      0.01,
      3000,
    );
  }

  async setCameraControls() {
    this.controls = new CameraControls(this.camera, this.renderer.domElement);
    this.controls.setTarget(0, 0, 0);
    this.controls.infinityDolly = false;
    // this.controls.enabled = false;

    this.controls.mouseButtons.left = CameraControls.ACTION.NONE;
    // this.controls.mouseButtons.middle = CameraControls.ACTION.NONE;
    // this.controls.mouseButtons.wheel = CameraControls.ACTION.ROTATE;
    this.controls.mouseButtons.right = CameraControls.ACTION.NONE;
    this.controls.touches.one = CameraControls.ACTION.TOUCH_DOLLY_TRUCK;
    this.controls.touches.two = CameraControls.ACTION.NONE;
    this.controls.touches.three = CameraControls.ACTION.NONE;

    this.controls.minPolarAngle = THREE.MathUtils.degToRad(0);
    this.controls.maxPolarAngle = THREE.MathUtils.degToRad(0);
    this.controls.minAzimuthAngle = THREE.MathUtils.degToRad(0);
    this.controls.maxAzimuthAngle = THREE.MathUtils.degToRad(0);
    this.controls.minDistance = this.dollyValue;
    this.controls.maxDistance = this.dollyValue + 5;

    this.initialPolarDegreeInRad = THREE.MathUtils.degToRad(0);
    this.initialAzimuthDegreeInRad = THREE.MathUtils.degToRad(0);

    await Promise.all([
      this.controls.dollyTo(this.dollyValue, true),
      this.controls.setFocalOffset(this.horizontallOffset, 0),
      this.controls.rotateTo(
        this.initialAzimuthDegreeInRad,
        this.initialPolarDegreeInRad,
        true,
      ),
    ]);
    return;
    if (!this.isMobile) { this.controls.enabled = true; }
  }

  setLighting() {
    const light1 = new THREE.AmbientLight(0xFFFFFF, 1);
    light1.name = 'ambient_light';
    this.scene.add(light1);
  }

  setEventListeners() {
    window.addEventListener(
      'pointermove',
      this.onPointerMove.bind(this),
    );
    // window.addEventListener(
    //     'touchmove',
    //     this.TouchMoveManager.bind(this),
    //     false
    // );
    // window.addEventListener(
    //     'touchstart',
    //     this.TouchStartManager.bind(this),
    //     false
    // );

    // window.addEventListener("mousewheel", this.MouseWheelHandler.bind(this), false);
    // window.addEventListener("DOMMouseScroll", this.MouseWheelHandler.bind(this), false);
    // window.addEventListener('touchend', this.TouchEndManager.bind(this), false);
    window.addEventListener('click', this.ClickManager.bind(this), false);
  }

  MouseWheelHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    return false;
  }

  onPointerMove(event) {
    // event.preventDefault();

    if (this.isAnimationFinished && this.controls.camera) {
      const pp = {
        x: 0,
        y: 0,
      };
      pp.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
      pp.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    }

    const isCameraMoving = (this.time < this.cameraMoving);
    if (event.isPrimary === false || isCameraMoving) {
      // cancel action
      this.mouse.x = 0;
      this.mouse.y = 0;
      return;
    }

    this.mouse.x = event.clientX - this.width / 2;
    this.mouse.y = event.clientY - this.height / 2;
  }

  ClickManager(event) {
    // event.preventDefault();

    this.mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.RaycastHandler();
  }

  TouchMoveManager(event) {
    event.preventDefault();
  }

  TouchStartManager(event) {
    const touch = event.changedTouches[0];
    if (touch.clientX && touch.clientY) {
      this.touch = {
        x: touch.clientX,
        y: touch.clientY,
      };
    }
  }

  TouchEndManager(event) {
    const touch = event.changedTouches[0];

    if (
      !touch
      || !this.touch
      || event.target.tagName === 'A'
      || event.target.tagName === 'BUTTON'
    ) { return; }

    const diff = {
      x: Math.abs(this.touch.x - touch.clientX),
      y: Math.abs(this.touch.y - touch.clientY),
    };

    // if user drags
    if (diff.x > 0.2 || diff.y > 0.2) return;

    this.touch.x = (touch.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.touch.y = -(touch.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.RaycastHandler();
  }

  RaycastHandler() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.mouse.x = 0;
    this.mouse.y = 0;

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true,
    );
    console.log('🐞: Core -> ClickManager -> intersects', intersects);
    // console.log(intersects[0].point)

    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.callback) {
        intersects[i].object.callback();
        return;
      }
    }
  }

  getDomPosition(position) {
    if (!this.controls.camera) {
      return;
    }

    const { camera } = this;
    const tempV = new THREE.Vector3();
    const cameraToPoint = new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    const normalMatrix = new THREE.Matrix3();

    normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
    // get the camera's position
    camera.getWorldPosition(cameraPosition);
    tempV.copy(position);
    tempV.applyMatrix3(normalMatrix);
    cameraToPoint.copy(position);
    cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();

    // get the normalized screen coordinate of that position
    // x and y will be in the -1 to +1 range with x = -1 being
    // on the left and y = -1 being on the bottom
    tempV.copy(position);
    tempV.project(camera);

    // convert the normalized position to CSS coordinates
    const x = (tempV.x * 0.5 + 0.5) * this.width;
    const y = (tempV.y * -0.5 + 0.5) * this.height;
    const z = (-tempV.z * 0.5 + 0.5) * 100000;

    return {
      x,
      y,
      z,
    };
  }

  getAngleBetweenTwoVectorsInRad(origin, position, toNormalize = true) {
    const posV = new THREE.Vector3(position.x, position.y, position.z);
    let angle = origin.angleTo(posV);

    if (position.x <= 0) {
      angle *= -1;
    }

    if (!toNormalize) {
      return angle;
    }
    return this.normalizeAngle(angle);
  }

  normalizeAngle(angle) {
    angle = THREE.MathUtils.radToDeg(angle);

    if (angle < 0) {
      angle += 360;
    }

    return THREE.MathUtils.degToRad(angle);
  }

  color(color) {
    return new THREE.Color(color);
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this), false);
  }

  resize() {
    this.fixHeightProblem();

    this.width = this.container.offsetWidth || this.container.innerWidth;
    this.height = this.container.offsetHeight || this.container.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.renderer.render(this.scene, this.camera);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.onResizeEvents.forEach((fn) => {
      fn({
        x: this.width,
        y: this.height,
      });
    });

    this.renderer.render(this.scene, this.camera);
  }

  fixHeightProblem() {
    // The trick to viewport units on mobile browsers
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.time = 0;
      this.isAnimationFinished = true;
      this.render();
    }
  }

  updateControls(delta) {
    this.controls.update(delta);
  }

  renderManager() {
    // if (!this.isPlaying) return;

    const delta = this.clock.getDelta();

    this.onRenderEvents.forEach((fn) => {
      fn({
        time: this.time,
        delta,
        camera: this.controls.camera,
        point: this.point,
      });
    });

    if (this.isPlaying) { this.time += 0.01; }
    this.updateControls(delta);
  }
}

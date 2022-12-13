/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { gsap } from 'gsap';
import CubeGlb from '../../models/cube.glb';

const cubeBlackMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xff0000),
});
const cubeWhiteMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xff0000),
});
const whiteColor = new THREE.Color(0xffffff);
const blackColor = new THREE.Color(0x000000);

export default class Cube {
  constructor() {
    this.mesh = null;
  }

  updateMaterialColor(obj) {
    let color;

    if (!obj.material) {
      obj.material = cubeBlackMaterial;
    }

    if (obj.material.color.equals(whiteColor)) {
      color = blackColor;
    } else {
      color = whiteColor;
    }

    const initial = new THREE.Color(obj.material.color.getHex());
    gsap.to(initial, {
      duration: 0.1,
      r: color.r,
      g: color.g,
      b: color.b,
      onUpdate: () => {
        obj.material.color = initial;
      },
      onComplete: () => {
        obj.material.needsUpdate = true;
      },
    });

    obj.children.forEach((ch) => {
      this.updateMaterialColor(ch);
    });
  }

  loadAssets() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const loadMesh = new Promise((resolve) => {
      gltfLoader.load(
        CubeGlb,
        (gltf) => {
          this.mesh = gltf.scene;
          console.log(this.mesh);
          resolve();
        },
      );
    });

    return loadMesh;
  }

  resize(resolution) {
  }

  createMesh() {
    // this.mesh.position.x = 10;
    // this.mesh.position.y = 20;
    this.mesh.rotateX(THREE.MathUtils.degToRad(-55 - 10));
    this.mesh.rotateY(THREE.MathUtils.degToRad(-135 - 15));
    this.play();

    return this.mesh;
  }

  play() {
    this.mesh.scale.x = 1;
    this.mesh.scale.y = 1;
    this.mesh.scale.z = 1;
  }

  stop() {
    // this.mesh.visible = false;
    this.mesh.scale.x = 0;
    this.mesh.scale.y = 0;
    this.mesh.scale.z = 0;
  }

  render({ time }) {
  }
}

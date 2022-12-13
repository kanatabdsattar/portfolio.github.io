/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable no-restricted-properties */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unreachable */
/* eslint-disable no-sequences */
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { toggler, themeToggle } from '../elements/theme-toggle';
import { throttle } from '../utils';
import Box from './cube';
import Core from './core';
// import { CustomEase } from "gsap/dist/CustomEase";
// gsap.registerPlugin(CustomEase);

export default class Sketch extends Core {
  constructor(options) {
    super(options);

    this.box = new Box();
    this.onRenderEvents.push(this.box.render.bind(this.box));
    this.loadAssetsFunctions.push(this.box.loadAssets.bind(this.box));

    // this.setGuiSettings();

    this.setupResize();
    this.resize();
    this.animate();

    this.instantiateObjects();
  }

  isLaunched() {
    return window.localStorage.getItem('is_launched');
  }

  setGuiSettings() {
    this.settings = {
      morph: false,
      exposure: 0.6,
      // bloomStrength: .7,
      bloomStrength: 1.3,
      bloomThreshold: 0,
      bloomRadius: 0,
      point1: false,
      point2: false,
      point3: false,
      point4: false,
      point5: false,
      point6: false,
      point7: false,
      point8: false,
      point9: false,
      truck1: false,
      truck2: false,
    };
    // return;
    // this.gui = new GUI();
    // this.gui.add(this.settings, 'morph').onChange(() => {
    //   this.morph();
    // });
    // this.gui.add(this.settings, 'exposure', 0.1, 2).onChange((value) => {
    //   this.changeExposure(value);
    // });
    // this.gui.add(this.settings, 'bloomThreshold', 0.0, 1.0).onChange((value) => {
    //   this.bloomPass.threshold = Number(value);
    // });
    // this.gui.add(this.settings, 'bloomStrength', 0.0, 3.0).onChange((value) => {
    //   this.changeBloomStrength(value);
    // });
    // this.gui.add(this.settings, 'bloomRadius', 0.0, 1.0).step(0.01).onChange((value) => {
    //   this.bloomPass.radius = Number(value);
    // });
    // this.gui.add(this.settings, 'truck1').onChange(() => {
    //   this.controls.truck(2, 0, true);
    // });
    // this.gui.add(this.settings, 'truck2').onChange(() => {
    //   this.controls.truck(-2, 0, true);
    // });
  }

  async instantiateObjects() {
    await this.loadAssets();

    this.addBox();
    this.setThemeToggler();
    this.play();
  }

  addBox() {
    console.log(this.box.mesh);
    const mesh = this.box.createMesh();
    this.scene.add(mesh);
    return;
    const control = new TransformControls(this.camera, this.renderer.domElement);
    control.mode = 'rotate';
    control.attach(mesh);
    this.scene.add(control);

    control.addEventListener('dragging-changed', () => {
      console.log(mesh.rotation);
    });
  }

  setThemeToggler() {
    toggler.onclick = throttle(() => {
      this.box.updateMaterialColor(this.box.mesh);
      themeToggle();
    },
    1000);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    this.renderManager();
    this.renderer.render(this.scene, this.camera);
  }
}
const sketch = new Sketch({
  dom: document.getElementById('container'),
});

sketch.fixHeightProblem();

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MindARThree } from "mindar-image-three";
import { mockWithImage } from "./camera-mock.js";

const mixers = [];
const clock = new THREE.Clock();

const mindarThree = new MindARThree({
  container: document.querySelector("#container"),
  imageTargetSrc:
    "https://cdn.glitch.global/a0eb2c8b-2605-4566-96be-fb621862d4ba/targets1.mind?v=1680262737334",
  autoStart: false,
  filterMinCF: 0.0001,
  filterBeta: 0.001,
});

// mockWithImage("./images/mvgtt.jpg");
const { renderer, scene, camera } = mindarThree;
const loader = new GLTFLoader();
const anchor = mindarThree.addAnchor(0);

loader.load(
  "https://cdn.glitch.me/a0eb2c8b-2605-4566-96be-fb621862d4ba/mv2801.glb?v=1680261767978",
  function (gltf) {
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.rotation.set(0, 1, 0);

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
    mixers.push(mixer);
    anchor.group.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
anchor.group.add(light);

const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", () => {
  
  mindarThree.start();
  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    for (const mixer of mixers) {
      mixer.update(delta);
    }
    renderer.render(scene, camera);
  });
});

const stopButton = document.querySelector("#stopButton");
stopButton.addEventListener("click", () => {
  mindarThree.stop();
  mindarThree.renderer.setAnimationLoop(null);
});

const elem = document.querySelector("#screenshot");
elem.addEventListener("click", () => {
  capture(mindarThree);
});

const capture = (mindarThree) => {
  const { video, renderer, scene, camera } = mindarThree;
  const renderCanvas = renderer.domElement;

  // output canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;

  const sx =
    (((video.clientWidth - renderCanvas.clientWidth) / 2) * video.videoWidth) /
    video.clientWidth;
  const sy =
    (((video.clientHeight - renderCanvas.clientHeight) / 2) *
      video.videoHeight) /
    video.clientHeight;
  const sw = video.videoWidth - sx * 2;
  const sh = video.videoHeight - sy * 2;

  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  renderer.preserveDrawingBuffer = true;
  renderer.render(scene, camera); // empty if not run
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  const data = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.download = "photo.png";
  link.href = data;
  link.click();
};

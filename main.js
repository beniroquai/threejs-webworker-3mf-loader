const loader = new window.ThreeMFLoader;

const fileInput = document.getElementById('fileInput');
const viewer = document.getElementById('viewer');
let scene, camera, renderer;

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
    camera.position.z = 50;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    viewer.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            loader.parse(reader.result, (object) => {
                scene.add(object);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

initScene();
animate();

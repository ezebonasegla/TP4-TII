import * as THREE from '../three/build/three.module.js';
import { VRButton } from '../three/examples/jsm/webxr/VRButton.js';

export default class Main {
    constructor() {
        this._renderer;
        this._scene;
        this._camera;
        this._shapes;
        this._clock = new THREE.Clock();
        this._container = document.querySelector('#container');

        this._createRenderer();
        this._createScene();
        this._createUser();
        this._createAssets();
        this._addEventListeners();

        this._renderer.setAnimationLoop(() => { this._update() });
    }

    _createRenderer() {
        this._renderer = new THREE.WebGLRenderer({ antialias : true });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.xr.enabled = true;
        this._container.appendChild(this._renderer.domElement);
        this._container.appendChild(VRButton.createButton(this._renderer));

    }

    _createScene() {
        this._scene = new THREE.Scene();
    }

    _createUser() {
        this._camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000 
        );
        this._camera.position.setY(1.7);
        this._scene.add(this._camera);
    }

    _createAssets() {
        let sphereRadius = 1;
        let sphereGeometry = new THREE.SphereBufferGeometry(
            sphereRadius,
            16,
            16 
        );
        let sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0xFF0000 
        });
        let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        let cubeGeometry = new THREE.BoxBufferGeometry(
            1.5 * sphereRadius, 
            1.5 * sphereRadius, 
            1.5 * sphereRadius 
        );
        let cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0x00FF00 
        });
        let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

        this._shapes = new THREE.Object3D();
        this._shapes.add(sphereMesh);
        this._shapes.add(cubeMesh);
        this._shapes.position.setY(1.7);
        this._shapes.position.setZ(-10); 
        this._scene.add(this._shapes);

        let light = new THREE.PointLight();
        light.position.setY(2);
        this._scene.add(light);
    }

    _addEventListeners() {
        window.addEventListener('resize', () => { this._onResize() });
        window.addEventListener('wheel', function(event) {
                    event.preventDefault();
        }, {passive: false, capture: true});
        
    }

    _onResize () {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
    }

    _update() {
        let timeDelta = this._clock.getDelta();
        let rotationAmount = 2 * Math.PI * timeDelta * 0.1;
        this._shapes.rotation.x += rotationAmount;
        this._shapes.rotation.y += rotationAmount;
        this._renderer.render(this._scene, this._camera);
    }
}

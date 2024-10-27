import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import ThreeMFLoader from '../ThreeMFLoader'; // If using the raw version, import as a default export

const Viewer = () => {
    const viewerRef = useRef(null);
    const [file, setFile] = useState(null);
    let scene, camera, renderer, loader;

    // Function to load and display the model
    const loadModel = (arrayBuffer) => {
        try {
            const object = loader.parse(arrayBuffer);
    
            if (!object) {
                console.error("Failed to load 3MF model");
                return;
            }
    
            console.log("Loaded 3MF model:", object);
    
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Set to red
                }
            });
    
            scene.clear();
            scene.add(object);
        } catch (error) {
            console.error("Error parsing 3MF model:", error);
        }
    };
    

    useEffect(() => {
        // Initialize Three.js scene
        const initScene = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, viewerRef.current.clientWidth / viewerRef.current.clientHeight, 0.1, 1000);
            camera.position.z = 50;
        
            const gridHelper = new THREE.GridHelper(200, 50);
            scene.add(gridHelper);

            const axesHelper = new THREE.AxesHelper(100);
            scene.add(axesHelper);

            // Add lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft light
            scene.add(ambientLight);
        
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(0, 1, 1).normalize();
            scene.add(directionalLight);
        
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight);
            viewerRef.current.appendChild(renderer.domElement);
        
            loader = new ThreeMFLoader();
            animate();
        };
        
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        initScene();

        // Cleanup function to remove the renderer on component unmount
        return () => {
            viewerRef.current.removeChild(renderer.domElement);
        };
    }, []);

    // Handle file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                loadModel(reader.result);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div>
            <h2>3MF Viewer</h2>
            <input type="file" onChange={handleFileChange} accept=".3mf" />
            <div ref={viewerRef} style={{ width: '600px', height: '600px', border: '1px solid #333' }}></div>
        </div>
    );
};

export default Viewer;

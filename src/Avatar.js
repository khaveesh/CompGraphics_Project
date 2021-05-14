import * as THREE from 'three';
import Texture from "./Texture.js";

import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import { BoxGeometry, BufferAttribute } from 'three';



export default class Avatar{

    constructor(scene){

        const mesh = require("./Resources/Meshes/cube.obj");
        const loader = new OBJLoader();
        loader.load(mesh.default,  (object) => {

                this.geometry = object.children[0].geometry;
                this.initialize_mesh(scene);
                scene.add(this.mesh);
            }
        );
        
        this.texture = new Texture();

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.light = new THREE.SpotLight(0xffffff);

        this.light.angle = Math.PI/6;
        this.light.penumbra = 0.5;
        this.light.decay = 2;
        
        this.active = false;

        this.fb_motion = 0; //front back axis: front=1 back = -1
        this.lr_motion = 0; //left right axis: right=1 left = -1
        
        this.camera.add(this.light);
        this.light.position.set(0,0,1);
        this.light.target = this.camera;
        
        this.speed = 0.05;
    }

    initialize_mesh(){
        
        this.mesh = new THREE.Mesh(this.geometry, this.texture.material[0]);
        
        this.mesh.position.y += 0.5;

        this.mesh.add(this.camera);
        this.control = new PointerLockControls(this.mesh, document.body);
        
        this.mesh.position.z = 10;
        this.map_simple();

    }

    map_spherical(){
        
        var geometry = this.geometry;
        var uv = [];
        geometry.computeBoundingSphere();
        const radius = geometry.boundingSphere.radius;
        const centre_x = geometry.boundingSphere.center.x;
        const centre_y = geometry.boundingSphere.center.y;
        const centre_z = geometry.boundingSphere.center.z;

        var start_x, start_z;
        for(var i =0; i < geometry.attributes.position.count; i++){
            if(geometry.attributes.position.array[3*i + 1] - centre_y != 0){
                start_x = geometry.attributes.position.array[3*i] - centre_x;
                start_z = geometry.attributes.position.array[3*i + 2] - centre_z;
            }
        }

        
        const start_vector = new THREE.Vector2(start_x, start_z);
        const offset_angle = start_vector.angle();

        for(var i =0; i < geometry.attributes.position.count; i++){

            var x = geometry.attributes.position.array[3*i] - centre_x;
            var y = geometry.attributes.position.array[3*i + 1] - centre_y;
            var z = geometry.attributes.position.array[3*i + 2] - centre_z;

            var temp_vector = new THREE.Vector2(x,z);
            temp_vector.rotateAround(new THREE.Vector2(0,0), -offset_angle);
            x = temp_vector.x;
            z = temp_vector.y;

            var v = (y/(2 * radius)) + 0.5;
            var u = 0;
            const c_radius = Math.sqrt( x*x + z*z );
            
            if(x >= start_x && z >= start_z){
                u = (z/c_radius)/4;
            }
            else if(x < start_x && z >= start_z){
                u = (-x/c_radius)/4 + 0.25;
            }
            else if(x < start_x && z < start_z){
                u = (-z/c_radius)/4 + 0.5;
            }
            else if(x >= start_x && z < start_z){
                u = (x/c_radius)/4 + 0.75;
            }

            uv.push(1-u, v);



        }

        const uv_attribute = new BufferAttribute(new Float32Array(uv), 2);
        geometry.setAttribute("uv", uv_attribute);
    }

    map_simple(){
        
        var geometry = this.geometry;
        var uv = []; 

        for(var i = 0; i < geometry.attributes.position.count; i+=3){

            
            uv.push(0,0,0,1,1,1);


        }

        const uv_attribute = new BufferAttribute(new Float32Array(uv), 2);
        geometry.setAttribute("uv", uv_attribute);
    }

    activate(){
        this.active = true;
        this.control.lock();
    }

    deactivate(){
        this.active = false;
        this.control.unlock();
    }

    keydown(key){



        if(key === "w"){
            this.fb_motion = 1;
        }
        else if(key === "s"){
            this.fb_motion = -1;
        }
        else if(key === "a"){
            this.lr_motion = -1;
        }
        else if(key === "d"){
            this.lr_motion = 1;
        }

    }

    keyup(key){

        if(key === "w" || key === "s"){
            this.fb_motion = 0;
        }
        else if(key === "a" || key === "d"){
            this.lr_motion = 0;
        }

    }

    move(){

        if(this.active){

            this.control.moveForward(this.fb_motion * this.speed);
            this.control.moveRight(this.lr_motion * this.speed);

        }

    }

    toggle_texture(){
        this.mesh.material = this.texture.toggle();
    }

}
import * as THREE from 'three';

import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';


export default class Avatar{

    constructor(){

        this.geometry = new THREE.BoxGeometry();
        this.material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.control = new PointerLockControls(this.mesh, document.body);
        

        this.active = false;

        this.fb_motion = 0; //front back axis: front=1 back = -1
        this.lr_motion = 0; //left right axis: right=1 left = -1

        this.mesh.add(this.camera);
        this.mesh.position.z = 10;
        this.speed = 0.05;
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

}
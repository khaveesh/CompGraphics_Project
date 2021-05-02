// import Scene from "./Scene.js";
import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';

export default class Application{

    constructor(){


        this.scene = new THREE.Scene();

        this.initialize_scene();
        
        this.initialize_cameras();

        this.moveForward = false;


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth - 20, window.innerHeight - 20 );
        document.body.appendChild( this.renderer.domElement );

        document.addEventListener("keypress",  (event) => this.keypress_handler(event));
        document.addEventListener("keydown", (event) => this.keydown_handler(event));
        document.addEventListener("keyup", (event) => this.keyup_handler(event));
        



    }

    animate(){


        this.renderer.render( this.scene, this.camera[this.active_camera] );

        if(this.moveForward){
            this.controls[0].moveForward(0.05);
        }

        requestAnimationFrame( this.animate.bind(this));

    }

    keypress_handler(event){

        if(event.key === "1"){
            this.active_camera = 1;
            // this.controls[0].unlock();
        }
        else if(event.key === "0"){
            this.active_camera = 0;
            this.controls[0].lock(); 
        }
        

    }

    keydown_handler(event){
        
        if(event.key == 'w'){
            this.moveForward = true
        }

    }

    keyup_handler(event){

        if(event.key == 'w'){
            this.moveForward = false
        }

    }

    initialize_cameras(){

        this.camera = [new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ), new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )];
        this.camera[0].position.z = 0;
        this.camera[1].position.z = 10;

        this.active_camera = 0;
        
        this.controls = []
        this.controls.push(new PointerLockControls(this.objects[0], document.body));
        this.objects[0].add(this.camera[0])

    }

    initialize_scene(){

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube1 = new THREE.Mesh( geometry, material );
        this.scene.add( cube1 );
        const cube2 = new THREE.Mesh( geometry, material );
        this.scene.add(cube2);

        cube2.position.x += 5;
        this.objects = [cube1, cube2];
        
    }

}
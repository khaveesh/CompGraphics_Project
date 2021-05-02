// import Scene from "./Scene.js";
import Avatar from "./Avatar.js";
import Drone from "./Drone.js";
import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import { Mesh } from "three";

export default class Application{

    constructor(){


        this.scene = new THREE.Scene();
        this.avatar = new Avatar();
        this.drone = new Drone();
        this.debug_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
        this.objects = []
        this.players = [this.avatar, this.drone];
        this.active_player = 1;

        this.initialize_scene();

        const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( light );

        
        this.debug_camera.position.z = 10;


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth - 20, window.innerHeight - 20 );
        document.body.appendChild( this.renderer.domElement );

        document.addEventListener("keypress",  (event) => this.keypress_handler(event));
        document.addEventListener("keydown", (event) => this.keydown_handler(event));
        document.addEventListener("keyup", (event) => this.keyup_handler(event));
        



    }

    animate(){


        this.renderer.render( this.scene, this.players[this.active_player].camera);

        this.players[this.active_player].move();

        requestAnimationFrame( this.animate.bind(this));

    }

    keypress_handler(event){

        if(event.key === "c"){

            this.players[this.active_player].deactivate();
            this.active_player = 1 - this.active_player;
            this.players[this.active_player].activate();

        }
        

    }

    keydown_handler(event){
        
        if(["w","a","s","d","q","e"].includes(event.key)){
            this.players[this.active_player].keydown(event.key);
        }

    }

    keyup_handler(event){

        if(["w","a","s","d","q","e"].includes(event.key)){
            this.players[this.active_player].keyup(event.key);
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
        const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        
        this.objects.push(new Mesh(geometry, material));
        this.objects.push(new Mesh(geometry, material));

        this.objects[1].position.x += 5;

        this.objects.forEach( (x) =>this.scene.add(x) );
        this.players.forEach( (x) =>this.scene.add(x.mesh) );


    }

}
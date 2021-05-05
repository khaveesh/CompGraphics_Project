import NPC from "./NPC.js";
import Avatar from "./Avatar.js";
import Drone from "./Drone.js";
import Lamppost from "./Objects/Lamppost.js";
import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import { Mesh } from "three";

export default class Application{

    constructor(){


        this.scene = new THREE.Scene();
        this.avatar = new Avatar(this.scene);
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

        const box_geometry = new THREE.BoxGeometry();
        const green_phong_material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

        const floor_geometry = new THREE.PlaneGeometry(100,100);
        const white_phong_material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
        
        this.objects.push(new NPC(box_geometry, green_phong_material, [0,0.5,0]));
        this.objects.push(new NPC(box_geometry, white_phong_material, [0,0.5,5]));

        this.objects.push(new NPC(floor_geometry, white_phong_material, [0,0,0], [-Math.PI/2,0,0]));
        
        
        this.objects.push(new Lamppost([10,1.5,10]));
        this.objects.push(new Lamppost([30,1.5,30]));
        this.objects.push(new Lamppost([50,1.5,50]));
        this.objects.push(new Lamppost([-10,1.5,-10]));
        this.objects.push(new Lamppost([-30,1.5,-30]));
        this.objects.push(new Lamppost([-50,1.5,-50]));





        this.objects.forEach( (x) =>this.scene.add(x.mesh) );
        this.players.forEach( (x) =>this.scene.add(x.mesh) );


    }

}
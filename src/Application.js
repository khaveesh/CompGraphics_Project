import NPC from "./NPC.js";
import Avatar from "./Avatar.js";
import Drone from "./Drone.js";
import Lamppost from "./Objects/Lamppost.js";
import Mobile_NPC from "./Mobile_NPC.js";
import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import { Mesh } from "three";
import Train from "./Train.js";

export default class Application{

    constructor(){


        this.scene = new THREE.Scene();
        this.avatar = new Avatar(this.scene);
        this.drone = new Drone();
        this.debug_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
        this.objects = [];
		this.moving_objects = [];
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
        
		this.displacement = 0;


    }

animate()
{	

		
	this.renderer.render( this.scene, this.players[this.active_player].camera);

	this.players[this.active_player].move();
	this.moving_objects.forEach((x) => x.move());

    requestAnimationFrame( this.animate.bind(this));

}

    keypress_handler(event)
	{

        if(event.key === "c"){

            this.players[this.active_player].deactivate();
            this.active_player = 1 - this.active_player;
            this.players[this.active_player].activate();

        }
        else if(event.key == "t"){
            this.avatar.toggle_texture();
            this.objects.forEach((x) => x.toggle_texture());
        }
        else if(event.key == "m"){
            this.avatar.toggle_map();
            this.objects.forEach((x) => x.toggle_map());
        }
        else if(event.key == " "){
            this.avatar.jump();
        }
		else if(event.key == "1"){
			this.avatar.attach(this.moving_objects[0].leader);
		}
		else if(event.key == "0"){
			this.avatar.dettach(this.scene);
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


    initialize_scene(){

        const box_geometry = new THREE.BoxGeometry();
        const green_phong_material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

        const floor_geometry = new THREE.PlaneGeometry(100,100);
        const white_phong_material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
        
        this.objects.push(new NPC(this.scene, "cube.obj", [0,0.5,0]));
        this.objects.push(new NPC(this.scene, "cube.obj", [0,0.5,5]));

        this.objects.push(new NPC(this.scene, "plane.obj", [0,0,0], [0,0,0],1,[],"ground.jpg"));
        
        
        this.objects.push(new Lamppost(this.scene, [10,1.5,10]));
        this.objects.push(new Lamppost(this.scene, [30,1.5,30]));
        this.objects.push(new Lamppost(this.scene, [50,1.5,50]));
        this.objects.push(new Lamppost(this.scene, [-10,1.5,-10]));
        this.objects.push(new Lamppost(this.scene, [-30,1.5,-30]));
        this.objects.push(new Lamppost(this.scene, [-50,1.5,-50]));



        this.scene.add(this.drone.mesh);

		const path = new THREE.CurvePath();
		const firstLine = new THREE.LineCurve3(
			new THREE.Vector3( 10, 0.5, 0 ),
			new THREE.Vector3( -10, 0.5, 0 )
		);
		const secondLine = new THREE.LineCurve3(
			new THREE.Vector3(-10, 0.5, 0 ),
			new THREE.Vector3( -10, 0.5, 20 )
		);
	  
		const thirdLine = new THREE.LineCurve3(
			new THREE.Vector3( -10, 0.5, 20 ),
			new THREE.Vector3(10, 0.5, 20 ),
		);

		const fourthLine = new THREE.LineCurve3(
			new THREE.Vector3( 10, 0.5, 20 ),
			new THREE.Vector3(10, 0.5, 0 ),
		);
	  

		const bezierLine = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 10, 0.5, 20 ),
			new THREE.Vector3( 20, 0.5, 0 ),
			new THREE.Vector3( 20, 0.5, 0 ),
			new THREE.Vector3( 10, 0.5, 0 )
		);
		
		path.add(firstLine);
		path.add(secondLine);
		path.add(thirdLine);
		path.add(bezierLine);

		this.moving_objects.push(new Train(3,this.scene, path, 0.1));
		

		
		
		
		const p_material = new THREE.LineBasicMaterial({
		color: 0xffffff
		});
		const points = path.curves.reduce((p, d)=> [...p, ...d.getPoints(20)], []);
	  
		const p_geometry = new THREE.BufferGeometry().setFromPoints( points );
		const draw_path = new THREE.Line(p_geometry, p_material);
		this.scene.add(draw_path);
		
    }

}
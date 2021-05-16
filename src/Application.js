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
        
		this.displacement = 0;


    }
/*
pointsPath ()
{
	const Path = new THREE.CurvePath();
    const firstLine = new THREE.LineCurve3(
		new THREE.Vector3( 1, 0, 0 ),
		new THREE.Vector3( -1, 0, 0 )
    );
	const secondLine = new THREE.LineCurve3(
		new THREE.Vector3(-1, 0, 0 ),
		new THREE.Vector3( -1, 1, 0 )
    );
  
	const thirdLine = new THREE.LineCurve3(
		new THREE.Vector3( -1, 1, 0 ),
		new THREE.Vector3(-1, 1, 1 ),
    );
  

	const bezierLine = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -1, 1, 1 ),
		new THREE.Vector3( -0.5, 1.5, 0 ),
		new THREE.Vector3( 2.0, 1.5, 0 ),
		new THREE.Vector3( -1, 0, 1 )
	);
	
    Path.add(firstLine);
    Path.add(secondLine);
    Path.add(thirdLine);
    Path.add(bezierLine);
    
    let displacement = 0;
	var axis = new THREE.Vector3();
	var up = new THREE.Vector3( 0, 1, 0 );

	var curr_pos = Path.getPoint(displacement);
	var tangent = Path.getTangent(displacement);
	
	axis.crossVectors(up, tangent).normalize();	
	var radians = Math.acos(up.dot(tangent));
	
	var update = () => {
		displacement +=0.001;
		if (displacement> 1)
		{
			displacement = 0;
		}
		curr_pos = Path.getPoint(displacement);
		tangent = Path.getTangent(displacement);
		axis.crossVectors(up, tangent).normalize();
		radians = Math.acos(up.dot(tangent));
		
	};
	var get_curr_pos = () => {
		return curr_pos;
	};
	var get_axis = () => {
		return axis;
	};
	var get_radians = () => {
		return radians;
	};
	var get_displacement = () => {
		return displacement;
	};
}
/*
var path = new THREE.LineCurve3(
		new THREE.Vector3( 1, 0, 0 ),
		new THREE.Vector3( -1, 0, 0 )
    );
*/
/*
let displacement = 0;
var axis = new THREE.Vector3();
var up = new THREE.Vector3( 0, 1, 0 );
*/
animate()
{	
// 	const pPath = this.pointsPath()
	const Path = new THREE.CurvePath();
	Path.name = "Path";
	const firstLine = new THREE.LineCurve3(
		new THREE.Vector3( 1, 0, 0 ),
		new THREE.Vector3( -1, 0, 0 )
	);
	const secondLine = new THREE.LineCurve3(
		new THREE.Vector3(-1, 0, 0 ),
		new THREE.Vector3( -1, 1, 0 )
	);
  
	const thirdLine = new THREE.LineCurve3(
		new THREE.Vector3( -1, 1, 0 ),
		new THREE.Vector3(-1, 1, 1 ),
	);
  

	const bezierLine = new THREE.CubicBezierCurve3(
		new THREE.Vector3( -1, 1, 1 ),
		new THREE.Vector3( -0.5, 1.5, 0 ),
		new THREE.Vector3( 2.0, 1.5, 0 ),
		new THREE.Vector3( -1, 0, 1 )
	);
	
	Path.add(firstLine);
	Path.add(secondLine);
	Path.add(thirdLine);
	Path.add(bezierLine);

	var cube1 = this.scene.getObjectByName("lead_cube");
	cube1.position.copy(Path.getPoint(this.displacement));
	var axis = new THREE.Vector3();
	var up = new THREE.Vector3( 0, 0, 1 );
	var tangent = Path.getTangent(this.displacement);
	
	axis.crossVectors(up, tangent).normalize();	
	
	const radians = Math.acos(up.dot(tangent));
	
	cube1.quaternion.setFromAxisAngle(axis, radians);
	// const path = new THREE.Path();
	// cube1.position.copy(path.getPoint(displacement));
	console.log(this.displacement);
		
	this.renderer.render( this.scene, this.players[this.active_player].camera);

	this.players[this.active_player].move();
	
	// pPath.update();
	this.displacement +=0.001;
	if (this.displacement> 1)
	{
		this.displacement = 0;
	}

    requestAnimationFrame( this.animate.bind(this));

}

    keypress_handler(event)
	{

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
        if(event.key == "t"){
            this.avatar.toggle_texture();
            this.objects.forEach((x) => x.toggle_texture());
        }
        if(event.key == "m"){
            this.avatar.toggle_map();
            this.objects.forEach((x) => x.toggle_map());
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

        this.objects.push(new NPC(this.scene, "plane.obj", [0,0,0], [0,0,0]));
        
        
        this.objects.push(new Lamppost(this.scene, [10,1.5,10]));
        this.objects.push(new Lamppost(this.scene, [30,1.5,30]));
        this.objects.push(new Lamppost(this.scene, [50,1.5,50]));
        this.objects.push(new Lamppost(this.scene, [-10,1.5,-10]));
        this.objects.push(new Lamppost(this.scene, [-30,1.5,-30]));
        this.objects.push(new Lamppost(this.scene, [-50,1.5,-50]));



        this.scene.add(this.drone.mesh);
		
		var geometry1 = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
		var geometry2 = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
		var geometry3 = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
		var material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		var material2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		var material3 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		var cube1 = new THREE.Mesh( geometry1, material1 );
		var cube2 = new THREE.Mesh( geometry2, material2 );
		var cube3 = new THREE.Mesh( geometry3, material3 );
		var cubes = [cube1, cube2, cube3];

		var i;
		for(i=1; i<3; ++i)
		{
			cubes[i-1].add(cubes[i]);
		/*   cubes[i].position.x = cubes[i-1].position.x + 2; */
		}
		cubes[1].position.x = cubes[0].position.x + 0.1;
		cubes[2].position.x = cubes[1].position.x + 0;

		cube1.name = "lead_cube";
		
		this.scene.add(cube1);

		const Path = new THREE.CurvePath();
		Path.name = "Path";
		const firstLine = new THREE.LineCurve3(
			new THREE.Vector3( 1, 0, 0 ),
			new THREE.Vector3( -1, 0, 0 )
		);
		const secondLine = new THREE.LineCurve3(
			new THREE.Vector3(-1, 0, 0 ),
			new THREE.Vector3( -1, 1, 0 )
		);
	  
		const thirdLine = new THREE.LineCurve3(
			new THREE.Vector3( -1, 1, 0 ),
			new THREE.Vector3(-1, 1, 1 ),
		);
	  

		const bezierLine = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -1, 1, 1 ),
			new THREE.Vector3( -0.5, 1.5, 0 ),
			new THREE.Vector3( 2.0, 1.5, 0 ),
			new THREE.Vector3( -1, 0, 1 )
		);
		
		Path.add(firstLine);
		Path.add(secondLine);
		Path.add(thirdLine);
		Path.add(bezierLine);
		
		// this.scene.add(Path);
		const p_material = new THREE.LineBasicMaterial({
		color: 0xffffff
		});
		const points = Path.curves.reduce((p, d)=> [...p, ...d.getPoints(20)], []);
	  
		const p_geometry = new THREE.BufferGeometry().setFromPoints( points );
		const draw_path = new THREE.Line(p_geometry, p_material);
		this.scene.add(draw_path);
		
    }

}
import NPC from "./NPC.js";
import Avatar from "./Avatar.js";
import Drone from "./Drone.js";
import Lamppost from "./Objects/Lamppost.js";
import * as THREE from 'three';
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

        const light = new THREE.AmbientLight( 0x404040 ); 
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

    if (this.active_player === 0) {
        this.avatar.collision_detection(this.objects);
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
        else if(event.key == "3"){
            this.avatar.attach(this.moving_objects[2].objects[0]);
        }
        else if(event.key == "2"){
            this.avatar.attach(this.moving_objects[1].leader);
        }
		else if(event.key == "1"){
			this.avatar.attach(this.moving_objects[0].leader);
		}
		else if(event.key == "0"){
			this.avatar.dettach(this.scene);
		}
        
        
    }

    keydown_handler(event){
        
        if(["w","a","s","d","q","e","x","z","r"].includes(event.key)){
            this.players[this.active_player].keydown(event.key);
        }
        

    }

    keyup_handler(event){

        if(["w","a","s","d","q","e"].includes(event.key)){
            this.players[this.active_player].keyup(event.key);
        }

    }


    initialize_scene(){

        
        this.objects.push(new NPC(this.scene, "cylinder.obj", [10,1,-10],[0,0,0],1,[], "panaroma2.jpg"));
        this.objects.push(new NPC(this.scene, "sphere.obj", [12,0.5,-12],[0,0,0],1,[], "world.jpg"));
        this.objects.push(new NPC(this.scene, "smoothsphere.obj", [15,1,-15],[0,0,0],1,[], "world.jpg"));
        this.objects.push(new NPC(this.scene, "cube.obj", [20,1,-20],[0,0,0],1,[]));

        this.objects.push(new NPC(this.scene, "house1.obj", [70,5,-20],[0,Math.PI,0],5,[]));



        this.ground = new NPC(this.scene, "plane.obj", [0,0,0], [0,0,0],1,[],"grass.jpg","white_concrete.jpg");
        
        
        this.objects.push(new Lamppost(this.scene, [12,1.5,8]));
        this.objects.push(new Lamppost(this.scene, [32,1.5,28]));
        this.objects.push(new Lamppost(this.scene, [52,1.5,48]));
        this.objects.push(new Lamppost(this.scene, [-8,1.5,-12]));
        this.objects.push(new Lamppost(this.scene, [-28,1.5,-32]));
        this.objects.push(new Lamppost(this.scene, [-48,1.5,-52]));



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

		this.moving_objects.push(new Train(3,this.scene, path, 0.03));

        const path2 = new THREE.CurvePath();
		const firstLine2 = new THREE.LineCurve3(
			new THREE.Vector3( -70, 0.5, -70 ),
			new THREE.Vector3( 70, 0.5, 70 )
		);

        path2.add(firstLine2);
        this.moving_objects.push(new Train(4,this.scene, path2, 0.01));

        const path3 = new THREE.CurvePath();
		const bezierLine3 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( -90, 0.5, -90 ),
			new THREE.Vector3( 90, 0.5, -90 ),
			new THREE.Vector3( -90, 0.5, 90 ),
			new THREE.Vector3( 90, 0.5, 90 )
		);

        const bezierLine32 = new THREE.CubicBezierCurve3(
			new THREE.Vector3( 90, 0.5, 90 ),
			new THREE.Vector3( 90, 0.5, -90 ),
			new THREE.Vector3( -90, 0.5, 90 ),
			new THREE.Vector3( -90, 0.5, -90 )
		);

        path3.add(bezierLine3);
        path3.add(bezierLine32);
        this.moving_objects.push(new Train(2,this.scene, path3, 0.005));

		
    }

}

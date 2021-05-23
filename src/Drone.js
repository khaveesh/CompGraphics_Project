import * as THREE from 'three';



export default class Drone{

    constructor(){

        this.geometry = new THREE.BoxGeometry(0.1,0.1,0.1);
        this.material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.mesh.position.y += 0.5;

        this.mesh.add(this.camera);
        
        this.mesh.position.z = 3;
        this.speed = 0.05;

        this.active = true;

        this.fb_motion = 0; //front back
        this.lr_rotation = 0; //left right
        this.ud_motion = 0; //up down

    }

    activate(){
        this.active = true;
    }

    deactivate(){
        this.active = false;
    }

    move(){

        if(this.active){
            const direction = new THREE.Vector3(); 
            this.mesh.getWorldDirection(direction);
            this.mesh.position.addScaledVector(direction, -this.fb_motion * this.speed);
            this.mesh.rotateY(-this.lr_rotation * this.speed);
            this.mesh.position.y += this.ud_motion * this.speed;
        }

    }

    keydown(key){

        if(key === "w" && this.fb_motion < 5){
            this.fb_motion += 0.5;
        }
        else if(key === "s" && this.fb_motion > -5){
            this.fb_motion += -0.5;
        }
        else if(key === "a"){
            this.lr_rotation = -1;
        }
        else if(key === "d"){
            this.lr_rotation = 1;
        }
        else if(key === "q"){
            this.ud_motion = 1;
        }
        else if(key === "e"){
            this.ud_motion = -1;
        }
        else if(key === "z"){
            this.camera.rotateX(Math.PI/6);
        }
        else if(key === "x"){
            this.camera.rotateX(-Math.PI/6);
        }
        else if(key === "r"){
            this.fb_motion = 0;
        }
        

    }

    keyup(key){


        if(key === "a" || key === "d"){
            this.lr_rotation = 0;
        }
        else if(key === "q" || key === "e"){
            this.ud_motion = 0;
        }

    }

}
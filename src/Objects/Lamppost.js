import * as THREE from 'three';
import NPC from "../NPC.js";

export default class Lamppost extends NPC{

    constructor(scene,position = [0,0,0]){

        const geometry = new THREE.BoxGeometry(0.1,3,0.1);
        
        const lights = [];

        for(var i = 0; i < 4; i++){
            lights.push(new THREE.PointLight( 0xffff00, 1, 10 ));

            
            lights[i].position.y =  + 1.5;
            
            lights[i].position.x = -20;
            lights[i].position.z = 20;

        }
        
        

        super(scene,"lamppost.obj", position, [0,0,0],0.08, lights, "white_concrete.jpg");

        this.light = lights;
    }
}
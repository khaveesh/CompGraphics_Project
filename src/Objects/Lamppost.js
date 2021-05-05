import * as THREE from 'three';
import NPC from "../NPC.js";

export default class Lamppost extends NPC{

    constructor(position = [0,0,0]){

        const geometry = new THREE.BoxGeometry(0.1,3,0.1);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        
        const lights = [];

        for(var i = 0; i < 4; i++){
            lights.push(new THREE.PointLight( 0xffff00, 0.5, 10 ));

            
            lights[lights.length - 1].position.y =  + 1.5;
            

        }
        
        lights[0].position.x = + 1;
        lights[1].position.z = + 1;
        lights[2].position.x = - 1;
        lights[3].position.z = - 1;

        super(geometry, material, position, [0,0,0], lights);

        this.light = lights;
    }
}
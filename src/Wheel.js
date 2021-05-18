import * as THREE from 'three';

import NPC from "./NPC.js";

export default class Wheel extends NPC{

    constructor(parent, speed = 0.1, position = [0,0,0], rotate = [0,0,0], scale = 1, children = [], texture_file1 = "wall1.jpg", texture_file2 = "white_concrete.jpg" ){

        super(parent,"wheel.obj",position,rotate,scale,children,texture_file1, texture_file2);
        this.speed = speed;
    }

    move(){

        

        if(this.mesh == null){
            return;
        }
        
        this.mesh.rotateX(this.speed);
    }
}
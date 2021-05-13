import * as THREE from 'three';

import Texture from "./Texture.js";

export default class NPC{

    constructor(geometry, position = [0,0,0], rotate = [0,0,0], children = [], texture_file1 = "wall1.jpg", texture_file2 = "white_concrete.jpg"){

        this.texture = new Texture(texture_file1, texture_file2);
        this.mesh = new THREE.Mesh(geometry, this.texture.material[0]);
        
        this.mesh.position.x += position[0];
        this.mesh.position.y += position[1];
        this.mesh.position.z += position[2];

        this.mesh.rotateX(rotate[0]);
        this.mesh.rotateY(rotate[1]);
        this.mesh.rotateZ(rotate[2]);

        this.children = children;
        
        this.children.forEach((x) => this.mesh.add(x));

    }

    toggle_texture(){
        
        this.mesh.material = this.texture.toggle();
    }
}
import * as THREE from 'three';

export default class NPC{

    constructor(geometry, material, position = [0,0,0], rotate = [0,0,0], children = []){


        this.mesh = new THREE.Mesh(geometry, material);
        
        this.mesh.position.x += position[0];
        this.mesh.position.y += position[1];
        this.mesh.position.z += position[2];

        this.mesh.rotateX(rotate[0]);
        this.mesh.rotateY(rotate[1]);
        this.mesh.rotateZ(rotate[2]);

        this.children = children;
        
        this.children.forEach((x) => this.mesh.add(x));

    }
}
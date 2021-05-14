import * as THREE from 'three';

import Texture from "./Texture.js";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';

export default class NPC{

    constructor(parent , obj_file = "cube.obj", position = [0,0,0], rotate = [0,0,0], children = [], texture_file1 = "wall1.jpg", texture_file2 = "white_concrete.jpg"){

        const loader = new OBJLoader();
        console.log(obj_file);
        const mesh = require('./Resources/Meshes/' + obj_file);
        loader.load(mesh.default,  (object) => {

                this.geometry = object.children[0].geometry;
                console.log(rotate);
                this.initialize_mesh( position, rotate);
                parent.add(this.mesh);
            }
        );

        this.texture = new Texture(texture_file1, texture_file2);
        

        this.children = children;
        

    }

    initialize_mesh(position, rotate){
        this.mesh = new THREE.Mesh(this.geometry, this.texture.material[0]);
        
        this.mesh.position.x += position[0];
        this.mesh.position.y += position[1];
        this.mesh.position.z += position[2];

        this.mesh.rotateX(rotate[0]);
        this.mesh.rotateY(rotate[1]);
        this.mesh.rotateZ(rotate[2]);
        this.map_simple();
        this.children.forEach((x) => this.mesh.add(x));

    }

    map_simple(){
        
        var geometry = this.geometry;
        var uv = []; 

        for(var i = 0; i < geometry.attributes.position.count; i+=3){

            
            uv.push(0,0,0,1,1,1);


        }

        const uv_attribute = new THREE.BufferAttribute(new Float32Array(uv), 2);
        geometry.setAttribute("uv", uv_attribute);
    }

    toggle_texture(){
        
        this.mesh.material = this.texture.toggle();
    }
}
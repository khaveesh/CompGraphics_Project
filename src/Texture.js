import * as THREE from 'three';

export default class Texture{

    constructor(filename1 = "wall1.jpg", filename2 = "white_concrete.jpg"){

        const loader = new THREE.TextureLoader();
        
        const texture_image1 = require('./Resources/Textures/' + filename1);
        const texture_image2 = require('./Resources/Textures/' + filename2);
        
        this.material = [];
        this.material.push(new THREE.MeshPhongMaterial({map: loader.load(texture_image1.default)}));
        this.material.push(new THREE.MeshPhongMaterial({map: loader.load(texture_image2.default)}));

        this.state = 0;

    }

    toggle(){

        this.state = 1 - this.state;
        return this.material[this.state];

    }

}
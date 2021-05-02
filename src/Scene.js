import * as THREE from 'three';

export default class Scene{

    constructor(){

        this.scene = new THREE.Scene();
        
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );

        this.objects = [cube]

    }

}
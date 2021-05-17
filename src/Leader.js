import * as THREE from 'three';

import NPC from "./NPC.js";

export default class Leader extends NPC{

    constructor(parent,obj_file = "cube.obj",  position = [0,0,0], rotate = [0,0,0], scale = 1, children = [], texture_file1 = "wall1.jpg", texture_file2 = "white_concrete.jpg" ){

        super(parent,obj_file,position,rotate,scale,children,texture_file1, texture_file2);

        this.path = new THREE.CurvePath();

        this.displacement = 0;
        
        const firstLine = new THREE.LineCurve3(
            new THREE.Vector3( 1, 0, 0 ),
            new THREE.Vector3( -1, 0, 0 )
        );
        const secondLine = new THREE.LineCurve3(
            new THREE.Vector3(-1, 0, 0 ),
            new THREE.Vector3( -1, 1, 0 )
        );
      
        const thirdLine = new THREE.LineCurve3(
            new THREE.Vector3( -1, 1, 0 ),
            new THREE.Vector3(-1, 1, 1 ),
        );
      
    
        const bezierLine = new THREE.CubicBezierCurve3(
            new THREE.Vector3( -1, 1, 1 ),
            new THREE.Vector3( -0.5, 1.5, 0 ),
            new THREE.Vector3( 2.0, 1.5, 0 ),
            new THREE.Vector3( -1, 0, 1 )
        );
        
        this.path.add(firstLine);
        this.path.add(secondLine);
        this.path.add(thirdLine);
        this.path.add(bezierLine);
    }

    move(){

        if(this.mesh == null){
            return;
        }
        this.mesh.position.copy(this.path.getPoint(this.displacement));

        var axis = new THREE.Vector3();
        var up = new THREE.Vector3( 0, 0, 1 );
        var tangent = this.path.getTangent(this.displacement);
        
        axis.crossVectors(up, tangent).normalize();	
        
        const radians = Math.acos(up.dot(tangent));
        
        this.mesh.quaternion.setFromAxisAngle(axis, radians);

        this.displacement +=0.001;
        
        if (this.displacement> 1)
        {
            this.displacement = 0;
        }

    }

}
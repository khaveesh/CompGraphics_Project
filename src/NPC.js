import * as THREE from 'three';

import Texture from "./Texture.js";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';

export default class NPC{

    constructor(parent , obj_file = "cube.obj", position = [0,0,0], rotate = [0,0,0], scale = 1, children = [], texture_file1 = "wall1.jpg", texture_file2 = "wood.jpg"){

        const loader = new OBJLoader();
        const mesh = require('./Resources/Meshes/' + obj_file);
        loader.load(mesh.default,  (object) => {

                this.geometry = object.children[0].geometry;
                this.initialize_mesh( position, rotate, scale);
                
                if(parent.add != null){
                    parent.add(this.mesh);
                }
                else if(parent.mesh != null){
                    parent.mesh.add(this.mesh);
                }
            }
        );

        this.texture = new Texture(texture_file1, texture_file2);
        
        this.map = 0;
        this.children = children;
        

    }

    initialize_mesh(position, rotate, scale){
        this.mesh = new THREE.Mesh(this.geometry, this.texture.material[0]);
        
        this.mesh.position.x += position[0];
        this.mesh.position.y += position[1];
        this.mesh.position.z += position[2];

        this.mesh.rotateX(rotate[0]);
        this.mesh.rotateY(rotate[1]);
        this.mesh.rotateZ(rotate[2]);

        this.mesh.scale.set(scale,scale,scale);
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

    map_spherical(){
        
        var geometry = this.geometry;
        var u_array = [];
        var v_array = [];
        geometry.computeBoundingSphere();
        const radius = geometry.boundingSphere.radius;
        const centre_x = geometry.boundingSphere.center.x;
        const centre_y = geometry.boundingSphere.center.y;
        const centre_z = geometry.boundingSphere.center.z;

        var start_x, start_z;
        for(var i =0; i < geometry.attributes.position.count; i++){
            if(geometry.attributes.position.array[3*i + 1] - centre_y != 0){
                start_x = geometry.attributes.position.array[3*i] - centre_x;
                start_z = geometry.attributes.position.array[3*i + 2] - centre_z;
                
                break;
            }
        }

        var u_start;
        const c_radius = Math.sqrt( start_x*start_x + start_z*start_z );
        
        if( start_x >= 0 && start_z >= 0){
            u_start = Math.asin(start_z/c_radius)/(2 * Math.PI);
        }
        else if( start_x < 0 && start_z >= 0){
            u_start = Math.asin(-(start_x)/c_radius)/(2 * Math.PI) + 0.25;
        }
        else if(start_x < 0 && start_z < 0){
            u_start = Math.asin(-(start_z)/c_radius)/(2 * Math.PI) + 0.5;
        }
        else if(start_x >= 0 && start_z < 0){
            u_start = Math.asin(start_x/c_radius)/(2 * Math.PI) + 0.75;
        }
        u_start = Math.round(u_start * 1000)/1000;


        for(var i =0; i < geometry.attributes.position.count; i++){

            var x = geometry.attributes.position.array[3*i] - centre_x;
            var y = geometry.attributes.position.array[3*i + 1] - centre_y;
            var z = geometry.attributes.position.array[3*i + 2] - centre_z;

            var v = Math.asin(y/radius)/(Math.PI) + 0.5;
            var u = 0;
            const c_radius = Math.sqrt( x*x + z*z );
            
            if(x >= 0 && z >= 0){
                u = Math.asin((z/c_radius))/(2*Math.PI);
            }
            else if(x < 0 && z >= 0){
                u = Math.asin((-x/c_radius))/(2*Math.PI) + 0.25;
            }
            else if(x < 0 && z < 0){
                u = Math.asin((-z/c_radius))/(2*Math.PI) + 0.5;
            }
            else if(x >= 0 && z < 0){
                u = Math.asin((x/c_radius))/(2*Math.PI) + 0.75;
            }
            
            u = Math.round(u * 1000)/1000;    

            u = u - u_start;

            if(u < 0){
                u += 1;
            }


            u_array.push(u);
            v_array.push(v);



        }
        
        
        for(var i = 0; i < u_array.length; i++){

            if(u_array[i] == 0){
                if(i % 3 == 0){
                    if(u_array[i+1] > 0.5){
                        u_array[i] = 1;
                    }
                    else if(u_array[i+1] == 0 && u_array[i+2] > 0.5){
                        u_array[i] = 1;
                    }
                }
                else if(i % 3 == 1){
                    if(u_array[i-1] > 0.5){
                        u_array[i] = 1;
                    }
                }
                else if(i%3 == 2){
                    if(u_array[i-1] > 0.5){
                        u_array[i] = 1;
                    }
                }
            }

        }

        var uv = []

        for(var i = 0; i < u_array.length; i++){
            uv.push(u_array[i], v_array[i]);
        }

        const uv_attribute = new THREE.BufferAttribute(new Float32Array(uv), 2);
        geometry.setAttribute("uv", uv_attribute);
    }

    map_cylinder(){
        
        var geometry = this.geometry;
        var u_array = [];
        var v_array = [];
        geometry.computeBoundingSphere();
        geometry.computeBoundingBox();
        const height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
        const centre_x = geometry.boundingSphere.center.x;
        const centre_y = geometry.boundingSphere.center.y;
        const centre_z = geometry.boundingSphere.center.z;

        var start_x, start_z;
        for(var i =0; i < geometry.attributes.position.count; i++){
            if(geometry.attributes.position.array[3*i + 1] - centre_y != 0){
                start_x = geometry.attributes.position.array[3*i] - centre_x;
                start_z = geometry.attributes.position.array[3*i + 2] - centre_z;
                
                break;
            }
        }

        var u_start;
        const c_radius = Math.sqrt( start_x*start_x + start_z*start_z );
        
        if( start_x >= 0 && start_z >= 0){
            u_start = Math.asin(start_z/c_radius)/(2 * Math.PI);
        }
        else if( start_x < 0 && start_z >= 0){
            u_start = Math.asin(-(start_x)/c_radius)/(2 * Math.PI) + 0.25;
        }
        else if(start_x < 0 && start_z < 0){
            u_start = Math.asin(-(start_z)/c_radius)/(2 * Math.PI) + 0.5;
        }
        else if(start_x >= 0 && start_z < 0){
            u_start = Math.asin(start_x/c_radius)/(2 * Math.PI) + 0.75;
        }
        u_start = Math.round(u_start * 1000)/1000;


        for(var i =0; i < geometry.attributes.position.count; i++){

            var x = geometry.attributes.position.array[3*i] - centre_x;
            var y = geometry.attributes.position.array[3*i + 1] - centre_y;
            var z = geometry.attributes.position.array[3*i + 2] - centre_z;

            var v = y/(height) + 0.5;
            var u = 0;
            const c_radius = Math.sqrt( x*x + z*z );
            
            if(x >= 0 && z >= 0){
                u = Math.asin((z/c_radius))/(2*Math.PI);
            }
            else if(x < 0 && z >= 0){
                u = Math.asin((-x/c_radius))/(2*Math.PI) + 0.25;
            }
            else if(x < 0 && z < 0){
                u = Math.asin((-z/c_radius))/(2*Math.PI) + 0.5;
            }
            else if(x >= 0 && z < 0){
                u = Math.asin((x/c_radius))/(2*Math.PI) + 0.75;
            }
            
            u = Math.round(u * 1000)/1000;    

            u = u - u_start;

            if(u < 0){
                u += 1;
            }


            u_array.push(u);
            v_array.push(v);



        }
        
        
        for(var i = 0; i < u_array.length; i++){

            if(u_array[i] == 0){
                if(i % 3 == 0){
                    if(u_array[i+1] > 0.5){
                        u_array[i] = 1;
                    }
                    else if(u_array[i+1] == 0 && u_array[i+2] > 0.5){
                        u_array[i] = 1;
                    }
                }
                else if(i % 3 == 1){
                    if(u_array[i-1] > 0.5){
                        u_array[i] = 1;
                    }
                }
                else if(i%3 == 2){
                    if(u_array[i-1] > 0.5){
                        u_array[i] = 1;
                    }
                }
            }

        }

        var uv = []

        for(var i = 0; i < u_array.length; i++){
            uv.push(u_array[i], v_array[i]);
        }

        const uv_attribute = new THREE.BufferAttribute(new Float32Array(uv), 2);
        geometry.setAttribute("uv", uv_attribute);
    }

    toggle_texture(){
        
        this.mesh.material = this.texture.toggle();
    }

    toggle_map(){

        if(this.map == 0){
            this.map_cylinder();
            this.map = 1;
        }
        else if(this.map == 1){
            this.map_spherical();
            this.map = 2;
        }
        else{
            this.map_simple();
            this.map = 0;
        }


    }

}



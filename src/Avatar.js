import * as THREE from "three";
import Texture from "./Texture.js";

import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { BufferAttribute } from "three";

export default class Avatar {
  constructor(scene) {
    const mesh = require("./Resources/Meshes/cube.obj");
    const loader = new OBJLoader();
    loader.load(mesh.default, (object) => {
      this.geometry = object.children[0].geometry;
      this.initialize_mesh(scene);
      scene.add(this.mesh);
    });

    this.texture = new Texture("world.jpg");

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.light = new THREE.SpotLight(0xffffff);

    this.light.angle = Math.PI / 6;
    this.light.penumbra = 0.5;
    this.light.decay = 2;

    this.active = false;
    this.attached = false;

    this.fb_motion = 0; //front back axis: front=1 back = -1
    this.lr_motion = 0; //left right axis: right=1 left = -1

    this.camera.add(this.light);
    this.light.position.set(0, 0, 1);
    this.light.target = this.camera;

    this.map = 0;

    this.speed = 0.3;
    this.y_velocity = 0.5;
  }

  initialize_mesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.texture.material[0]);

    this.mesh.position.y += 0.5;

    this.mesh.add(this.camera);
    this.control = new PointerLockControls(this.mesh, document.body);

    this.mesh.position.z = 10;
    this.map_simple();
    this.floor = this.mesh.position.y;
  }

  toggle_map() {
    if (this.map == 0) {
      this.map_spherical();
      this.map = 1;
    } else {
      this.map_simple();
      this.map = 0;
    }
  }

  map_spherical() {
    var geometry = this.geometry;
    var u_array = [];
    var v_array = [];
    geometry.computeBoundingSphere();
    const radius = geometry.boundingSphere.radius;
    const centre_x = geometry.boundingSphere.center.x;
    const centre_y = geometry.boundingSphere.center.y;
    const centre_z = geometry.boundingSphere.center.z;

    var start_x, start_z;
    for (var i = 0; i < geometry.attributes.position.count; i++) {
      if (geometry.attributes.position.array[3 * i + 1] - centre_y != 0) {
        start_x = geometry.attributes.position.array[3 * i] - centre_x;
        start_z = geometry.attributes.position.array[3 * i + 2] - centre_z;

        break;
      }
    }

    var u_start;
    const c_radius = Math.sqrt(start_x * start_x + start_z * start_z);

    if (start_x >= 0 && start_z >= 0) {
      u_start = Math.asin(start_z / c_radius) / (2 * Math.PI);
    } else if (start_x < 0 && start_z >= 0) {
      u_start = Math.asin(-(start_x) / c_radius) / (2 * Math.PI) + 0.25;
    } else if (start_x < 0 && start_z < 0) {
      u_start = Math.asin(-(start_z) / c_radius) / (2 * Math.PI) + 0.5;
    } else if (start_x >= 0 && start_z < 0) {
      u_start = Math.asin(start_x / c_radius) / (2 * Math.PI) + 0.75;
    }
    u_start = Math.round(u_start * 1000) / 1000;

    for (var i = 0; i < geometry.attributes.position.count; i++) {
      var x = geometry.attributes.position.array[3 * i] - centre_x;
      var y = geometry.attributes.position.array[3 * i + 1] - centre_y;
      var z = geometry.attributes.position.array[3 * i + 2] - centre_z;

      var v = Math.asin(y / radius) / (Math.PI) + 0.5;
      var u = 0;
      const c_radius = Math.sqrt(x * x + z * z);

      if (x >= 0 && z >= 0) {
        u = Math.asin((z / c_radius)) / (2 * Math.PI);
      } else if (x < 0 && z >= 0) {
        u = Math.asin((-x / c_radius)) / (2 * Math.PI) + 0.25;
      } else if (x < 0 && z < 0) {
        u = Math.asin((-z / c_radius)) / (2 * Math.PI) + 0.5;
      } else if (x >= 0 && z < 0) {
        u = Math.asin((x / c_radius)) / (2 * Math.PI) + 0.75;
      }

      u = Math.round(u * 1000) / 1000;

      u = u - u_start;

      if (u < 0) {
        u += 1;
      }

      u_array.push(u);
      v_array.push(v);
    }

    for (var i = 0; i < u_array.length; i++) {
      if (u_array[i] == 0) {
        if (i % 3 == 0) {
          if (u_array[i + 1] > 0.5) {
            u_array[i] = 1;
          } else if (u_array[i + 1] == 0 && u_array[i + 2] > 0.5) {
            u_array[i] = 1;
          }
        } else if (i % 3 == 1) {
          if (u_array[i - 1] > 0.5) {
            u_array[i] = 1;
          }
        } else if (i % 3 == 2) {
          if (u_array[i - 1] > 0.5) {
            u_array[i] = 1;
          }
        }
      }
    }

    var uv = [];

    for (var i = 0; i < u_array.length; i++) {
      uv.push(u_array[i], v_array[i]);
    }

    const uv_attribute = new BufferAttribute(new Float32Array(uv), 2);
    geometry.setAttribute("uv", uv_attribute);
  }

  map_simple() {
    var geometry = this.geometry;
    var uv = [];

    for (var i = 0; i < geometry.attributes.position.count; i += 3) {
      uv.push(0, 0, 0, 1, 1, 1);
    }

    const uv_attribute = new BufferAttribute(new Float32Array(uv), 2);
    geometry.setAttribute("uv", uv_attribute);
  }

  activate() {
    this.active = true;
    this.control.lock();
  }

  deactivate() {
    this.active = false;
    this.control.unlock();
  }

  keydown(key) {
    if (key === "w") {
      this.fb_motion = 1;
    } else if (key === "s") {
      this.fb_motion = -1;
    } else if (key === "a") {
      this.lr_motion = -1;
    } else if (key === "d") {
      this.lr_motion = 1;
    }
  }

  keyup(key) {
    if (key === "w" || key === "s") {
      this.fb_motion = 0;
    } else if (key === "a" || key === "d") {
      this.lr_motion = 0;
    }
  }

  move() {
    if (this.active && !(this.attached)) {
      this.control.moveForward(this.fb_motion * this.speed);
      this.control.moveRight(this.lr_motion * this.speed);
    }

    if (this.mesh.position.y > this.floor) {
      this.mesh.position.y += this.y_velocity;
      if (this.mesh.position.y < this.floor) {
        this.mesh.position.y = this.floor;
        this.y_velocity = 0;
        return;
      }
      this.y_velocity -= 0.03;
    } else {
      this.mesh.position.y = this.floor;
      this.y_velocity = 0;
    }
  }

  jump() {
    if (this.active && this.y_velocity == 0) {
      this.y_velocity = 0.5;
      this.mesh.position.y = this.floor + 0.01;
    }
  }

  toggle_texture() {
    this.mesh.material = this.texture.toggle();
  }

  attach(object) {
    object.mesh.geometry.computeBoundingBox();
    this.floor = object.mesh.geometry.boundingBox.max.y + 0.5;
    this.mesh.position.set(0, this.floor, 0);
    this.mesh.parent.remove(this.mesh);
    object.mesh.add(this.mesh);
    this.attached = true;
  }

  dettach(scene) {
    this.mesh.parent.remove(this.mesh);
    scene.add(this.mesh);
    this.floor = 0.5;
    this.attached = false;
  }

  collision_detection(objects, movingObj) {
    this.mesh.geometry.computeBoundingBox();
    this.mesh.geometry.boundingBox.max.add(this.mesh.position);
    this.mesh.geometry.boundingBox.min.add(this.mesh.position);

    objects.forEach((o) => {
      o.mesh.geometry.computeBoundingBox();
      if (
        o.mesh.geometry.boundingBox.applyMatrix4(o.mesh.matrixWorld)
          .intersectsBox(
            this.mesh.geometry.boundingBox,
          )
      ) {
        console.log("Collision Detected with a Static Object");
      }
    });

    movingObj.forEach((obj) => {
      obj.getGeometry().forEach((obj_mesh) => {
        obj_mesh.geometry.computeBoundingBox();
        if (
          obj_mesh.geometry.boundingBox.applyMatrix4(obj_mesh.matrixWorld)
            .intersectsBox(
              this.mesh.geometry.boundingBox,
            )
        ) {
          console.log("Collision Detected with a Dynamic Object");
        }
      });
    });
  }
}

import Mobile_NPC from "./Mobile_NPC.js";

export default class Train{

    constructor(count, parent, path, delta_displacement = 0.02){

        this.leader = new Mobile_NPC(parent, "cube.obj",1, path);
        this.objects = [];
        for(var i = 1; i < count; i++){
            this.objects.push(new Mobile_NPC(parent, "cube.obj",1 - (i * delta_displacement), path));
        }

    }

    move(){

        this.leader.move();
        this.objects.forEach((x) => x.move());

    }

}
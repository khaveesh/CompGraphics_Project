import Mobile_NPC from "./Mobile_NPC.js";
import Wheel from "./Wheel.js";

export default class Train{

    constructor(count, parent, path, delta_displacement = 0.02){

        this.leader = new Mobile_NPC(parent, "engine.obj",1, path,[0,0,0],[0,0,0],0.4,[]);
        const wheel1 = new Wheel(this.leader,0.2,[1.3,-0.8,0],[0,0,0],0.2);
        const wheel2 = new Wheel(this.leader,-0.2,[-1.3,-0.8,0],[0,Math.PI,0],0.2);
        const wheel3 = new Wheel(this.leader,0.2,[1.3,-0.8,-2.5],[0,0,0],0.2);
        const wheel4 = new Wheel(this.leader,-0.2,[-1.3,-0.8,-2.5],[0,Math.PI,0],0.2);

        this.leader.add_moving_children([wheel1, wheel2,wheel3, wheel4]);
        this.objects = [];
        for(var i = 1; i < count; i++){
            this.objects.push(new Mobile_NPC(parent, "compartment.obj",1 - (i * delta_displacement), path));
        }
        
    }

    move(){

        this.leader.move();
        this.objects.forEach((x) => x.move());

    }

}
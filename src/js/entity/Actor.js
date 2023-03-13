import AdamMilazzoFov from "../map/fov/AdamMilazzoFov";
import _Entity from "./_Entity";

export default class Actor extends _Entity {
    constructor(args = {}) {
        args.type = "actor";
        super(args);

        this.fov = new AdamMilazzoFov();
    }


    clone() {
        return new Actor(this.save());
    }

    isAlive() {
        const fighter = this.getComponent("fighter");
        return fighter && fighter.hp.get() > 0;
    }
}
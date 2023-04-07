import AdamMilazzoFov from "../../engine/renderer/tiled/fov/AdamMilazzoFov";
import _Entity from "../../engine/entity/_Entity";

export default class Actor extends _Entity {
    constructor(json = {}) {
        json.type = "actor";
        super(json);

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